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
 * Generates a dynamic daily reading for a given sign using Gemini API,
 * with localStorage caching to minimize API calls.
 */
export async function getDailyReading(signId) {
  const date = new Date();
  const dateStr = date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  const signInfo = ZODIAC_SIGNS.find(s => s.id === signId);
  const signName = signInfo ? signInfo.name : signId;

  // 1. Check Cache First
  const cacheKey = `astrodaily_v4_${dateStr}_${signId}`;
  try {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      console.log(`Using cached reading for ${signName} on ${dateStr}`);
      return JSON.parse(cachedData);
    }
  } catch (e) {
    console.warn("Failed to read from localStorage cache", e);
  }

  // 2. Fetch from API if not cached
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing VITE_GEMINI_API_KEY in environment variables.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", generationConfig: { temperature: 0.9 } });

    const prompt = `You are an expert astrologer. Generate a highly unique and specific daily astrology reading for the zodiac sign ${signName} for today, ${dateStr}.

Return the response strictly as a JSON object with NO markdown formatting, backticks, or extra text. Use the exact keys shown below, but REPLACE the values with completely new, unique, and tailored content for ${signName}:

{
  "luckyNumber": 12, // Replace with a random number 1-99
  "energy": "Short phrase about today's energy for ${signName}", // Replace this text
  "avoid": "Short phrase of what to avoid today", // Replace this text
  "insight": "A 1-2 sentence daily horoscope insight specific to ${signName}.", // Replace this text
  "personalizedFocus": "A 1-2 sentence personalized advice or focus area for ${signName}." // Replace this text
}`;

    // Add a small delay before API call to help with basic rate limits
    await delay(600);

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean up potential markdown formatting from the response
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    let readingData;
    
    try {
      readingData = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", responseText);
      throw parseError;
    }

    const finalReading = {
      ...readingData,
      date: dateStr
    };

    // 3. Save to Cache
    try {
      localStorage.setItem(cacheKey, JSON.stringify(finalReading));
      setTimeout(() => cleanupOldCache(dateStr), 1000);
    } catch (e) {
      console.warn("Failed to save to localStorage cache", e);
    }

    return finalReading;

  } catch (error) {
    console.error("Error fetching daily reading from Gemini. Using fallback.", error);
    
    // Deterministic fallback so signs have different readings even if API fails
    const seedString = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${signId}`;
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
        hash = ((hash << 5) - hash) + seedString.charCodeAt(i);
        hash = hash & hash;
    }
    const absHash = Math.abs(hash);

    return {
      luckyNumber: (absHash % 99) + 1,
      energy: ENERGIES[absHash % ENERGIES.length] || "Reflective",
      avoid: AVOIDANCES[(absHash * 7) % AVOIDANCES.length] || "Overthinking",
      insight: GENERAL_INSIGHTS[(absHash * 13) % GENERAL_INSIGHTS.length] || `The stars are clouded for ${signName}, take a moment to rest.`,
      personalizedFocus: `Focus on grounding yourself today, ${signName}. Small, steady steps will lead to peace.`,
      date: dateStr
    };
  }
}

/**
 * Removes cache entries that do not match the current date string
 */
function cleanupOldCache(currentDateStr) {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('astrodaily_') && !key.includes(currentDateStr)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (e) {
    console.warn("Error cleaning up old cache", e);
  }
}

