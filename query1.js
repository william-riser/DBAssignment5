import { read } from "fs";
import { MongoClient } from "mongodb";

/* 
Query1: (10pts) How many tweets are not retweets or replies? 
(hint the field retweeted_status contains an object when the tweet is a retweeet)
*/

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017";

const client = await MongoClient.connect(MONGO_URL);
const coll = client.db("ieeevisTweets").collection("tweet");

const filter = {
  retweeted: false,
  is_quote_status: false,
};

const cursor = coll.find(filter);
const result = await cursor.toArray();

console.log(result.length);

await client.close();
