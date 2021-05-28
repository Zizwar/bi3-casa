//include in https://github.com/nasa8x/html-metadata-parser switch to nextjs
import { parse } from 'node-html-parser';
import axios from 'axios';


const isUrl = (url) =>
    url && /((http(s)?):\/\/[\w\.\/\-=?#]+)/i.test(url),
    setHttp = (url) => url.includes('http') ? url : `http://${url}`,
    trim = (s) => (s && s.trim && s.trim().replace(/\s+/g, ' ')) || '',
    readMT = (el, name) => {
        const attr = el.getAttribute('name') || el.getAttribute('property');
        return attr == name ? el.getAttribute('content') : null;
    },

    images = ($, t) => {
        const images = [];
        if (t == 'og') {
            $.querySelectorAll('meta').forEach(function (el) {
                const propName = el.getAttribute('property') || el.getAttribute('name');
                const content = el.getAttribute('content');
                if (propName === 'og:image' || propName === 'og:image:url') {
                    images.push({ url: content });
                }
                const current = images[images.length - 1] || {};
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
                const src = el.getAttribute('src');
                if (src && isUrl(src)) {
                    const width = el.getAttribute('width');
                    const height = el.getAttribute('height');
                    const img = { url: src };
                    if (width) { img.width = parseInt(width, 10); }
                    if (height) { img.height = parseInt(height, 10); }
                    images.push(img);
                }
            });
        }
        return images;
    },
    videos = ($) => {
        const videos = [];
        $.querySelectorAll('meta').forEach(function (el) {
            const propName = el.getAttribute('property') || el.getAttribute('name');
            const content = el.getAttribute('content');
            if (propName === 'og:video' || propName === 'og:video:url') {
                videos.push({ url: content });
            }
            const current = videos[videos.length - 1];

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

export default (url) => {

    return new Promise((resolve_, reject_) => {
        if (!url) return reject_({ message: "not url :(" })
        let params = {
            method: 'get',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36 OPR/68.0.3618.63',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            }
        };

        url = setHttp(url)
        console.log({ url })
        if (!isUrl(url))
            return reject_({ message: "bad url :(" })

        params = Object.assign(params, { url });


        // return new Promise(function (resolve, reject) {
        axios(params).then(function ({ data }) {

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

            const result = { meta, og, images: images($) };

            // callback && resolve_(result);
            resolve_(result);

        }).catch(function (err) {
            // callback && re(err, null);
            reject_(err);
        })
        //  });


    })
}
