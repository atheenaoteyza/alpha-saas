// utils/getOrCreateUser.js

export async function getOrCreateUser(userId, collection) {
  const existingUser = await collection.findOne({ _id: userId });
  if (existingUser) return existingUser;

  const newUser = {
    _id: userId, // Clerk user ID
    logs: [],
    streak: 0,
  };

  await collection.insertOne(newUser);
  return newUser;
}
