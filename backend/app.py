from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import google.generativeai as genai
from dotenv import load_dotenv
import logging

# ログ設定
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

# FastAPIアプリケーションを作成
app = FastAPI()

# Gemini APIの設定
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    logger.error("GEMINI_API_KEYが設定されていません。環境変数を確認してください。")
    raise ValueError("GEMINI_API_KEYが設定されていません。")

genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-pro")

# リクエストボディ用のモデル
class ChatRequest(BaseModel):
    message: str

@app.get("/")
async def root():
    return {"message": "Welcome to the Kaigo Chat API"}

@app.get("/favicon.ico")
async def favicon():
    return {"message": "Favicon not found"}

# チャットのエンドポイント
@app.post("/api/chat")
async def chat(request: ChatRequest) -> dict:
    user_input = request.message

    try:
        # Gemini APIにリクエストを送信
        response = model.generate_content(user_input)
        if not hasattr(response, "text"):
            logger.error("Gemini APIのレスポンスに'text'属性がありません。")
            raise ValueError("無効なレスポンスを受信しました。")
        return {"response": response.text}
    except Exception as e:
        logger.exception("エラーが発生しました。")
        raise HTTPException(status_code=500, detail="内部サーバーエラーが発生しました。")

