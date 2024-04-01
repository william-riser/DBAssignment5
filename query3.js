import { read } from "fs";
import { MongoClient } from "mongodb";

/* 
Query3: (10pts) Who is the person that got the most tweets?
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
    if (nameMap.has(name)) {
        nameMap.set(name, nameMap.get(name) + 1);
    } else {
        nameMap.set(name, 1);
    }
}
const sortedNames = Array.from(nameMap.entries()).sort((a, b) => b[1] - a[1]);
console.log(sortedNames[0]);
await client.close();
