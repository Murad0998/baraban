const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spinButton");

console.log("Скрипт загружен!"); // Проверяем, что скрипт запустился

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

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);

    for (let i = 0; i < prizes.length; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, sliceAngle * i, sliceAngle * (i + 1));
        ctx.fillStyle = i % 2 === 0 ? "#4682B4" : "#00FA9A"; // Смена цветов
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

function animateSpin(currentTime) {
    const elapsed = currentTime - startTime;
    let progress = elapsed / totalDuration;
    if (progress > 1) progress = 1;

    // Функция easeOutCubic для плавного замедления
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    angle = startAngle + (targetAngle - startAngle) * easedProgress;

    drawWheel(angle);

    if (progress < 1) {
         requestAnimationFrame(animateSpin);
    } else {
         spinning = false;
         // Приводим угол к диапазону 0 - 2π
         angle = targetAngle % (2 * Math.PI);
         let sectorSize = (2 * Math.PI) / prizes.length;
         let winningIndex = Math.floor((angle + sectorSize / 2) / sectorSize) % prizes.length;
         let winningPrize = prizes[winningIndex];
         console.log(`Выигранный приз: ${winningPrize}`);

         // Отправка сообщения через Telegram WebApp API или через alert
         if (window.Telegram && Telegram.WebApp) {
             console.log("Сообщение через Telegram WebApp API");
             Telegram.WebApp.showAlert(`Вы выиграли: ${winningPrize}`);
         } else {
             console.log("Вывод через alert");
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
    // Вычисляем случайный угол, минимум 5 оборотов
    let randomAngle = Math.random() * (2 * Math.PI) + (5 * 2 * Math.PI);
    targetAngle = startAngle + randomAngle;
    startTime = performance.now();
    requestAnimationFrame(animateSpin);
}

console.log("Назначаем обработчик кнопки...");
spinButton.addEventListener("click", spinWheel);

drawWheel(angle);