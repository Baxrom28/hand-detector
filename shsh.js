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


function checkFingers(predictions) {
    if (predictions.length > 0) {
        const fingersUp = predictions[0].annotations.thumb[3][1] < predictions[0].annotations.indexFinger[3][1];
        isTwoFingers = fingersUp && predictions[0].landmarks[9][1] < predictions[0].landmarks[7][1];
    } else {
        isTwoFingers = false;
    }
}

function takePicture() {
    if (isTwoFingers) {
        const canvas = document.getElementById('canvas');
        const pictureDataUrl = canvas.toDataURL('image/png');
        savedPictures.push(pictureDataUrl);
        alert('Picture taken and saved!');
    } else {
        alert('Show two fingers to take a picture.');
    }
}