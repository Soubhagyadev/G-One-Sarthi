// This exposes the key to the client bundle for this hackathon prototype only.
// Use a server-side proxy before releasing the app publicly.
module.exports = {
  name: 'G-One Saarthi',
  slug: 'g-one-saarthi',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  android: { package: 'com.gone.saarthi' },
  plugins: ['expo-asset'],
  extra: {
    geminiKey: process.env.GEMINI_KEY || process.env.EXPO_PUBLIC_GEMINI_KEY || '',
    geminiModel: process.env.GEMINI_MODEL || 'gemini-3.7-flash',
  },
};
