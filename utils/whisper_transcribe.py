import os
import sys
import json
from openai import OpenAI
from dotenv import load_dotenv

# Construye la ruta al archivo .env en el directorio padre (backend)
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)

def transcribe_audio(audio_path):
    try:
        # Carga explícitamente la clave de la variable de entorno
        api_key = os.getenv("OPENAI_API_KEY")
        
        # Si la clave no se encuentra, arroja un error claro
        if not api_key:
            raise ValueError("OPENAI_API_KEY no encontrada. Asegúrate de que tu archivo .env esté en la carpeta 'backend' y contenga la clave.")

        # Pasa la clave directamente al cliente
        client = OpenAI(api_key=api_key)
        
        with open(audio_path, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
              model="whisper-1", 
              file=audio_file
            )
        return {"success": True, "text": transcription.text}
    except Exception as e:
        # Revisa si el error es por una clave de API incorrecta
        if "Incorrect API key" in str(e):
            return {"success": False, "error": "La clave de API de OpenAI no es correcta. Revisa tu archivo .env."}
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) > 1:
        audio_file_path = sys.argv[1]
        transcription_result = transcribe_audio(audio_file_path)
        print(json.dumps(transcription_result))
    else:
        print(json.dumps({"success": False, "error": "No se ha proporcionado la ruta del archivo de audio."}))