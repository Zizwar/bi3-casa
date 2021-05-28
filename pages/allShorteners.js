import { connectToDatabase } from "../util/mongodb";

export default function Movies({ shortenres }) {
  return (
    <div>
      <h1>Top 20 shortenres of All Time</h1>
      <p>
        <small>(According to Metacritic)</small>
      </p>
      <ul>
        {shortenres.map((shortenre) => (
          <li>
            <h2>{shortenre.description}</h2>
            <h3>{shortenre.title}</h3>
            <p>{shortenre.image}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function getServerSideProps() {
  const { db } = await connectToDatabase();

  const shortenres = await db
    .collection("shortenres")
    .find({})
    .sort({ metacritic: -1 })
    .limit(20)
    .toArray();

  return {
    props: {
      shortenres: JSON.parse(JSON.stringify(shortenres)),
    },
  };
}