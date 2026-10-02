#!/usr/bin/env python3
"""
Comparador de transcripciones: Web Speech API vs Gemini API
Guarda resultados de ambos métodos para los 3 audios de prueba
"""

import json
from pathlib import Path
from datetime import datetime

# Configuración
AUDIO_DIR = Path("test_audios")
RESULTS_FILE = Path("transcription_comparison.json")

# Referencias esperadas 
EXPECTED = {
    "test_1.wav": "Hola, buenos días. Hace un buen día hoy.",
    "test_2.wav": "Hace un día nublado hoy.",
    "test_3.wav": "Que tengas buenas noches, hasta mañana."
}

def calculate_accuracy(expected: str, actual: str) -> float:
    """Cálculo simple de precisión basado en palabras."""
    exp_words = expected.lower().split()
    act_words = actual.lower().split()
    
    if not exp_words:
        return 0.0
    
    matches = sum(1 for w in exp_words if w in act_words)
    return (matches / len(exp_words)) * 100

def main():
    print("=== Comparador de Transcripciones ===\n")
    
    results = {
        "date": datetime.now().isoformat(),
        "audios": {}
    }
    
    for i in range(1, 4):
        audio_name = f"test_{i}.wav"
        audio_path = AUDIO_DIR / audio_name
        
        print(f"\n--- {audio_name} ---")
        
        if not audio_path.exists():
            print(f"  ❌ No encontrado: {audio_path}")
            continue
        
        # Web Speech API 
        web_result = input(f"  Web Speech API resultado: ").strip()
        
        # Gemini API 
        import subprocess
        result = subprocess.run(
            ["python", "transcribe_audio.py"],
            capture_output=True, text=True, cwd="."
        )
        # Extraer solo la línea de este audio
        gemini_result = ""
        for line in result.stdout.split('\n'):
            if audio_name in line and "Resultado:" in line:
                gemini_result = line.split("Resultado:")[1].strip()
                break
        
        expected = EXPECTED.get(audio_name, "")
        
        web_acc = calculate_accuracy(expected, web_result) if expected else 0
        gemini_acc = calculate_accuracy(expected, gemini_result) if expected else 0
        
        results["audios"][audio_name] = {
            "expected": expected,
            "web_speech_api": web_result,
            "gemini_api": gemini_result,
            "web_accuracy": round(web_acc, 1),
            "gemini_accuracy": round(gemini_acc, 1)
        }
        
        print(f"  Esperado:      {expected}")
        print(f"  Web Speech:    {web_result} ({web_acc:.1f}%)")
        print(f"  Gemini:        {gemini_result} ({gemini_acc:.1f}%)")
    
    # Guardar resultados
    with open(RESULTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Resultados guardados en {RESULTS_FILE}")
    
    # Resumen
    print("\n=== RESUMEN ===")
    for name, data in results["audios"].items():
        print(f"{name}: Web={data['web_accuracy']}% | Gemini={data['gemini_accuracy']}%")

if __name__ == "__main__":
    main()