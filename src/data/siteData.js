export const asset = (name) =>
  new URL(
    `../../Podcast Host Personal Brand Website_files/${name}`,
    import.meta.url,
  ).href;

export const sections = [
  { label: "Show", href: "#podcast" },
  { label: "Journey", href: "#journey" },
  { label: "Podcasts Hub", href: "#hub" },
  { label: "Host", href: "#about" },
  { label: "Speaking", href: "#speaking" },
];

export const episodes = [
  {
    number: "047",
    title: "From Zero to Unicorn: The Unfiltered Truth",
    guest: "Ritesh Agarwal",
    company: "OYO Rooms",
    duration: "1h 12m",
    plays: "2.4M",
    image: asset("KLing_fca64c8d-73ee-494d-89e4-b83259d41154.jpg"),
    tag: "Most Played",
  },
  {
    number: "038",
    title: "AI is Eating the World. Are You Ready?",
    guest: "Sridhar Vembu",
    company: "Zoho Corporation",
    duration: "58m",
    plays: "1.8M",
    image: asset("KLing_bb543345-5bfe-4321-8aa8-751dcc37c370.jpg"),
    tag: "Fan Favourite",
  },
  {
    number: "052",
    title: "Building in Silence, Launching in Thunder",
    guest: "Kunal Shah",
    company: "CRED",
    duration: "1h 4m",
    plays: "1.2M",
    image: asset("KLing_3300158f-1126-469b-b316-e0a6de6f9771.jpg"),
    tag: "Editor's Pick",
  },
];

export const guests = [
  {
    number: "01",
    name: "Ritesh Agarwal",
    company: "OYO Rooms",
    role: "Founder & CEO",
    image: asset("KLing_ed86aa8d-75b8-4a2e-b411-6bdcd09250b1.jpg"),
  },
  {
    number: "02",
    name: "Kunal Shah",
    company: "CRED",
    role: "Founder & CEO",
    image: asset("KLing_22d2e43a-58d5-4549-bb14-2a2d581bdd29.jpg"),
  },
  {
    number: "03",
    name: "Sridhar Vembu",
    company: "Zoho Corporation",
    role: "Founder & CEO",
    image: asset("KLing_38e08ffe-80d8-4303-addc-b9f0ad28e94e.jpg"),
  },
  {
    number: "04",
    name: "Vijay Shekhar Sharma",
    company: "Paytm",
    role: "Founder & CEO",
    image: asset("KLing_25a7e0b2-fec9-48be-be7f-19794f45bdf6.jpg"),
  },
  {
    number: "05",
    name: "Bhavish Aggarwal",
    company: "Ola & Krutrim",
    role: "Founder & CEO",
    image: asset("KLing_b6a41581-6c30-4374-b9e6-2b0f745f45db.jpg"),
  },
  {
    number: "06",
    name: "Deepinder Goyal",
    company: "Zomato",
    role: "Founder & CEO",
    image: asset("KLing_500e962f-f4b2-4263-a0ec-d2ae77d80656.jpg"),
  },
];

export const headlineStats = [
  { value: 50, suffix: "+", label: "Episodes" },
  { value: 5, suffix: "M+", label: "Total Views" },
  { value: 30, suffix: "+", label: "Founders" },
];

export const stats = [
  { value: 5, suffix: "M+", label: "Total Views" },
  { value: 52, suffix: "+", label: "Episodes" },
  { value: 30, suffix: "+", label: "Featured Founders" },
  { value: 120, suffix: "+", label: "Mentorship Alumni" },
];

export const journey = [
  {
    year: "2019",
    title: "The Spark",
    desc: "Frustrated by polished startup stories and curated highlight reels, started recording raw, unfiltered conversations with founders about what building really looks like.",
  },
  {
    year: "2020",
    title: "The Grind",
    desc: "11 episodes released into the void. No audience, no sponsors — just minutes of unfiltered conviction and the belief that real stories deserve to be heard.",
  },
  {
    year: "2022",
    title: "The Turn",
    desc: "Episode 012 with a unicorn founder crossed 100K views overnight. The inbox flooded. Zero Point Five was no longer a side project — it was a movement.",
  },
  {
    year: "2023",
    title: "The Stage",
    desc: 'First keynote at a national startup summit. 1,200 founders in the room, introduced as "the voice asking questions no one else dares to ask."',
  },
  {
    year: "2024",
    title: "The Mission",
    desc: "Launched the AI Mentorship cohort — 60 founders, 6 weeks, zero fluff. 100% of alumni reported a fundamental shift in how they think about building.",
  },
  {
    year: "2025 →",
    title: "Still Writing",
    desc: "The chapter isn't done. The mission stays the same: what does it really take to go from zero to something worth a damn?",
  },
];

export const speakingEvents = [
  {
    event: "TechSparks 2024",
    org: "YourStory Media",
    location: "Bengaluru",
    year: "2024",
  },
  {
    event: "Nasscom Product Conclave",
    org: "Nasscom",
    location: "Bengaluru",
    year: "2024",
  },
  {
    event: "Startup Mahakumbh",
    org: "Govt. of India",
    location: "New Delhi",
    year: "2023",
  },
  {
    event: "Inc42 UpNext Summit",
    org: "Inc42 Media",
    location: "Mumbai",
    year: "2023",
  },
];

export const mentorshipStats = [
  { label: "Duration", value: "6 Weeks" },
  { label: "Seats", value: "20 / cohort" },
  { label: "Format", value: "Live + Async" },
  { label: "Alumni", value: "120+ Founders" },
];

export const partners = [
  "YourStory",
  "Nasscom",
  "Inc42",
  "Startup India",
  "TechSparks",
  "Google for Startups",
];

export const socialLinks = [
  {
    label: "YouTube",
    href: "https://youtube.com/@ZeroPointFiveShow",
    icon: "youtube",
  },
  { label: "Spotify", href: "https://open.spotify.com", icon: "spotify" },
  { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
];
