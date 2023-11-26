document.addEventListener('DOMContentLoaded', runHandpose);

async function runHandpose() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Load the handpose model
    const handpose = await loadHandpose();

    // Access the camera
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.srcObject = stream;

    // Detect hands in each frame
    video.addEventListener('loadeddata', () => {
        setInterval(async () => {
            const predictions = await handpose.estimateHands(video);
            drawHand(predictions, ctx);
        }, 100);
    });
}

async function loadHandpose() {
    await tf.setBackend('webgl');
    const net = await handpose.load();
    return net;
}

function drawHand(predictions, ctx) {
    ctx.clearRect(0, 0, 640, 480);

    if (predictions.length > 0) {
        predictions.forEach((prediction) => {
            prediction.landmarks.forEach((landmark) => {
                ctx.beginPath();
                ctx.arc(landmark[0], landmark[1], 5, 0, 2 * Math.PI);
                ctx.fillStyle = 'red';
                ctx.fill();
            });
        });
    }
}