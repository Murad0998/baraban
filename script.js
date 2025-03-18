const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spinButton");

// Примерные призы — меняйте на свои
const prizes = [
  "iPhone 14",
  "Скидка 50%",
  "AirPods",
  "Крутая футболка",
  "iPhone 13",
  "Промокод на суши",
  "Подписка Spotify",
  "Сумка Nike"
];

// Углы для анимации
let angle = 0;          // Текущий угол колеса
let spinning = false;   // Флаг, идёт ли вращение
let targetAngle = 0;    // Итоговый угол (куда крутим)
let startAngle = 0;     // Угол начала анимации
let startTime = 0;      // Время старта анимации

const totalDuration = 4000; // 4 секунды вращения

/**
 * Отрисовка колеса с учётом текущего угла rotation.
 */
function drawWheel(rotation) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(canvas.width, canvas.height) / 2 - 10;
  const sliceAngle = (2 * Math.PI) / prizes.length;

  // Переносим начало координат в центр колеса и вращаем
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);

  // Рисуем сектора
  for (let i = 0; i < prizes.length; i++) {
    const startSlice = sliceAngle * i;
    const endSlice = startSlice + sliceAngle;

    // Сектор
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, startSlice, endSlice);
    ctx.fillStyle = "#0c1f27"; // Тёмный сектор
    ctx.fill();

    // Обводка сектора неоновым цветом
    ctx.strokeStyle = "#00ffc3";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Текст в центре сектора
    ctx.save();
    ctx.rotate(startSlice + sliceAngle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#00ffc3";
    ctx.font = "bold 16px Arial";
    ctx.fillText(prizes[i], radius - 10, 5);
    ctx.restore();
  }

  ctx.restore();
}

/**
 * Анимация вращения через requestAnimationFrame
 */
function animateSpin(currentTime) {
  const elapsed = currentTime - startTime;
  let progress = elapsed / totalDuration;
  if (progress > 1) progress = 1;

  // Плавное замедление (easeOutCubic)
  const easedProgress = 1 - Math.pow(1 - progress, 3);
  angle = startAngle + (targetAngle - startAngle) * easedProgress;

  drawWheel(angle);

  if (progress < 1) {
    requestAnimationFrame(animateSpin);
  } else {
    // Закончили вращение
    spinning = false;

    // Нормируем угол [0..2π]
    angle = angle % (2 * Math.PI);
    if (angle < 0) angle += 2 * Math.PI;

    const sectorSize = (2 * Math.PI) / prizes.length;

    /*
      1) Сдвигаем угол на -sectorSize/2, чтобы "центр" сектора попадал на 0.
      2) Приводим к [0..2π).
      3) Делим на sectorSize и берем floor.
    */
    let shiftedAngle = angle - sectorSize / 2;
    shiftedAngle = (shiftedAngle + 2 * Math.PI) % (2 * Math.PI);

    const winningIndex = Math.floor(shiftedAngle / sectorSize);
    const winningPrize = prizes[winningIndex];

    console.log("Выигранный приз:", winningPrize);

    // Дальше — вывод результата
    if (window.Telegram && Telegram.WebApp) {
      Telegram.WebApp.showAlert(`Вы выиграли: ${winningPrize}`);
    } else {
      setTimeout(() => {
        alert(`Вы выиграли: ${winningPrize}`);
      }, 300);
    }
  }
}

/**
 * Запуск вращения
 */
function spinWheel() {
  if (spinning) return; // Если уже крутится — не запускаем
  spinning = true;
  startAngle = angle;

  // Минимум 5 оборотов + рандом
  const randomAngle = Math.random() * 2 * Math.PI + 5 * 2 * Math.PI;
  targetAngle = startAngle + randomAngle;

  startTime = performance.now();
  requestAnimationFrame(animateSpin);
}

// Назначаем обработчик на кнопку
spinButton.addEventListener("click", spinWheel);

// Начальная отрисовка (статичное колесо)
drawWheel(angle);