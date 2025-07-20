# MindMate – AI Wellness Companion for Students

MindMate is a web-based mental health support platform that uses AI to help college students reflect on their emotions, track moods, and access personalized content to improve their mental well-being — privately and without judgment.

---

## Problem Statement

Many college students experience stress, anxiety, or sadness but hesitate to seek help due to social stigma, lack of time, or limited access to mental health professionals. MindMate bridges this gap by offering a 24/7 intelligent listener and support system using the power of Generative AI.

---

## Tech Stack

Frontend: HTML, CSS, JavaScript (Vanilla + EJS)  
Backend: Node.js, Express.js  
AI API: Google Gemini Generative AI  
Storage: JSON-based file storage  
YouTube API: Currently non-functional, uses placeholder video card

---

## Features

1. Gemini AI Chat Support  
   - Students can express their feelings in natural language.  
   - Gemini AI responds empathetically and contextually.  
   - Acts as a non-judgmental outlet for emotional expression.

2. Mood Tracking with Journaling  
   - Users select a mood (Happy, Sad, Neutral, etc.) and optionally write a note.  
   - Each mood entry is timestamped and stored locally.

3. Weekly Mood Summary  
   - After 7 mood entries, the system generates a personalized summary.  
   - Example: "Your past week was mostly calm and hopeful with a few low points."

4. YouTube Recommendation (AI-Powered)  
   - Recent chat history is used to generate a YouTube search query via Gemini AI.  
   - Currently displays dummy content due to YouTube API limitations.

5. Static Resource Cards  
   - Displays curated blogs, videos, and podcasts focused on mental health.  
   - These are always available and useful regardless of API responses.

---

## Current Working Features

- Gemini AI integration for contextual emotional conversation
- Mood logging with optional journaling
- Mood summary after every 7 entries
- Static mental health resource cards
- Placeholder YouTube video suggestion card
- JSON-based local storage of chats and moods

---

## Features Coming Soon

- Login and Sign Up system to personalize and secure user sessions
- Mood and Chat History view with timeline UI
- Extended mood selection for broader emotional representation
- Weekly Mood Trend Analysis based on past entries
- Database integration (MongoDB or PostgreSQL) for reliable data storage and retrieval

---

## Project Structure

`mindmate/
├── public/ # Static assets (CSS, images)
├── views/ # EJS templates
├── routes/ # Express routers
├── data/ # moodLogs.json, chatHistory.json
├── .env # Environment variables
├── app.js # Entry point
└── README.md`

---

## Setup Instructions

1. Clone the repository:
`git clone https://github.com/Chinmayikelkar/MindMate.git`

1. Install dependencies:
`npm install`

1. Create a `.env` file:
GEMINI_API_KEY=your_gemini_api_key (Genereative Language API)
YOUTUBE_API_KEY=your_youtube_api_key (YouTube data API v3)

1. Start the development server:
`node app.js` or `npm start`

1. Open the application:
http://localhost:3000

---

## Disclaimer

MindMate does not provide therapy, diagnose conditions, or make medical predictions.  
It is intended solely as a self-reflection and wellness support tool.

---

## Notes for Evaluators

- Gemini AI is functional and integrated.
- YouTube API functionality is not active; dummy video suggestion is shown instead.
- Mood tracking and summaries are working and stored properly.
- Future plans include authentication, database integration, and mood analytics.

---

## Contact

For questions, contributions, or collaboration, please contact the developer or open a pull request.
