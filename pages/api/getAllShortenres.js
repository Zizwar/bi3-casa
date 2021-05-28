import { connectToDatabase } from "../../lib/mongo-db";

export default async (_req, res) => {
  const { db } = await connectToDatabase();

  const shortenres = await db
    .collection("shortenres")
    .find({})
    .sort({ metacritic: -1 })
    .limit(20)
    .toArray();

  res.json(shortenres);
};