//import axios from 'axios';
import parser from '../../wino/nextShortCut'
export default async (_req, res) => {

    parser('https://learnstartup.net/p/BJQWO5_Wnx', function (err, result = []) {
        res.json({ result, status: "ok" })
        if (err)
            console.log('paraser', err);
        res.json({ result, status: "ok" })
    })

}