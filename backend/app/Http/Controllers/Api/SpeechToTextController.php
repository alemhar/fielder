<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Google\Cloud\Speech\V1\SpeechClient;
use Google\Cloud\Speech\V1\RecognitionAudio;
use Google\Cloud\Speech\V1\RecognitionConfig;
use Google\Cloud\Speech\V1\RecognitionConfig\AudioEncoding;

class SpeechToTextController extends Controller
{
    public function transcribe(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'audio' => 'required|string', // base64-encoded audio
            'sampleRate' => 'required|integer',
            'languageCode' => 'string',
        ]);

        $audioBase64 = $validated['audio'];
        $sampleRate = (int) $validated['sampleRate'];
        $languageCode = $validated['languageCode'] ?? 'en-US';

        try {
            // Initialize Speech client
            $speech = new SpeechClient([
                'credentials' => storage_path('app/google-credentials.json'),
            ]);

            $audio = (new RecognitionAudio())
                ->setContent(base64_decode($audioBase64));

            $config = (new RecognitionConfig())
                ->setEncoding(AudioEncoding::LINEAR16)
                ->setSampleRateHertz($sampleRate)
                ->setLanguageCode($languageCode);

            $response = $speech->recognize($config, $audio);
            $results = $response->getResults();

            $transcript = '';
            foreach ($results as $result) {
                $alternatives = $result->getAlternatives();
                foreach ($alternatives as $alternative) {
                    $transcript .= $alternative->getTranscript();
                }
            }

            return response()->json([
                'transcript' => $transcript,
            ]);
        } catch (\Throwable $e) {
            \Log::error('Speech-to-text error', ['error' => $e->getMessage()]);
            return response()->json([
                'error' => 'Speech-to-text service unavailable',
            ], 500);
        }
    }
}
