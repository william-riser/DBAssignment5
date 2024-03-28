import { MongoClient } from 'mongodb';

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';

const client = await MongoClient.connect(
  MONGO_URL,
);
const coll = client.db('ieeevisTweets').collection('tweet');


const filter = {
  'retweet_count': 6
};

const cursor = coll.find(filter);
const result = await cursor.toArray();

console.log(result.length + ' tweets found');

await client.close();
