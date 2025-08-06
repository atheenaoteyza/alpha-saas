import { getAuth } from "@clerk/nextjs/server";
import { getOrCreateUser } from "@/utils/getorCreateUser";

import { MongoClient, ServerApiVersion } from "mongodb";
import calcStreak from "@/utils/calcStreak";

const uri = process.env.MONGODB_URI;
console.log("Mongo URI:", process.env.MONGODB_URI);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
  },
});

const db = client.db("pomodoro_test");
const collections = db.collection("users_log");

export default async function handler(req, res) {
  // TEMP: Mock userId (replace with `const { userId } = getAuth(req)` when ready)
  const { userId } = getAuth(req);
  // const { userId, sessionId, getToken } = getAuth(req);
  console.log("User ID:", userId);

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "GET") {
    const user = await getOrCreateUser(userId, collections);
    const { currentStreak, maxStreak } = calcStreak(user.logs || []);
    if (user && currentStreak !== user.streak) {
      await collections.updateOne(
        { _id: userId },
        { $set: { streak: currentStreak } }
      );
    }
    return res.status(200).json({
      logs: Array.isArray(user.logs) ? user.logs : [],
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
          $push: { logs: { date, focusTime } },
          $setOnInsert: { streak: 0 }, // In case user doesn't exist
        },
        { upsert: true }
      );
    }

    // Fetch logs in a projected form (get only what is needed)
    const { logs = [] } = await collections.findOne(
      { _id: userId },
      { projection: { logs: 1 } }
    );

    //Fetch updated logs and recalculate streak
    const { currentStreak, maxStreak } = calcStreak(logs);

    await collections.updateOne(
      { _id: userId },
      { $set: { streak: currentStreak } }
    );

    return res.status(201).json({
      success: true,
      logs,
      days: { currentStreak, maxStreak },
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
