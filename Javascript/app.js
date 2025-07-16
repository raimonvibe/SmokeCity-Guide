const recognizeBtn = document.getElementById("recognizeBtn");
const songResult = document.getElementById("songResult");

let mediaRecorder;
let audioChunks = [];

recognizeBtn.addEventListener("click", async () => {
  songResult.innerHTML = `<p>🎤 Listening for 10 seconds...</p>`;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = event => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      songResult.innerHTML = `<p>⏳ Sending to server...</p>`;

      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const formData = new FormData();
      formData.append("audio", audioBlob, "sample.wav");

      try {
        const response = await fetch("http://localhost:5000/recognize", {
          method: "POST",
          body: formData
        });

        const result = await response.json();
        console.log(result);

        if (result.status && result.status.msg === "Success") {
          const music = result.metadata.music[0];
          songResult.innerHTML = `
            <h3>🎶 Song Recognized</h3>
            <p><strong>Title:</strong> ${music.title}</p>
            <p><strong>Artist:</strong> ${music.artists[0].name}</p>
            <p><strong>Album:</strong> ${music.album.name}</p>
          `;
        } else {
          songResult.innerHTML = `<p>❌ Song not recognized</p>`;
        }
      } catch (error) {
        console.error("Recognition error:", error);
        songResult.innerHTML = `<p>❌ Error contacting server</p>`;
      }
    };

    mediaRecorder.start();

    // Stop after 10 seconds
    setTimeout(() => {
      mediaRecorder.stop();
      stream.getTracks().forEach(track => track.stop()); // Cleanup
    }, 10000);

  } catch (err) {
    console.error("Microphone error:", err);
    songResult.innerHTML = `<p>❌ Microphone access denied</p>`;
  }
});
