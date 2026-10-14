export interface EventInfo {
  name: string;
  tagline: string;
  campus: string;
  city: string;
  state: string;
  date: string;
  time: string;
  venue: string;
  coordinates: string;
  lead: string;
  philosophy: string;
  seatCapacity: number;
}

export const EVENT_INFO: EventInfo = {
  name: "AWS STUDENT BUILDER COMMUNITY DAY",
  tagline: "CONTROLLED DISORDER // BUILD · SHIP · DEPLOY",
  campus: "Rungta University",
  city: "Bhilai",
  state: "Chhattisgarh",
  date: "18 OCT 2026",
  time: "10:00 AM — 5:00 PM IST",
  venue: "Rungta Educational Complex, Kurud Road, Kohka, Bhilai, Chhattisgarh",
  coordinates: "21.1904° N, 81.2849° E",
  lead: "A one-day student builder experience for turning ideas into real projects with cloud, AI and modern web technologies.",
  philosophy: "Practical learning over passive lectures. Zero slides without running code. Every student builder leaves with a deployable prototype and verified cloud credentials.",
  seatCapacity: 100
};

// External Registration URL (Replace this with the actual URL provided by user)
export const REGISTRATION_URL = "https://example.com/register";

export const NAV_LINKS = [
  { label: "Home", path: "/", code: "00" },
  { label: "About", path: "/about", code: "01" },
  { label: "FAQ", path: "/faq", code: "02" },
  { label: "Contact", path: "/contact", code: "03" },
  { label: "Register", path: REGISTRATION_URL, code: "04", isCta: true }
];

export const STATS = [
  { value: "01", label: "Day of building", note: "FULL IMMERSION", detail: "7 hours of intensive hands-on lab sprints" },
  { value: "04+", label: "Hands-on sessions", note: "LABS & WORKSHOPS", detail: "Cloud, Fullstack, GenAI, and Live Deployment" },
  { value: "100+", label: "Student builders", note: "LIMITED CAPACITY", detail: "Selected students from engineering colleges" },
  { value: "∞", label: "Ideas to launch", note: "OPEN HORIZON", detail: "From raw terminal init to live production URLs" }
];

export const LEARNING_TRACKS = [
  {
    code: "TRK_01",
    name: "Cloud Architecture & Hosting",
    focus: "AWS Amplify · S3 · CloudFront · IAM",
    summary: "Understand serverless hosting, object storage, and secure cloud credentials for production applications."
  },
  {
    code: "TRK_02",
    name: "Fullstack Web & APIs",
    focus: "React · Node.js · API Gateway · DynamoDB",
    summary: "Connect front-end user experiences with serverless backends and highly responsive NoSQL databases."
  },
  {
    code: "TRK_03",
    name: "Applied AI Workflows",
    focus: "Amazon Bedrock · Generative AI · LLM APIs",
    summary: "Integrate intelligent models, prompt systems, and generative tools directly into student web prototypes."
  },
  {
    code: "TRK_04",
    name: "Deployment & Open Source",
    focus: "Git · CI/CD · Production Readiness",
    summary: "Learn production debugging, continuous delivery, and contributing to open-source developer ecosystems."
  }
];

export const SCHEDULE_ITEMS = [
  {
    index: "01",
    time: "10:00 — 10:45",
    timeStart: "10:00",
    tag: "ARRIVAL",
    title: "Check-in & coffee",
    description: "Meet other student builders, collect your builder event kit, receive verified lab credentials, and set up your development environment.",
    room: "Main Campus Atrium",
    leadMentor: "Campus Volunteer Corps"
  },
  {
    index: "02",
    time: "10:45 — 12:00",
    timeStart: "10:45",
    tag: "KEYNOTE",
    title: "The builder mindset",
    description: "Community welcome, keynote address, and an orientation to how modern cloud infrastructure accelerates student innovation.",
    room: "Auditorium A",
    leadMentor: "Student Community Mentors"
  },
  {
    index: "03",
    time: "12:00 — 13:30",
    timeStart: "12:00",
    tag: "HANDS-ON",
    title: "Build your first cloud app",
    description: "Interactive workshop: Explore serverless hosting, API configurations, database connections, and the fundamentals of continuous deployment.",
    room: "Cloud Computing Lab 01",
    leadMentor: "Cloud Track Mentors"
  },
  {
    index: "04",
    time: "14:00 — 16:00",
    timeStart: "14:00",
    tag: "LAB",
    title: "AI + web project lab",
    description: "Guided prototyping sprint: Use AI-assisted development tools and foundation model APIs to turn an idea into a functional prototype.",
    room: "AI Accelerator Lab",
    leadMentor: "AI/ML Lead Facilitators"
  },
  {
    index: "05",
    time: "16:00 — 17:00",
    timeStart: "16:00",
    tag: "DEMO",
    title: "Demo hour & networking",
    description: "Show your project on the big screen, receive feedback from mentors, network with peers, and discuss next steps for open-source incubation.",
    room: "Community Stage",
    leadMentor: "All Mentors & Guest Devs"
  }
];

export const COMMUNITY_PROFILES = [
  {
    id: "01",
    avatar: "SB",
    name: "Student Builder Mentors",
    role: "Cloud · Web · AI Architecture",
    badge: "MENTOR CORPS",
    bio: "Experienced peer leaders and cloud practitioners dedicated to guiding student builders through code debugging, cloud provisioning, and project architecture.",
    topics: ["Serverless Architecture", "Prompt Engineering", "Fullstack React", "IAM Security"],
    quote: "Building is the fastest way to understand any technology."
  },
  {
    id: "02",
    avatar: "RU",
    name: "Campus Community Team",
    role: "Developer Community Organizers",
    badge: "HOST CHAPTER",
    bio: "The on-campus developer crew coordinating student logistics, lab access, hardware readiness, and peer study groups at Rungta University.",
    topics: ["Community Building", "Hackathon Organization", "Peer Mentorship", "Student Chapters"],
    quote: "Empowering every student on campus to write code that matters."
  },
  {
    id: "03",
    avatar: "DEV",
    name: "Guest Developers",
    role: "Industry Cloud Engineers",
    badge: "INDUSTRY NETWORK",
    bio: "Engineers and open-source contributors from the wider developer ecosystem sharing field stories, code review feedback, and real-world infrastructure practices.",
    topics: ["Production Reliability", "Career Pathways", "Open Source Contribution", "Distributed Systems"],
    quote: "Your college projects are the foundation of your engineering career."
  }
];

export const FAQ_LIST = [
  {
    id: "faq-1",
    question: "Is this event free?",
    answer: "Yes. This fictional screening-task event is presented as 100% free for all enrolled university students. Access to workshops, mentor guidance, and cloud lab setups are complimentary.",
    category: "Registration"
  },
  {
    id: "faq-2",
    question: "Do I need prior AWS experience?",
    answer: "No. The sessions are carefully structured to accommodate beginners with basic programming knowledge, while intermediate and advanced students can extend their prototypes with deeper cloud services.",
    category: "Prerequisites"
  },
  {
    id: "faq-3",
    question: "What should I bring?",
    answer: "Bring a laptop with Wi-Fi capability, your power charger, your official university/college photo ID card for campus entry, and an idea you would like to prototype.",
    category: "Logistics"
  },
  {
    id: "faq-4",
    question: "Can I deploy this website?",
    answer: "Yes. It is a modern React + Vite application that compiles into standard static assets and can be deployed with zero hassle on AWS Amplify, S3 + CloudFront, Vercel, Netlify, or GitHub Pages.",
    category: "Technical"
  }
];

export const GALLERY_ITEMS = [
  {
    id: "gal-1",
    title: "Intensive Builder Collaboration",
    caption: "Student teams collaborating on cloud deployments during the hands-on lab sprints at Rungta University.",
    category: "CAMPUS LAB",
    aspect: "landscape",
    year: "2026",
    tag: "PROTOTYPING"
  },
  {
    id: "gal-2",
    title: "System Architecture Blueprint",
    caption: "Serverless fullstack topology: API Gateway, AWS Lambda handlers, DynamoDB tables, and AI endpoints.",
    category: "ARCHITECTURE",
    aspect: "square",
    year: "SPEC.V1",
    tag: "CLOUD_MAP"
  },
  {
    id: "gal-3",
    title: "Code Review & Mentorship",
    caption: "Peer mentors inspecting terminal build outputs and resolving cloud environment configuration challenges.",
    category: "MENTORSHIP",
    aspect: "portrait",
    year: "2026",
    tag: "COMMUNITY"
  },
  {
    id: "gal-4",
    title: "Demo Hour Project Showcases",
    caption: "Students presenting working applications to peers, sharing architecture decisions and live demo URLs.",
    category: "STAGE DEMO",
    aspect: "landscape",
    year: "2026",
    tag: "SHOWCASE"
  }
];
