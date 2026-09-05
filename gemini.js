import Constants from 'expo-constants';

const config = Constants.expoConfig?.extra ?? {};

export async function askSaarthi(message) {
  if (!config.geminiKey) throw new Error('GEMINI_KEY is missing. Add it to .env, then restart Expo.');
  const instruction = `You are Saarthi, a warm and patient daily companion for an older adult. Reply in 1 or 2 short, simple sentences. Be encouraging, respectful, and easy to understand. Never claim to diagnose, treat, cure, or reverse dementia. Do not give medication instructions; suggest speaking to a caregiver or clinician for medical questions. If the person describes immediate danger, tell them to contact local emergency services or a trusted caregiver now.`;
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${config.geminiModel}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': config.geminiKey },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: instruction }] },
      contents: [{ role: 'user', parts: [{ text: message }] }],
      generationConfig: { temperature: 0.55, maxOutputTokens: 110 },
    }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload?.error?.message || 'Saarthi could not connect just now.');
  const reply = payload?.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('').trim();
  if (!reply) throw new Error('Saarthi did not receive a reply. Please try again.');
  return reply;
}
