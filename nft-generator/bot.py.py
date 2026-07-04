import telebot
from telebot import types
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from flask import Flask, send_from_directory
import threading
import os

# ===== НАСТРОЙКИ =====
TOKEN = "8869698052:AAEOIiUS2I5i2UtsviblOXvbDUC4XdZSVn0"  # Получите у @BotFather

# Запускаем Flask для веб-приложения
app = Flask(__name__, static_folder='webapp')

@app.route('/')
def index():
    return send_from_directory('webapp', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('webapp', path)

# Запускаем бота
bot = telebot.TeleBot(TOKEN)

@bot.message_handler(commands=['start'])
def start(message):
    # Ссылка на веб-приложение
    webapp_url = "https://your-app.onrender.com"  # Измените на свой
    
    keyboard = InlineKeyboardMarkup()
    keyboard.add(
        InlineKeyboardButton(
            "🎨 ОТКРЫТЬ ПРИЛОЖЕНИЕ",
            web_app=WebAppInfo(url=webapp_url)
        )
    )
    
    bot.send_message(
        message.chat.id,
        "🎨 *NFT ГЕНЕРАТОР*\n\nНажмите кнопку чтобы открыть!",
        parse_mode='Markdown',
        reply_markup=keyboard
    )

if __name__ == '__main__':
    # Запускаем Flask в отдельном потоке
    threading.Thread(target=lambda: app.run(host='0.0.0.0', port=8080)).start()
    # Запускаем бота
    bot.polling(none_stop=True)