require('dotenv').config();
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const axios = require("axios");
const FormData = require("form-data");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, "audio_sample.wav"),
});
const upload = multer({ storage });

// 🔐 Replace with your ACRCloud keys
const host = process.env.ACRCLOUD_HOST || "";
const accessKey = process.env.ACRCLOUD_ACCESS_KEY || "";
const accessSecret = process.env.ACRCLOUD_ACCESS_SECRET || "";

function buildSignature(stringToSign, secret) {
  return crypto
    .createHmac("sha1", secret)
    .update(Buffer.from(stringToSign, "utf-8"))
    .digest("base64");
}

app.post("/recognize", upload.single("audio"), async (req, res) => {
  if (!host || !accessKey || !accessSecret) {
    return res.status(500).json({ 
      error: "ACRCloud credentials not configured. Please set ACRCLOUD_HOST, ACRCLOUD_ACCESS_KEY, and ACRCLOUD_ACCESS_SECRET environment variables." 
    });
  }

  try {
    const filePath = path.join(__dirname, "uploads", "audio_sample.wav");
    const data = fs.readFileSync(filePath);
    const timestamp = Math.floor(Date.now() / 1000);

    const stringToSign = [
      "POST",
      "/v1/identify",
      accessKey,
      "audio",
      "1",
      timestamp,
    ].join("\n");

    const signature = buildSignature(stringToSign, accessSecret);

    const form = new FormData();
    form.append("sample", data, {
      filename: "audio_sample.wav",
      contentType: "audio/wav",
    });
    form.append("access_key", accessKey);
    form.append("data_type", "audio");
    form.append("signature_version", "1");
    form.append("signature", signature);
    form.append("timestamp", timestamp);

    const response = await axios.post(`https://${host}/v1/identify`, form, {
      headers: form.getHeaders(),
    });

    fs.unlinkSync(filePath); // cleanup uploaded file
    res.json(response.data);
  } catch (err) {
    console.error("Recognition error:", err.message);
    res.status(500).json({ error: "Recognition failed" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
