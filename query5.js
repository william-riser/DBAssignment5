import { read } from "fs";
import { MongoClient } from "mongodb";

/* 
Query5: (30pts) Write the instructions that will separate the Users information into a different collection

Create a user collection that contains all the unique users.
Create a new Tweets_Only collection, that doesn't embed the user information, but instead references it using the user id
*/

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017";

const client = await MongoClient.connect(MONGO_URL);
const coll = client.db("ieeevisTweets").collection("tweet");

const filter = {};

const cursor = coll.find(filter);
const tweets = await cursor.toArray();

const userCollection = client.db("ieeevisTweets").collection("user");
const tweetsCollection = client.db("ieeevisTweets").collection("Tweets_Only");

const userIdSet = new Set();

try {
  console.log("Dropping collections...");
  userCollection.drop();
  tweetsCollection.drop();
  console.log("Collections dropped");
} catch (e) {
  console.log("Collctions do not exist");
}

for (const tweet of tweets) {
  userIdSet.add(tweet.user.id);
  await tweetsCollection.insertOne({
    user_id: tweet.user.id,
    created_at: tweet.created_at,
    id: tweet.id,
    id_str: tweet.id_str,
    text: tweet.text,
    truncated: tweet.truncated,
    entities: tweet.entities,
    metadata: tweet.metadata,
    source: tweet.source,
    in_reply_to_status_id: tweet.in_reply_to_status_id,
    in_reply_to_status_id_str: tweet.in_reply_to_status_id_str,
    in_reply_to_user_id: tweet.in_reply_to_user_id,
    in_reply_to_user_id_str: tweet.in_reply_to_user_id_str,
    in_reply_to_screen_name: tweet.in_reply_to_screen_name,
    geo: tweet.geo,
    coordinates: tweet.coordinates,
    place: tweet.place,
    contributors: tweet.contributors,
    is_quote_status: tweet.is_quote_status,
    retweet_count: tweet.retweet_count,
    favorite_count: tweet.favorite_count,
    favorited: tweet.favorited,
    retweeted: tweet.retweeted,
    possibly_sensitive: tweet.possibly_sensitive,
    lang: tweet.lang,
  });
}

for (const userId of userIdSet) {
  const user = tweets.find((tweet) => {
    return tweet.user.id === userId;
  }).user;
  await userCollection.insertOne(user);
}

console.log("Finished");

await client.close();
