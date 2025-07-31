import { getAuth } from "@clerk/nextjs/server";

import { MongoClient, ServerApiVersion } from "mongodb";
import calcStreak from "@/utils/calcStreak";

const uri =
  "mongodb+srv://atheena:atheena@mongodbtest.rmhtg3t.mongodb.net/?retryWrites=true&w=majority&appName=mongodbtest";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
  },
});

const db = client.db("pomodoro_test");
const collections = db.collection("users_log");

export default async function handler(req, res) {
  // TEMP: Mock userId (replace with `const { userId } = getAuth(req)` when ready)
  // const userId = "user_abc123";
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "GET") {
    const user = await collections.findOne({ _id: userId });
    if (!user) {
      await collections.insertOne({
        _id: userId,
        logs: [],
        streak: 0,
      });
    }
    const { currentStreak, maxStreak } = calcStreak(user.logs);
    if (user && currentStreak !== user.streak) {
      await collections.updateOne(
        { _id: userId },
        { $set: { streak: currentStreak } }
      );
    }
    return res.status(200).json({
      logs: user.logs || [],
      days: { currentStreak, maxStreak },
    });
  }

  if (req.method === "POST") {
    const { date, focusTime } = req.body;

    const userEntry = await collections.updateOne(
      { _id: userId, "logs.date": date },
      {
        $inc: { "logs.$.focusTime": focusTime },
      }
    );
    if (userEntry.matchedCount === 0) {
      await collections.updateOne(
        {
          _id: userId,
        },
        {
          $push: {
            logs: { date, focusTime },
          },
        },
        { upsert: true }
      );
    }

    return res.status(201).json({ success: true, date, focusTime });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
