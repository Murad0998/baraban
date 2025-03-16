import os
from telebot.async_telebot import AsyncTeleBot
from telebot.types import ReplyKeyboardMarkup, KeyboardButton, WebAppInfo
import asyncio

TOKEN = os.getenv("BOT_TOKEN")  # Используем переменные окружения
bot = AsyncTeleBot(TOKEN)

@bot.message_handler(commands=["start"])
async def start(message):
    keyboard = ReplyKeyboardMarkup(resize_keyboard=True)
    button = KeyboardButton(
        text="Крутить барабан 🎡",
        web_app=WebAppInfo(url="https://murad0998.github.io/baraban/")
    )
    keyboard.add(button)

    await bot.send_message(message.chat.id, "Нажмите кнопку, чтобы запустить барабан!", reply_markup=keyboard)

async def main():
    print("Бот запущен...")
    await bot.polling(non_stop=True)

if __name__ == "__main__":
    asyncio.run(main())
