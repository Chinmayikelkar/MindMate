const fs = require("fs");
const path = require("path");

// File paths
const chatHistoryPath = path.join(__dirname, "../data/chatHistory.json");
const moodLogsPath = path.join(__dirname, "../data/moodLogs.json");

// Read JSON file
const readJsonFile = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return [];
  }
};

// Write JSON file
const writeJsonFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Save chat message
exports.saveChat = (user, assistant) => {
  const chats = readJsonFile(chatHistoryPath);
  chats.push({
    timestamp: new Date().toISOString(),
    user,
    assistant,
  });
  writeJsonFile(chatHistoryPath, chats);
};

// Get all chats
exports.getChats = () => {
  return readJsonFile(chatHistoryPath);
};

// Save mood
exports.saveMood = (mood, note) => {
  const timestamp = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const moodLogs = readJsonFile(moodLogsPath);
  moodLogs.push({ date: timestamp, mood, note });
  writeJsonFile(moodLogsPath, moodLogs);

  let summary = null;
  if (moodLogs.length % 7 === 0) {
    const last7 = moodLogs.slice(-7);
    const count = { happy: 0, neutral: 0, sad: 0 };
    last7.forEach((m) => count[m.mood]++);
    summary = `Your Last 7 Mood Entries\n😊 Happy: ${count.happy}\n😐 Neutral: ${count.neutral}\n😔 Sad: ${count.sad}`;
  }

  return { message: "Mood saved", moods: moodLogs, summary };
};

// Get moods
exports.getMoods = () => {
  return readJsonFile(moodLogsPath);
};
