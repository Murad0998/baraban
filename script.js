const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spinButton");

const prizes = ["Дилдо", "Презики", "Юлдаш", "Приз 4", "Приз 5", "Приз 6"];
let angle = 0;
let spinning = false;
let targetAngle = 0;
let speed = 0;
let animationFrame;

function drawWheel(rotation) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150;
    const sliceAngle = (2 * Math.PI) / prizes.length;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);

    for (let i = 0; i < prizes.length; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, sliceAngle * i, sliceAngle * (i + 1));
        ctx.fillStyle = i % 2 === 0 ? "#4682B4" : "#00FA9A";
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.rotate(sliceAngle * i + sliceAngle / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#000";
        ctx.font = "20px Arial";
        ctx.fillText(prizes[i], radius - 10, 10);
        ctx.restore();
    }
    ctx.restore();
}

function animateSpin() {
    if (Math.abs(targetAngle - angle) > 0.01) {
        angle += speed;
        speed *= 0.98;  // Постепенное замедление
        animationFrame = requestAnimationFrame(animateSpin);
    } else {
        cancelAnimationFrame(animationFrame);
        angle = targetAngle % (2 * Math.PI); // Угол должен быть в пределах 0 - 2π

        let sectorSize = (2 * Math.PI) / prizes.length;
        let winningIndex = Math.floor((angle + sectorSize / 2) / sectorSize) % prizes.length;
        let winningPrize = prizes[winningIndex];

        spinning = false;

        // Отображаем результат
        console.log(`Выигранный приз: ${winningPrize}`);

        if (window.Telegram && Telegram.WebApp) {
            console.log("Сообщение должно появиться в Telegram");
            Telegram.WebApp.showAlert(`Вы выиграли: ${winningPrize}`);
        } else {
            console.log("Сообщение должно появиться в alert");
            alert(`Вы выиграли: ${winningPrize}`);
        }
    }
    drawWheel(angle);
}

function spinWheel() {
    if (spinning) return;
    spinning = true;

    let randomAngle = Math.random() * (2 * Math.PI) + (5 * 2 * Math.PI); // Минимум 5 полных оборотов
    targetAngle = angle + randomAngle;
    speed = (targetAngle - angle) / 60; // Регулировка скорости
    animateSpin();
}

drawWheel(angle);
spinButton.addEventListener("click", spinWheel);
