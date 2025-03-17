const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spinButton");

console.log("Скрипт загружен!");

const prizes = ["Дилдо", "Презики", "Юлдаш", "Приз 4", "Приз 5", "Приз 6"];
let angle = 0;
let spinning = false;
let targetAngle = 0;
let startAngle = 0;
let startTime = 0;
const totalDuration = 4000; // Длительность спина - 4 секунды

function drawWheel(rotation) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150;
    const sliceAngle = (2 * Math.PI) / prizes.length;

    // Перемещаем систему координат в центр колеса
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);

    // Рисуем сектора колеса
    for (let i = 0; i < prizes.length; i++) {
        let startSlice = sliceAngle * i;
        let endSlice = sliceAngle * (i + 1);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startSlice, endSlice);

        // Градиент для сектора
        let gradient = ctx.createRadialGradient(0, 0, radius * 0.2, 0, 0, radius);
        if (i % 2 === 0) {
            gradient.addColorStop(0, "#FF8C00"); // насыщенный оранжевый
            gradient.addColorStop(1, "#FFD700"); // золотой
        } else {
            gradient.addColorStop(0, "#FFA500"); // оранжевый
            gradient.addColorStop(1, "#FFC107"); // янтарный
        }
        ctx.fillStyle = gradient;
        ctx.fill();

        // Обводка сектора
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Отрисовка текста по дуге
        ctx.save();
        ctx.rotate(startSlice + sliceAngle / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#000";
        ctx.font = "bold 20px Arial";
        ctx.fillText(prizes[i], radius - 10, 10);
        ctx.restore();
    }
    ctx.restore();

    // Рисуем внешнюю обводку колеса
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#8B4513"; // тёмно-коричневый цвет для рамки
    ctx.stroke();

    // Рисуем центральный круг (шпиндель)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    let hubGradient = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 30);
    hubGradient.addColorStop(0, "#FFFFFF");
    hubGradient.addColorStop(1, "#C0C0C0");
    ctx.fillStyle = hubGradient;
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();
}

function animateSpin(currentTime) {
    const elapsed = currentTime - startTime;
    let progress = elapsed / totalDuration;
    if (progress > 1) progress = 1;

    // Плавное замедление с использованием easeOutCubic
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    angle = startAngle + (targetAngle - startAngle) * easedProgress;

    drawWheel(angle);

    if (progress < 1) {
         requestAnimationFrame(animateSpin);
    } else {
         spinning = false;
         // Приводим угол к диапазону 0 - 2π
         angle = targetAngle % (2 * Math.PI);
         const sectorSize = (2 * Math.PI) / prizes.length;
         const winningIndex = Math.floor((angle + sectorSize / 2) / sectorSize) % prizes.length;
         const winningPrize = prizes[winningIndex];
         console.log(`Выигранный приз: ${winningPrize}`);

         // Отправка сообщения через Telegram WebApp API или через alert
         if (window.Telegram && Telegram.WebApp) {
             Telegram.WebApp.showAlert(`Вы выиграли: ${winningPrize}`);
         } else {
             setTimeout(() => {
                 alert(`Вы выиграли: ${winningPrize}`);
             }, 500);
         }
    }
}

function spinWheel() {
    if (spinning) return;
    spinning = true;
    startAngle = angle;
    // Случайный угол с минимум 5 оборотами
    const randomAngle = Math.random() * (2 * Math.PI) + (5 * 2 * Math.PI);
    targetAngle = startAngle + randomAngle;
    startTime = performance.now();
    requestAnimationFrame(animateSpin);
}

spinButton.addEventListener("click", spinWheel);
drawWheel(angle);