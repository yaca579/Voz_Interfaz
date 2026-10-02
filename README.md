## Estructura del Proyecto

```
Voz_Interfaz/
├── transcribe_audio.py       # Script Python para transcripción
├── requirements.txt          # Dependencias Python
├── test_audios/              # Carpeta para audios de prueba (3 archivos .wav)
└── mobile-app/               # App React Native con Expo
    ├── App.tsx
    ├── package.json
    ├── app.json
    ├── tsconfig.json
    ├── babel.config.js
    └── src/
        ├── screens/
        │   ├── HomeScreen.tsx
        │   ├── RecordingScreen.tsx
        └── └── TranscriptionScreen.tsx
```

## 1. Script Python - Transcripción con Gemini

### Instalación
```bash
pip install -r requirements.txt
```

### Uso de la transcripción de los 3 audios
```bash
python transcribe_audio.py
```

## 2. App Móvil React Native (Expo)

### Instalación
```bash
cd mobile-app
npm install
```

### Ejecución
```bash
npm start
# Ejecutar en Android
npm run android
# Ejecutar en iOS
npm run ios
# Ejecutar en Web
npm run web
```
## Iniciar servidor web
```bash

cd C:\Users\yaser.castillon.ext\Desktop\Voz_Interfaz\web-speech
python -m http.server 8000

```