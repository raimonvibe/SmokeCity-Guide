# 🎵 Step 2: Testing Audio Recognition & Frontend Integration

**First, open `play.html` in your browser at `http://localhost:5000/play.html` and click the microphone button to test the audio recognition - you'll need to grant microphone permissions and play music for 10 seconds while it listens.** **Next, examine the `Javascript/app.js` file to understand how the frontend captures audio using `MediaRecorder`, sends it to the `/recognize` endpoint via FormData, and displays the song results with title, artist, and album information.** **Finally, test error scenarios like denying microphone access or playing unrecognizable audio to see how the app handles different response cases from the ACRCloud API, and check the browser console for debugging information if recognition fails.**

---

*This builds on the basic setup from BEGINNER_GUIDE.md - make sure you've completed Step 1 first!*
