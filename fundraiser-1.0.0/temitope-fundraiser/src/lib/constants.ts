export const CAMPAIGN = {
  GOAL: 350_000,
  CURRENCY: "NGN",
  CURRENCY_SYMBOL: "₦",
  LAPTOP_MODEL: "Dell Latitude 7400",
  BENEFICIARY: "Temitope Ogungbuji",
  GITHUB: "https://github.com/Bambillion",
  TWITTER: "https://twitter.com/temitope_dev",
  LINKEDIN: "https://linkedin.com/in/temitope-ogungbuji",
  EMAIL: "temitope@example.com",
} as const;

export const PRESET_AMOUNTS = [1_000, 2_500, 5_000, 10_000, 20_000] as const;

export const LAPTOP_SPECS = [
  { label: "Model", value: "Dell Latitude 7400" },
  { label: "Processor", value: "Intel Core i5-8365U (8th Gen, Quad-Core)" },
  { label: "RAM", value: "8 GB DDR4" },
  { label: "Storage", value: "256 GB SSD" },
  { label: "Display", value: '14" FHD IPS' },
  { label: "OS", value: "Windows 10 Pro / Ubuntu ready" },
] as const;

export const SKILLS_CURRENT = [
  "Python",
  "SQL",
  "Git",
  "Linux CLI",
  "Data Modeling",
];

export const SKILLS_LEARNING = [
  "Data Engineering",
  "Analytics Engineering",
  "Apache Airflow",
  "dbt",
  "C Programming",
  "C++",
  "Java",
  "Cloud (AWS / GCP)",
];

export const SUPPORT_TYPES = {
  internship: { label: "Refer an Internship", icon: "💼" },
  learning_resource: { label: "Share a Resource", icon: "📚" },
  certification: { label: "Suggest a Certification", icon: "🏅" },
  mentorship: { label: "Offer Mentorship", icon: "🧭" },
  project_idea: { label: "Submit a Project Idea", icon: "💡" },
  networking: { label: "Connect Professionally", icon: "🤝" },
} as const;
