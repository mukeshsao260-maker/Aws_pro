export interface EventMeta {
  name: string;
  subTitle: string;
  location: string;
  state: string;
  date: string;
  time: string;
  venue: string;
  lead: string;
}

export const EVENT_DATA: EventMeta = {
  name: "AWS STUDENT BUILDER COMMUNITY DAY",
  subTitle: "Community Day",
  location: "Rungta University",
  state: "Chhattisgarh",
  date: "18 OCT 2026",
  time: "10 AM — 5 PM",
  venue: "Rungta University Campus",
  lead: "A one-day student builder experience for turning ideas into real projects with cloud, AI and modern web technologies."
};

export const NAVIGATION_LINKS = [
  { label: "About", href: "#about", code: "01" },
  { label: "Schedule", href: "#schedule", code: "02" },
  { label: "Community", href: "#community", code: "03" },
  { label: "FAQ", href: "#faq", code: "04" },
  { label: "Register", href: "#register", code: "05", isCta: true }
];

export const STATISTICS_DATA = [
  { value: "01", label: "Day of building", note: "FULL IMMERSION" },
  { value: "04+", label: "Hands-on sessions", note: "LABS & WORKSHOPS" },
  { value: "100+", label: "Student builders", note: "LIMITED CAPACITY" },
  { value: "∞", label: "Ideas to launch", note: "OPEN HORIZON" }
];

export const FEATURE_DATA = [
  {
    index: "01",
    title: "Learn by doing",
    description: "Follow guided workshops and build alongside mentors.",
    tag: "PRACTICAL LABS"
  },
  {
    index: "02",
    title: "Meet builders",
    description: "Connect with students, developers and community volunteers.",
    tag: "NETWORKING"
  },
  {
    index: "03",
    title: "Ship your idea",
    description: "Finish with a prototype, feedback and a clear next step.",
    tag: "PROTOTYPING"
  }
];

export const SCHEDULE_DATA = [
  {
    index: "01",
    time: "10:00",
    tag: "ARRIVAL",
    title: "Check-in & coffee",
    description: "Meet other student builders and get your event kit.",
    room: "MAIN ATRIUM"
  },
  {
    index: "02",
    time: "10:45",
    tag: "KEYNOTE",
    title: "The builder mindset",
    description: "Community welcome and an introduction to the day.",
    room: "AUDITORIUM A"
  },
  {
    index: "03",
    time: "12:00",
    tag: "HANDS-ON",
    title: "Build your first cloud app",
    description: "Explore hosting, APIs and the basics of deployment.",
    room: "CLOUD LAB 1"
  },
  {
    index: "04",
    time: "14:00",
    tag: "LAB",
    title: "AI + web project lab",
    description: "Use AI-assisted development to turn an idea into a prototype.",
    room: "AI ACCELERATOR LAB"
  },
  {
    index: "05",
    time: "16:00",
    tag: "DEMO",
    title: "Demo hour & networking",
    description: "Show your project, get feedback and meet the community.",
    room: "COMMUNITY STAGE"
  }
];

export const COMMUNITY_DATA = [
  {
    id: "01",
    avatar: "SB",
    title: "Student Builder Mentors",
    subtitle: "Cloud · Web · AI",
    badge: "MENTOR CORPS",
    description: "Experienced peer leads and cloud practitioners guiding project architecture and deployment."
  },
  {
    id: "02",
    avatar: "RU",
    title: "Campus Community Team",
    subtitle: "Developer community",
    badge: "HOST CHAPTER",
    description: "Organizers running community tracks, university liaisons, and student support."
  },
  {
    id: "03",
    avatar: "DEV",
    title: "Guest Developers",
    subtitle: "Projects · Careers · Open source",
    badge: "INDUSTRY NETWORK",
    description: "Engineers sharing field stories, code reviews, and career paths in cloud infrastructure."
  }
];

export const FAQ_DATA = [
  {
    id: "faq-1",
    question: "Is this event free?",
    answer: "Yes. This fictional event is presented as free for students. Registration is complimentary thanks to community supporters."
  },
  {
    id: "faq-2",
    question: "Do I need prior AWS experience?",
    answer: "No. The sessions are designed for beginners, while experienced students can extend the projects."
  },
  {
    id: "faq-3",
    question: "What should I bring?",
    answer: "Bring a laptop, charger, college ID and an idea you would like to build."
  },
  {
    id: "faq-4",
    question: "Can I deploy this website?",
    answer: "Yes. It is a static HTML, CSS and JavaScript project and can be deployed on GitHub Pages, Netlify or Vercel."
  }
];

export const REGISTRATION_GUIDELINES = [
  "Bring your laptop + charger",
  "Use an active email address",
  "Carry your college ID"
];

export const INTEREST_OPTIONS = [
  "Cloud / AWS",
  "Web Development",
  "AI / ML",
  "Data Science",
  "Open Source"
];
