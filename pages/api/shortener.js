//import axios from 'axios';
import parser from '../../wino/next-shortener'
export default async (req, res) => {
    const { url = "" } = req.query;
  //  console.log(url)
    if (!url || url==="") return res.json({ message: "no url :(" });
    try {

        const result = await parser(url);
        res.json({ result, status: "ok" })

    } catch (error) {
        console.log({ error });
        res.json([]);
    }




}