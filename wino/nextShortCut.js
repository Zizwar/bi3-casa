//include in https://github.com/nasa8x/html-metadata-parser switch to nextjs
import { parse } from 'node-html-parser';
import axios from 'axios';


const isUrl = (s) => {
    return s && /((http(s)?):\/\/[\w\.\/\-=?#]+)/i.test(s);
},

    trim = (s) => {
        return (s && s.trim && s.trim().replace(/\s+/g, ' ')) || '';
    },

    readMT = (el, name) => {
        var attr = el.getAttribute('name') || el.getAttribute('property');
        return attr == name ? el.getAttribute('content') : null;
    },

    images = ($, t) => {

        var images = [];
        var _this = this;
        if (t == 'og') {

            $.querySelectorAll('meta').forEach(function (el) {

                var propName = el.getAttribute('property') || el.getAttribute('name');
                var content = el.getAttribute('content');
                if (propName === 'og:image' || propName === 'og:image:url') {
                    images.push({ url: content });
                }

                var current = images[images.length - 1] || {};

                switch (propName) {
                    case 'og:image:secure_url':
                        current.secure_url = content;
                        break;
                    case 'og:image:type':
                        current.type = content;
                        break;
                    case 'og:image:width':
                        current.width = parseInt(content, 10);
                        break;
                    case 'og:image:height':
                        current.height = parseInt(content, 10);
                        break;
                }
            });
        }
        else {

            $.querySelectorAll('img').forEach(function (el) {

                var src = el.getAttribute('src');

                if (src && isUrl(src)) {

                    var width = el.getAttribute('width');
                    var height = el.getAttribute('height');
                    var img = { url: src };
                    if (width) { img.width = parseInt(width, 10); }
                    if (height) { img.height = parseInt(height, 10); }
                    images.push(img);
                }
            });

        }

        return images;
    },

    videos = ($) => {
        var videos = [];

        $.querySelectorAll('meta').forEach(function (el) {
            var propName = el.getAttribute('property') || el.getAttribute('name');
            var content = el.getAttribute('content');

            if (propName === 'og:video' || propName === 'og:video:url') {
                videos.push({ url: content });
            }

            var current = videos[videos.length - 1];

            switch (propName) {
                case 'og:video:secure_url':
                    current.secure_url = content;
                    break;
                case 'og:video:type':
                    current.type = content;
                    break;
                case 'og:video:width':
                    current.width = parseInt(content, 10);
                    break;
                case 'og:video:height':
                    current.height = parseInt(content, 10);
                    break;
            }

        });


        return videos;
    };



export default (x, callback) => {



    let o = {
        method: 'get',
        headers: {
            //'User-Agent': 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Safari/537.36',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36 OPR/68.0.3618.63',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }

    };

    if (typeof x === 'object' && x !== null) {
        o = Object.assign(o, x);
    } else if (isUrl(x)) {
        o = Object.assign(o, { url: x });
    }

    return new Promise(function (resolve, reject) {
        axios(o).then(function ({ data }) {

            const og = {}, meta = {};
            const $ = parse(data);

            og.images = images($, 'og');
            og.videos = videos($);
            let title = $.querySelector('title');
            if (title)
                meta.title = title.text;
            const metas = $.querySelectorAll('meta');

            for (let i = 0; i < metas.length; i++) {
                const el = metas[i];

                if (readMT(el, 'og:title'))
                    og.title = readMT(el, 'og:title');

                if (readMT(el, 'og:description'))
                    og.description = readMT(el, 'og:description');

                if (readMT(el, 'og:image'))
                    og.image = readMT(el, 'og:image');

                if (readMT(el, 'og:url'))
                    og.url = readMT(el, 'og:url');

                if (readMT(el, 'og:site_name'))
                    og.site_name = readMT(el, 'og:site_name');

                if (readMT(el, 'og:type'))
                    og.type = readMT(el, 'og:type');

                // meta
                if (readMT(el, 'title'))
                    meta.title = readMT(el, 'title');

                if (readMT(el, 'description'))
                    meta.description = readMT(el, 'description');

                if (readMT(el, 'image'))
                    meta.image = readMT(el, 'image');

            }

            const result = { meta: meta, og: og, images: images($) };

            callback && callback(null, result);
            resolve(result);

        }).catch(function (err) {
            callback && callback(err, null);
            reject(err);
        })
    });


}
