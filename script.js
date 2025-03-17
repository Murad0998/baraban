const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spinButton");

// Примерные призы (можете заменить своими)
const prizes = [
  "iPhone 13",
  "Скидка 50%",
  "AirPods",
  "Крутая футболка",
  "iPhone 14",
  "Промокод на суши",
  "Беспл. подписка Spotify",
  "Сумка Nike"
];

let angle = 0;          // Текущий угол колеса
let spinning = false;   // Флаг, что колесо крутится
let targetAngle = 0;    // Итоговый угол (куда крутим)
let startAngle = 0;     // Угол начала анимации
let startTime = 0;      // Время старта анимации

const totalDuration = 4000; // 4 секунды анимации

/**
 * Рисует колесо фортуны с учётом текущего угла rotation.
 */
function drawWheel(rotation) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(canvas.width, canvas.height) / 2 - 10;
  const sliceAngle = (2 * Math.PI) / prizes.length;

  // Внешнее свечение колеса
  ctx.save();
  ctx.shadowColor = "#00ffc3";
  ctx.shadowBlur = 15;
  ctx.strokeStyle = "#00ffc3";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius + 5, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.restore();

  // Сдвигаем систему координат к центру и вращаем
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
    ctx.fillStyle = "#071a2d"; // Тёмный сектор
    ctx.fill();

    // Обводка сектора
    ctx.strokeStyle = "#00ffc3";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Текст (поворачиваемся к середине сектора)
    ctx.save();
    ctx.rotate(startSlice + sliceAngle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#00ffc3";
    ctx.font = "bold 16px Arial";
    ctx.fillText(prizes[i], radius - 10, 5);
    ctx.restore();
  }

  ctx.restore();

  // Центральный круг с буквой (как на референсе, буква "L")
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, 40, 0, 2 * Math.PI);
  ctx.fillStyle = "#00ffc3";
  ctx.fill();

  ctx.fillStyle = "#071a2d";
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("L", centerX, centerY);
  ctx.restore();
}

/**
 * Анимация вращения
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
    // Закончили анимацию
    spinning = false;

    // Нормируем угол в диапазон [0..2π]
    angle = targetAngle % (2 * Math.PI);

    // Вычисляем сектор, который смотрит на стрелку снизу (по сути, угол = π/2)
    const sectorSize = (2 * Math.PI) / prizes.length;

    // Смещаем угол, чтобы учесть позицию стрелки внизу (угол ~ π/2 в математической системе)
    let shiftedAngle = angle + sectorSize / 2 - Math.PI / 2;

    // Приводим к диапазону [0..2π]
    shiftedAngle = (shiftedAngle + 2 * Math.PI) % (2 * Math.PI);

    const winningIndex = Math.floor(shiftedAngle / sectorSize);
    const winningPrize = prizes[winningIndex];

    console.log("Выигранный приз:", winningPrize);

    // Вывод через Telegram.WebApp или alert
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
 * Запускает вращение
 */
function spinWheel() {
  if (spinning) return;
  spinning = true;
  startAngle = angle;

  // Случайный угол (минимум 5 оборотов)
  const randomAngle = Math.random() * 2 * Math.PI + 5 * 2 * Math.PI;
  targetAngle = startAngle + randomAngle;

  startTime = performance.now();
  requestAnimationFrame(animateSpin);
}

// Назначаем обработчик на кнопку
spinButton.addEventListener("click", spinWheel);

// Первоначальная отрисовка (статичное колесо)
drawWheel(angle);