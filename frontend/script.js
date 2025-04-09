const video = document.getElementById("video");
const startBtn = document.getElementById("startBtn");
const placeholder = document.getElementById("placeholder");
const scanLine = document.getElementById("scanLine");

let stream;

startBtn.addEventListener("click", async () => {
  startBtn.disabled = true;
  placeholder.style.display = "none";

  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    scanLine.style.display = "block";
    startScanAnimation();

    // Auto-capture after 3 seconds
    setTimeout(captureAndSend, 3000);
  } catch (err) {
    alert("Camera access denied or not available.");
    console.error(err);
  }
});

function startScanAnimation() {
  scanLine.animate(
    [{ transform: "translateY(0%)" }, { transform: "translateY(100%)" }],
    {
      duration: 1500,
      iterations: Infinity,
      direction: "alternate",
    }
  );
}

function captureAndSend() {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob((blob) => {
    const formData = new FormData();
    formData.append("image", blob, "capture.png");

    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Scan complete! ✅");
        stopCamera();
      })
      .catch((err) => {
        console.error("Upload error:", err);
        alert("Something went wrong!");
        stopCamera();
      });
  }, "image/png");
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
  scanLine.style.display = "none";
}
