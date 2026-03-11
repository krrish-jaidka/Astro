// src/utils/astrologyData.js

const ENERGIES = [
  "Focus & Clarity",
  "Rest & Rejuvenation",
  "Creative Spark",
  "Social Expansion",
  "Deep Introspection",
  "Financial Prudence",
  "Romantic Harmony",
  "Spontaneous Action",
  "Emotional Healing",
  "Strategic Planning",
  "Physical Vitality",
  "Spiritual Awakening"
];

const AVOIDANCES = [
  "Impulsive decisions",
  "Overworking",
  "Arguments with loved ones",
  "Ignoring your intuition",
  "Unnecessary spending",
  "Skipping meals",
  "Negative self-talk",
  "Rushing through tasks",
  "Procrastinating important work",
  "Toxic environments",
  "Gossiping",
  "Taking on too much"
];

const GENERAL_INSIGHTS = [
  "Today is a day for bold moves. The universe favors those who take action.",
  "Take a step back. Sometimes the best action is no action. Trust the process.",
  "Your creative energy is peaking. Channel it into something meaningful today.",
  "Communication is key. Reach out to someone you haven't spoken to in a while.",
  "Focus on your inner world. Meditation or quiet time will yield surprising answers.",
  "An unexpected opportunity may arise. Keep your eyes open and be ready to pivot.",
  "Your emotional intelligence is your superpower today. Use it to resolve an ongoing conflict.",
  "Routine is your friend right now. Stick to your proven habits for the best results.",
  "A small change in perspective will solve a problem that has been bothering you.",
  "Generosity will be rewarded tenfold. Share your time, resources, or knowledge.",
  "Pay attention to the signs around you. The universe is whispering guidance.",
  "It's time to set boundaries. Protect your energy and focus on what truly matters to you."
];

export const ZODIAC_SIGNS = [
  { id: 'aries', name: 'Aries', dateRange: 'Mar 21 - Apr 19', icon: '♈' },
  { id: 'taurus', name: 'Taurus', dateRange: 'Apr 20 - May 20', icon: '♉' },
  { id: 'gemini', name: 'Gemini', dateRange: 'May 21 - Jun 20', icon: '♊' },
  { id: 'cancer', name: 'Cancer', dateRange: 'Jun 21 - Jul 22', icon: '♋' },
  { id: 'leo', name: 'Leo', dateRange: 'Jul 23 - Aug 22', icon: '♌' },
  { id: 'virgo', name: 'Virgo', dateRange: 'Aug 23 - Sep 22', icon: '♍' },
  { id: 'libra', name: 'Libra', dateRange: 'Sep 23 - Oct 22', icon: '♎' },
  { id: 'scorpio', name: 'Scorpio', dateRange: 'Oct 23 - Nov 21', icon: '♏' },
  { id: 'sagittarius', name: 'Sagittarius', dateRange: 'Nov 22 - Dec 21', icon: '♐' },
  { id: 'capricorn', name: 'Capricorn', dateRange: 'Dec 22 - Jan 19', icon: '♑' },
  { id: 'aquarius', name: 'Aquarius', dateRange: 'Jan 20 - Feb 18', icon: '♒' },
  { id: 'pisces', name: 'Pisces', dateRange: 'Feb 19 - Mar 20', icon: '♓' }
];

import { GoogleGenerativeAI } from '@google/generative-ai';

// Simple delay function to help with rate limiting if needed
const delay = (ms) => new Promise(res => setTimeout(res, ms));

/**
 * Returns the cache key for a sign for today.
 */
function getTodayCacheKey(signId) {
  const date = new Date();
  return `astrodaily_v6_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${signId}`;
}

/**
 * Gets a daily reading for a specific sign.
 * - First click: fetches from Gemini API and caches in localStorage.
 * - Next clicks (same day, even after reload): served instantly from cache.
 * - New day: fresh fetch, old cache cleaned up.
 */
export async function getDailyReading(signId) {
  const date = new Date();
  const dateStr = date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  const cacheKey = getTodayCacheKey(signId);
  const signInfo = ZODIAC_SIGNS.find(s => s.id === signId);
  const signName = signInfo ? signInfo.name : signId;

  // 1. Check cache — serves instantly if this sign was already fetched today
  try {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      console.log(`⚡ Cache hit for ${signName}`);
      return JSON.parse(cachedData);
    }
  } catch (e) {
    console.warn("Failed to read cache", e);
  }

  // 2. Fetch only this sign from API
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing VITE_GEMINI_API_KEY");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", generationConfig: { temperature: 0.9 } });

    const prompt = `You are an expert astrologer. Generate a highly unique and specific daily astrology reading for the zodiac sign ${signName} for today, ${dateStr}.

Return the response strictly as a JSON object with NO markdown formatting, backticks, or extra text. REPLACE ALL values with unique content for ${signName}:

{
  "luckyNumber": 42,
  "energy": "A short unique phrase about today's energy for ${signName}",
  "avoid": "A short unique phrase of what ${signName} should avoid today",
  "insight": "A 1-2 sentence daily insight specific to ${signName}.",
  "personalizedFocus": "A 1-2 sentence personalized advice for ${signName}."
}`;

    await delay(500);

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    let readingData;
    try {
      readingData = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", responseText);
      throw parseError;
    }

    const finalReading = { ...readingData, date: dateStr };

    // 3. Save to cache — next click or reload will be instant
    try {
      localStorage.setItem(cacheKey, JSON.stringify(finalReading));
      console.log(`💾 Cached reading for ${signName}`);
      setTimeout(() => cleanupOldCache(), 1000);
    } catch (e) {
      console.warn("Failed to save cache", e);
    }

    return finalReading;

  } catch (error) {
    console.error("Error fetching reading from Gemini. Using fallback.", error);

    // Deterministic fallback unique per sign
    const seedString = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${signId}`;
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
      hash = ((hash << 5) - hash) + seedString.charCodeAt(i);
      hash = hash & hash;
    }
    const absHash = Math.abs(hash);

    const fallbackReading = {
      luckyNumber: (absHash % 99) + 1,
      energy: ENERGIES[absHash % ENERGIES.length] || "Reflective",
      avoid: AVOIDANCES[(absHash * 7) % AVOIDANCES.length] || "Overthinking",
      insight: GENERAL_INSIGHTS[(absHash * 13) % GENERAL_INSIGHTS.length] || `The stars are clouded for ${signName}.`,
      personalizedFocus: `Focus on grounding yourself today, ${signName}. Small, steady steps will lead to peace.`,
      date: dateStr
    };

    // Cache the fallback too so reloads don't re-fetch
    try { localStorage.setItem(cacheKey, JSON.stringify(fallbackReading)); } catch (e) { /* ignore */ }

    return fallbackReading;
  }
}

/**
 * Removes old cache entries (from previous days).
 */
function cleanupOldCache() {
  const todayPrefix = getTodayCacheKey('').replace(/_$/, ''); // e.g. astrodaily_v6_2026-3-11
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('astrodaily_') && !key.startsWith(todayPrefix)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (e) {
    console.warn("Error cleaning up old cache", e);
  }
}

/**
 * Generates a personalized Kundali (Vedic birth chart) reading using Gemini API.
 * Results are cached by the user's birth details.
 */
export async function getKundaliReading(details) {
  const { fullName, dateOfBirth, timeOfBirth, placeOfBirth } = details;
  
  // Cache key based on birth details (these never change)
  const cacheKey = `kundali_${dateOfBirth}_${timeOfBirth}_${placeOfBirth}`.replace(/[^a-zA-Z0-9_]/g, '_');
  try {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      console.log(`Using cached Kundali for ${fullName}`);
      return JSON.parse(cachedData);
    }
  } catch (e) {
    console.warn("Failed to read Kundali cache", e);
  }

  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing VITE_GEMINI_API_KEY in environment variables.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", generationConfig: { temperature: 0.8 } });

    const prompt = `You are an expert Vedic astrologer. Generate a detailed and personalized Kundali (Vedic birth chart) reading for a person with the following birth details:

Name: ${fullName}
Date of Birth: ${dateOfBirth}
Time of Birth: ${timeOfBirth}
Place of Birth: ${placeOfBirth}

Return the response strictly as a JSON object with NO markdown formatting, backticks, or extra text. Use the exact keys shown below but REPLACE ALL values with unique, personalized content based on the birth details provided:

{
  "sunSign": "The person's Sun Sign",
  "moonSign": "The person's Moon Sign (Rashi)",
  "ascendant": "The person's Ascendant (Lagna)",
  "planets": [
    { "name": "Sun", "sign": "Sign placement" },
    { "name": "Moon", "sign": "Sign placement" },
    { "name": "Mars", "sign": "Sign placement" },
    { "name": "Mercury", "sign": "Sign placement" },
    { "name": "Jupiter", "sign": "Sign placement" },
    { "name": "Venus", "sign": "Sign placement" },
    { "name": "Saturn", "sign": "Sign placement" },
    { "name": "Rahu", "sign": "Sign placement" },
    { "name": "Ketu", "sign": "Sign placement" }
  ],
  "personalityTraits": "A 2-3 sentence description of key personality traits based on the chart.",
  "lifePath": "A 2-3 sentence description of life path and career guidance.",
  "strengths": ["Strength 1", "Strength 2", "Strength 3", "Strength 4"],
  "challenges": ["Challenge 1", "Challenge 2", "Challenge 3", "Challenge 4"]
}`;

    await delay(600);

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    let readingData;
    try {
      readingData = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error("Failed to parse Kundali response as JSON:", responseText);
      throw parseError;
    }

    // Cache the result
    try {
      localStorage.setItem(cacheKey, JSON.stringify(readingData));
    } catch (e) {
      console.warn("Failed to save Kundali cache", e);
    }

    return readingData;

  } catch (error) {
    console.error("Error fetching Kundali from Gemini:", error);
    // Fallback
    return {
      sunSign: "Unable to determine",
      moonSign: "Unable to determine",
      ascendant: "Unable to determine",
      planets: [
        { name: "Sun", sign: "N/A" }, { name: "Moon", sign: "N/A" },
        { name: "Mars", sign: "N/A" }, { name: "Mercury", sign: "N/A" },
        { name: "Jupiter", sign: "N/A" }, { name: "Venus", sign: "N/A" },
        { name: "Saturn", sign: "N/A" }, { name: "Rahu", sign: "N/A" },
        { name: "Ketu", sign: "N/A" }
      ],
      personalityTraits: "The cosmic energies are currently unavailable. Please try again later.",
      lifePath: "Your path is being written by the stars. Please try again shortly.",
      strengths: ["Resilience", "Patience", "Adaptability", "Determination"],
      challenges: ["Overthinking", "Self-doubt", "Impatience", "Perfectionism"]
    };
  }
}


