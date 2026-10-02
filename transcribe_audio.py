import os
from google import genai
from pathlib import Path

client = genai.Client(
    api_key=os.environ.get("GEMINI_API_KEY", "")
)

MODEL = "gemini-3.5-flash-lite"

def transcribe_audio(audio_path: str) -> str:
    """Transcribe an audio file using Gemini API."""
    audio_file = Path(audio_path)
    
    if not audio_file.exists():
        raise FileNotFoundError(f"Audio file not found: {audio_path}")
    
    with open(audio_file, "rb") as f:
        audio_data = f.read()
    
    response = client.models.generate_content(
        model=MODEL,
        contents=[
            "Transcribe este audio al español. Devuelve solo el texto transcrito.",
            genai.types.Part.from_bytes(data=audio_data, mime_type="audio/wav")
        ]
    )
    
    return response.text.strip()

def main():
    audio_dir = Path("test_audios")
    audio_dir.mkdir(exist_ok=True)
    
    print("=== Transcripción de audios de prueba ===\n")
    
    for i in range(1, 4):
        audio_path = audio_dir / f"test_{i}.wav"
        
        if audio_path.exists():
            print(f"Transcribiendo {audio_path.name}...")
            try:
                transcription = transcribe_audio(str(audio_path))
                print(f"Resultado: {transcription}\n")
            except Exception as e:
                print(f"Error: {e}\n")
        else:
            print(f"Archivo no encontrado: {audio_path.name}")
            print(f"Por favor graba un audio de prueba y guárdalo como {audio_path}\n")

if __name__ == "__main__":
    main()