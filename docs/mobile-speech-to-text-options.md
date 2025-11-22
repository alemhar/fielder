# Mobile Speech-to-Text Options for Expo

## Issue Summary
- Expo Go does not include a built-in speech-to-text API.
- `expo-speech` is text-to-speech only.
- Third-party native modules like `@react-native-voice/voice` do not work in Expo Go because they require custom native linking.
- Development builds (`expo run:android`/`expo run:ios`) can use native modules, but setup can be fragile.

## Viable Options for Expo Go

### 1. Google Cloud Speech-to-Text
- **Free tier**: 60 minutes per month (not charged against credits).
- **New customers**: $300 free credits (can be used for Speech-to-Text).
- **API**: REST API; works in Expo Go.
- **Models**: Standard, enhanced (video, phone call), Chirp.
- **Notes**: Simple setup; requires Google Cloud project and API key.
- **Pricing after free**: Pay-as-you-go per second of audio.

### 2. Azure AI Speech (Speech-to-Text)
- **Free tier (F0)**: 5 hours audio per month (shared between Standard and Custom; batch not supported).
- **API**: REST API; works in Expo Go.
- **Features**: Real-time, batch, custom models, continuous language identification, diarization, pronunciation assessment.
- **Notes**: Requires Azure subscription and Speech resource key.
- **Pricing after free**: ~$1/hour for standard real-time.

## Next Steps

1. Choose a provider (Google or Azure) based on free tier and feature needs.
2. Create a cloud project and generate an API key.
3. Implement a thin client in the app:
   - Capture audio via Expo (e.g., `expo-av` for recording to base64 or temporary file).
   - Send to the provider’s REST endpoint.
   - Handle response and insert into the text input.
4. Store API key securely (environment variables or backend proxy).

## References
- [Google Cloud Speech-to-Text](https://cloud.google.com/speech-to-text)
- [Azure AI Speech pricing](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/speech-services/)
- [Expo documentation note: no speech-to-text API](https://docs.expo.dev/versions/latest/sdk/speech/)
