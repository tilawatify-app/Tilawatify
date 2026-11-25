export const APK_URL =
  "https://github.com/tilawatify-app/Tilawatifyapp/releases/download/v1.0.0/Tilawatify.apk";
export const APK_SHA256 =
  "336f62d0032e9be0db0274eddf148141a30abcc07c40eafd016636052e64247e";

// Permanent app-wide counter key (independent of APK_URL so updates never reset the count)
export const DOWNLOAD_COUNTER_KEY = "tilawatify_app_total_downloads_permanent";
export const DOWNLOAD_COUNTER_STORAGE_KEY = "tilawatify-total-downloads-cache";

export const TOP_QARI_IDS = ["sudais", "maher", "yasser"] as const;

export type Reciter = {
  id: string;
  name: string;
  shortName: string;
  country: string;
  style: "Melodic" | "Reflective" | "Powerful";
  description: string;
  server: string;
  image: string;
};

export const reciters: Reciter[] = [
  {
    id: "mishary",
    name: "Mishary Rashid Alafasy",
    shortName: "Mishary Alafasy",
    country: "Kuwait",
    style: "Melodic",
    description:
      "A warm, melodic voice and a beautifully measured pace. A familiar companion for quiet reflection and everyday listening.",
    server: "mishary-alafasy/r1",
    image: "/images/reciters/mishary.webp",
  },
  {
    id: "sudais",
    name: "Abdul Rahman Al-Sudais",
    shortName: "Abdul Rahman Al-Sudais",
    country: "Saudi Arabia",
    style: "Powerful",
    description:
      "Distinctive, resonant, and deeply moving. A powerful recitation that brings the atmosphere of the Haram a little closer.",
    server: "abdulrahman-sudais/r1",
    image: "/images/reciters/sudais.webp",
  },
  {
    id: "maher",
    name: "Maher Al-Muaiqly",
    shortName: "Maher Al-Muaiqly",
    country: "Saudi Arabia",
    style: "Reflective",
    description:
      "Gentle clarity, an unhurried rhythm, and a calming presence. A wonderful voice to return to, day after day.",
    server: "maher-muaiqly/r1",
    image: "/images/reciters/maher.webp",
  },
  {
    id: "yasser",
    name: "Yasser Al-Dossari",
    shortName: "Yasser Al-Dossari",
    country: "Saudi Arabia",
    style: "Powerful",
    description:
      "Expressive and full of feeling. A rich, powerful recitation that invites you to pause and listen more closely.",
    server: "yasser-dosari/r1",
    image: "/images/reciters/yasser.webp",
  },
  {
    id: "saad",
    name: "Saad Al-Ghamdi",
    shortName: "Saad Al-Ghamdi",
    country: "Saudi Arabia",
    style: "Reflective",
    description:
      "Balanced, clear, and reassuringly familiar. A steady recitation for focused listening and your memorization journey.",
    server: "saad-ghamdi/r1",
    image: "/images/reciters/saad.webp",
  },
  {
    id: "hani",
    name: "Hani Ar-Rifai",
    shortName: "Hani Ar-Rifai",
    country: "Saudi Arabia",
    style: "Reflective",
    description:
      "Softly expressive and contemplative. An intimate recitation for the moments when you want to slow down and reconnect.",
    server: "hani-rifai/r1",
    image: "/images/reciters/hani.webp",
  },
  {
    id: "basit",
    name: "Abdul Basit Abdus Samad",
    shortName: "Abdul Basit",
    country: "Egypt",
    style: "Melodic",
    description:
      "An iconic voice with extraordinary depth and melodic beauty. Discover the timeless recitation loved across generations.",
    server: "abdulbasit-abdulsamad/r3",
    image: "/images/reciters/basit.webp",
  },
];

export const surahs = [
  { id: 1, name: "Al-Fatihah", meaning: "The Opening", verses: 7 },
  { id: 55, name: "Ar-Rahman", meaning: "The Most Merciful", verses: 78 },
  { id: 67, name: "Al-Mulk", meaning: "The Sovereignty", verses: 30 },
  { id: 112, name: "Al-Ikhlas", meaning: "The Sincerity", verses: 4 },
];
