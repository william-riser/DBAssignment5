import { read } from "fs";
import { MongoClient } from "mongodb";

/* 
Query2: (10pts) Return the top 10 screen_names by their number of followers.
*/

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017";

const client = await MongoClient.connect(MONGO_URL);
const coll = client.db("ieeevisTweets").collection("tweet");

const filter = {
    
};

const nameMap = new Map();
const cursor = coll.find(filter);
const tweets = await cursor.toArray();

for (const tweet of tweets) {
    const name = tweet.user.screen_name;
    nameMap.set(name, tweet.user.followers_count);
}
const sortedNames = Array.from(nameMap.entries()).sort((a, b) => b[1] - a[1]);
console.log(sortedNames.slice(0, 10));
await client.close();
