const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spinButton");

const prizes = ["Приз 1", "Приз 2", "Приз 3", "Приз 4", "Приз 5", "Приз 6"];
let angle = 0;
let spinning = false;

function drawWheel() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150;
    const sliceAngle = (2 * Math.PI) / prizes.length;

    for (let i = 0; i < prizes.length; i++) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, sliceAngle * i, sliceAngle * (i + 1));
        ctx.fillStyle = i % 2 === 0 ? "#FFD700" : "#FF4500";
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(sliceAngle * i + sliceAngle / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#000";
        ctx.font = "20px Arial";
        ctx.fillText(prizes[i], radius - 10, 10);
        ctx.restore();
    }
}

function spinWheel() {
    if (spinning) return;
    spinning = true;

    let randomAngle = Math.floor(Math.random() * 360) + 1800;
    angle += randomAngle;

    let sectorSize = 360 / prizes.length;
    let finalAngle = angle % 360;
    let winningIndex = Math.floor((360 - finalAngle) / sectorSize) % prizes.length;
    let winningPrize = prizes[winningIndex];

    setTimeout(() => {
        spinning = false;
        if (window.Telegram && Telegram.WebApp) {
            Telegram.WebApp.showAlert(`Вы выиграли: ${winningPrize}`);
        } else {
            alert(`Вы выиграли: ${winningPrize}`);
        }
    }, 4000);
}

drawWheel();
spinButton.addEventListener("click", spinWheel);
