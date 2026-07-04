from flask import Flask, send_from_directory
import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
import threading
import os

TOKEN = "8869698052:AAEOIiUS2I5i2UtsviblOXvbDUC4XdZSVn0"
app = Flask(__name__)

@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

bot = telebot.TeleBot(TOKEN)

@bot.message_handler(commands=['start'])
def start(message):
    url = os.environ.get('RENDER_EXTERNAL_URL', 'https://your-app.onrender.com')
    keyboard = InlineKeyboardMarkup()
    keyboard.add(InlineKeyboardButton("🎨 ОТКРЫТЬ ПРИЛОЖЕНИЕ", web_app=WebAppInfo(url=url)))
    bot.send_message(message.chat.id, "🎨 Нажми кнопку чтобы открыть NFT Генератор!", reply_markup=keyboard)

if __name__ == '__main__':
    threading.Thread(target=lambda: app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))).start()
    bot.polling(none_stop=True)
