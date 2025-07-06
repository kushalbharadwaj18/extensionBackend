// backend/index.js
// const express = require("express");
// const axios = require("axios");
// const cors = require("cors");
// const dotenv = require("dotenv");

// dotenv.config(); // make sure this is included to load environment variables

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.post("/api/ask", async (req, res) => {
//   const { query, model } = req.body;
//   let apiUrl = "",
//     headers = {},
//     payload = {},
//     response;

//   try {
//     switch (model) {
//     //   case "deepseek":
//     //     apiUrl = "https://api.deepseek.com/chat/completions";
//     //     headers = {
//     //       Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
//     //       "Content-Type": "application/json",
//     //     };
//     //     payload = {
//     //       model: "deepseek-chat",
//     //       messages: [{ role: "user", content: query }],
//     //     };
//     //     break;

//       case "gemini":
//         apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
//         headers = {
//           "Content-Type": "application/json",
//         };
//         payload = {
//           contents: [
//             {
//               parts: [{ text: query }],
//               role: "user",
//             },
//           ],
//         };
//         break;

//       case "llama":
//         apiUrl = "https://api.groq.com/openai/v1/chat/completions";
//         headers["Authorization"] = `Bearer ${process.env.GROQ_API_KEY}`;
//         payload = {
//           model: "llama3-70b-8192",
//           messages: [{ role: "user", content: query }],
//         };
//         break;

//       default:
//         return res.status(400).json({ error: "Unsupported model" });
//     }

//     response = await axios.post(apiUrl, payload, { headers });
//     const reply =
//       model === "gemini"
//         ? response.data.candidates[0].content.parts[0].text
//         : response.data.choices[0].message.content;

//     res.json({ reply });
//   } catch (e) {
//     res.status(500).json({ error: e.message });
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));










// api/ask.js
import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/ask", async (req, res) => {
  const { query, model } = req.body;
  let apiUrl = "", headers = {}, payload = {}, response;

  try {
    switch (model) {
      case "gemini":
        apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        headers = { "Content-Type": "application/json" };
        payload = {
          contents: [{ parts: [{ text: query }], role: "user" }],
        };
        break;

      case "llama":
        apiUrl = "https://api.groq.com/openai/v1/chat/completions";
        headers["Authorization"] = `Bearer ${process.env.GROQ_API_KEY}`;
        payload = {
          model: "llama3-70b-8192",
          messages: [{ role: "user", content: query }],
        };
        break;

      default:
        return res.status(400).json({ error: "Unsupported model" });
    }

    response = await axios.post(apiUrl, payload, { headers });
    const reply =
      model === "gemini"
        ? response.data.candidates[0].content.parts[0].text
        : response.data.choices[0].message.content;

    res.json({ reply });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Export as Vercel serverless function
module.exports = app;
