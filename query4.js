import { read } from "fs";
import { MongoClient } from "mongodb";

/* 
Query4: (25pts) Who are the top 10 people that got more retweets in average, after tweeting more than 3 times
*/

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017";

const client = await MongoClient.connect(MONGO_URL);
const coll = client.db("ieeevisTweets").collection("tweet");

const filter = {};

const cursor = coll.find(filter);
const tweets = await cursor.toArray();

const tweetCount = new Map();
const retweetCount = new Map();

for (const tweet of tweets) {
    const name = tweet.user.screen_name;
    if (tweetCount.has(name)) {
        tweetCount.set(name, tweetCount.get(name) + 1);
        retweetCount.set(name, retweetCount.get(name) + tweet.retweet_count);
    } else {
        tweetCount.set(name, 1);
        retweetCount.set(name, tweet.retweet_count);
    }
}

const moreThan3 = new Array();

for (const [name, count] of tweetCount.entries()) {
    if (count > 3) {
        moreThan3.push([name, retweetCount.get(name) / count]);
    }
}

const top10 = moreThan3.sort((a, b) => b[1] - a[1]).slice(0, 10);

console.log(top10);

await client.close();
