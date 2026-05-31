import { guests } from './siteData';

const guest = (index) => guests[index % guests.length];

export const hubCategories = ['All', 'Business', 'Startups', 'Technology', 'Leadership', 'Innovation', 'AI'];

export const hubSidebarItems = [
  { id: 'home', label: 'Home' },
  { id: 'trending', label: 'Trending' },
  { id: 'categories', label: 'Categories' },
  { id: 'bookmarks', label: 'Bookmarks' },
  { id: 'history', label: 'History' },
  { id: 'downloads', label: 'Downloads' },
];

export const hubTrendingEpisodes = [
  {
    id: 1,
    title: 'Ritesh Agarwal | Building OYO from Scratch',
    guest: guest(0),
    views: '95K views',
    category: 'Startups',
    duration: '58 min',
    podcastName: 'Zero Point Five Show',
  },
  {
    id: 2,
    title: 'Sridhar Vembu | AI is Eating the World',
    guest: guest(2),
    views: '120K views',
    category: 'Technology',
    duration: '1h 5min',
    podcastName: 'Zero Point Five Show',
  },
  {
    id: 3,
    title: 'Kunal Shah | Product Strategy in Chaos',
    guest: guest(1),
    views: '87K views',
    category: 'Product',
    duration: '42 min',
    podcastName: 'Zero Point Five Show',
  },
];

export const hubQuickFilters = [
  { id: 'trending', label: 'Trending' },
  { id: 'new', label: 'New Releases' },
  { id: 'top-rated', label: 'Top Rated' },
  { id: 'under-hour', label: 'Under 1 Hour' },
];

export const hubContinueWatching = [
  {
    id: 1,
    title: 'Mastering AI Ethics',
    guest: 'Dr. James Reed',
    duration: '58:32',
    currentTime: '26:24',
    progress: 45,
    image: guest(3).image,
    category: 'AI',
  },
  {
    id: 2,
    title: 'Product Leadership',
    guest: 'Sarah Williams',
    duration: '45:10',
    currentTime: '20:14',
    progress: 44,
    image: guest(1).image,
    category: 'Product',
  },
  {
    id: 3,
    title: 'Startup Fundraising',
    guest: 'David Park',
    duration: '55:18',
    currentTime: '30:03',
    progress: 54,
    image: guest(4).image,
    category: 'Startups',
  },
  {
    id: 4,
    title: 'Engineering Culture',
    guest: 'Maria Garcia',
    duration: '48:00',
    currentTime: '15:08',
    progress: 31,
    image: guest(5).image,
    category: 'Engineering',
  },
];

export const hubMostViewed = [
  {
    id: 1,
    title: 'From Zero to Unicorn',
    subtitle: 'A founder story that still sets the tone.',
    views: '2.4M',
    duration: '1h 12m',
    category: 'Business',
    rating: 4.9,
    guests: [guest(0), guest(1)],
  },
  {
    id: 2,
    title: 'AI Revolution',
    subtitle: 'The practical future of building with AI.',
    views: '1.8M',
    duration: '58 min',
    category: 'AI',
    rating: 4.8,
    guests: [guest(2), guest(3)],
  },
  {
    id: 3,
    title: 'Product Strategy',
    subtitle: 'How the best product teams make decisions.',
    views: '1.2M',
    duration: '1h 4m',
    category: 'Product',
    rating: 5.0,
    guests: [guest(1), guest(4)],
  },
  {
    id: 4,
    title: 'Leadership Lessons',
    subtitle: 'What leadership looks like in the real world.',
    views: '980K',
    duration: '52 min',
    category: 'Leadership',
    rating: 4.7,
    guests: [guest(4), guest(5)],
  },
];

export const hubFounderFavorites = [
  {
    id: 1,
    title: 'Resilient Leadership',
    subtitle: 'Leading through change without losing the plot.',
    duration: '48 min',
    category: 'Leadership',
    rating: 4.9,
    guests: [guest(3), guest(5)],
  },
  {
    id: 2,
    title: 'Building Unicorns',
    subtitle: 'What it takes to build at venture scale.',
    duration: '1h 15min',
    category: 'Startups',
    rating: 4.8,
    guests: [guest(0), guest(4)],
  },
  {
    id: 3,
    title: 'Innovation Mindset',
    subtitle: 'The habit of thinking past the obvious.',
    duration: '52 min',
    category: 'Innovation',
    rating: 5.0,
    guests: [guest(2), guest(1)],
  },
  {
    id: 4,
    title: 'Tech Trends 2026',
    subtitle: 'What the next cycle looks like for builders.',
    duration: '1h 2min',
    category: 'Technology',
    rating: 4.9,
    guests: [guest(5), guest(2)],
  },
];

export const hubLatestReleases = [
  {
    id: 1,
    title: 'Web3 Decoded',
    guest: 'Alex Turner',
    duration: '54 min',
    category: 'Technology',
    isNew: true,
    releaseDate: '2 days ago',
    image: guest(0).image,
  },
  {
    id: 2,
    title: 'Growth Hacking',
    guest: 'Sophie Martin',
    duration: '48 min',
    category: 'Growth',
    isNew: true,
    releaseDate: '4 days ago',
    image: guest(1).image,
  },
  {
    id: 3,
    title: 'Design Systems',
    guest: 'Ryan Cooper',
    duration: '1h 8min',
    category: 'Product',
    isNew: false,
    releaseDate: '1 week ago',
    image: guest(2).image,
  },
  {
    id: 4,
    title: 'Climate Tech',
    guest: 'Maya Johnson',
    duration: '52 min',
    category: 'Innovation',
    isNew: false,
    releaseDate: '1 week ago',
    image: guest(3).image,
  },
];