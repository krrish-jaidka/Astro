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

/**
 * Generates a deterministic daily reading for a given sign based on the current date.
 * This ensures the user gets the same reading if they refresh, 
 * but a new reading tomorrow.
 */
export function getDailyReading(signId) {
  const date = new Date();
  const seedString = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${signId}`;
  
  // Simple hash function for the seed
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    const char = seedString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Use absolute value
  const absHash = Math.abs(hash);

  return {
    luckyNumber: (absHash % 99) + 1, // 1-99
    energy: ENERGIES[absHash % ENERGIES.length],
    avoid: AVOIDANCES[(absHash * 7) % AVOIDANCES.length],
    insight: GENERAL_INSIGHTS[(absHash * 13) % GENERAL_INSIGHTS.length],
    date: date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
  };
}
