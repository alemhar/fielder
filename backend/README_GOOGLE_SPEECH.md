# Google Cloud Speech-to-Text Setup

1. Create a Google Cloud project and enable the Speech-to-Text API.
2. Create a service account key and download the JSON file.
3. Place the JSON file at `storage/app/google-credentials.json`.
4. Add the file path to `.gitignore` (already ignored by default).
5. Ensure the `google/cloud-speech` Composer package is installed:
   ```bash
   composer require google/cloud-speech
   ```

The backend endpoint `POST /api/speech-to-text` expects:
- `audio` (base64 string): Raw audio data (e.g., LINEAR16).
- `sampleRate` (int): Audio sample rate (e.g., 16000).
- `languageCode` (string, optional): Defaults to 'en-US'.

It returns:
- `transcript` (string): Recognized speech text.
