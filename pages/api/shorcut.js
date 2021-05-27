//import axios from 'axios';
import parser from '../../wino/nextShortCut'
export default async ({query}, res) => {
    const { url = null } = query;
    if (!url) return res.json({ result, status: "ok" })
    try {

        const result = await parser(url);
        res.json({ result, status: "ok" })


    } catch (error) {
        console.log({ error });
        res.json([]);
    }




}