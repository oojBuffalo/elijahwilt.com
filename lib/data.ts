export const personalInfo = {
  name: "Elijah Wayne Wilt",
  title: "Technologist\nML Engineer\nAgentic Engineer",
  tagline: "I dwell inside a (bash) shell \u{1F99E}…",
  subtitle: "Post-Baccalaureate in AI | Grad  | The Ohio State University | Current\n Bachelors in CS | UGrad | Cornell University | 2020",
  email: "ew356@cornell.edu",
  email2: "wilt.83@osu.edu",
  email3: "ooj@wilttechnologies.com",
  github: "https://github.com/oojbuffalo",
  replit: "https://replit.com/@ooj",
  linkedin: "https://linkedin.com/in/elijah-wilt",
  x: "https://x.com/oojbuffalo",
};

export const heroTerminalLines = [
  { prompt: "$ whoami", output: personalInfo.name },
  { prompt: "$ cat role.txt", output: personalInfo.title },
  { prompt: "$ cat education.txt", output: personalInfo.subtitle },
  { prompt: "$ cat tagline.txt", output: personalInfo.tagline },
];

export const about = {
  paragraphs: [
    "I am a versatile engineer with strong foundations in machine learning, data systems, and full-stack development. Currently pursuing graduate studies at Ohio State University while bringing practical experience from building production systems—from embedded hardware to ML pipelines.",
    "I’m someone who genuinely enjoys working with technology—not just the trendy stuff, but understanding how systems actually work. Whether it’s training neural networks, writing shell scripts, or debugging embedded systems, I like getting my hands dirty with the technical details.",
    "I love a good terminal workflow. There’s something satisfying about elegant command-line tools and automation scripts. Recently built a Sudoku SAT solver with a TUI just for the fun of creating something clean and useful in the terminal.",
  ],
};

export const skills = {
  "Programming Languages": [
    "Python",
    "MicroPython",
    "C/C++",
    "Java",
    "TypeScript",
    "Bash",
    "SQL",
    "LaTeX",
    "Markdown",
  ],
  "Libraries & Frameworks": [
    "Numpy",
    "Pandas",
    "Scikit-learn",
    "PyTorch",
    "Hugging Face Transformers",
    "NLTK",
    "SpaCy",
    "OpenCV",
    "Albumentations",
    "timm",
    "torchvision",
    "FastAPI",
    "Next.js",
    "React",
    "ESP-IDF",
    "Arduino",
    "PlatformIO",
  ],
  "Tools & Technologies": [
    "Unix CLI",
    "Git",
    "Docker",
    "tmux",
    "vim",
    "Pyenv",
    "W&B",
    "Fusion360",
    "OpenSCAD",
    "Shapr3D",
    "Marlin",
    "Klipper",
    "GRBL",
  ],
  Hardware: [
    "3D Printing",
    "CNC Machining",
    "ESP32",
    "RP2040",
    "nRF52",
    "SAMD",
    "RPi",
    "SBC",
    "I2C",
    "SPI",
    "UART",
    "BLE",
    "WiFi",
    "LoRa",
  ],
};

export const projects = [
  {
    id: "cottonweed",
    title: "Cottonweed Detection",
    summary: "Agricultural weed detection using computer vision and transfer learning",
    description:
      "Took on a Kaggle competition for agricultural weed detection and extended it significantly beyond baseline. Applied transfer learning with modern vision architectures and ensemble techniques. Explored parameter-efficient fine-tuning methods to improve model performance.",
    tech: ["PyTorch", "Transformers", "timm", "OpenCV", "Albumentations", "W&B"],
    type: "Computer Vision",
  },
  {
    id: "twitter-nlp",
    title: "Twitter NLP Study",
    summary: "Investigating how emotion influences engagement during COVID-19",
    description:
      "Investigated how emotion and sentiment influence engagement on Twitter during COVID-19. Extracted polarity, VAD, and 11 emotion categories from tweets using both lexicon-based methods and transformer models. Decomposed text embeddings into orthogonal affect/non-affect subspaces to isolate emotional content contribution.",
    tech: ["PyTorch", "BERT", "RoBERTa", "NLTK", "SpaCy", "Scikit-learn"],
    type: "NLP",
  },
  {
    id: "sudoku-sat",
    title: "Sudoku SAT Solver",
    summary: "Constraint satisfaction solver with polished terminal interface",
    description:
      "Built for fun—a constraint satisfaction solver with a polished command-line interface. Clean, navigable TUI for an elegant terminal experience. Currently cleaning up for GitHub release.",
    tech: ["Python", "SAT Solver", "TUI", "Constraint Satisfaction"],
    type: "Software",
  },
  {
    id: "photogrammetry",
    title: "Photogrammetry Scanner",
    summary: "Custom hardware build with OAK-D camera on motorized turntable",
    description:
      "Custom hardware build: OAK-D Lite camera on motorized turntable. ESP32 MCU controlling stepper motor with rotary encoder interface. Parameterized capture sequences for different scanning modes.",
    tech: ["ESP32", "OAK-D", "Python", "Stepper Motors", "3D Scanning"],
    type: "Hardware",
  },
  {
    id: "cnc-router",
    title: "CNC Router",
    summary: "Complete machine build with custom electronics and web interface",
    description:
      "Complete machine build: aluminum frame, steel components, custom electronics. Configured grblHAL firmware with TMC2209 stepper drivers. Raspberry Pi web interface for remote operation and job management.",
    tech: ["grblHAL", "TMC2209", "Raspberry Pi", "CNC", "G-code"],
    type: "Hardware",
  },
];

export const experience = [
  {
    title: "Graduate Student",
    company: "The Ohio State University",
    period: "2024 – Present",
    description:
      "Pursuing graduate studies in ML/AI. Coursework includes Machine Learning, Neural Networks, Computer Vision, NLP. GPA: 3.88/4.00.",
  },
  {
    title: "Founder & CEO",
    company: "Wilt Technologies, LLC",
    period: "2021 – 2024",
    description:
      "Ran independent consulting startup focused on rapid prototyping and product development. Built complete systems from scratch: hardware, firmware, software. Projects ranged from IoT devices to custom manufacturing equipment.",
  },
  {
    title: "Software Engineer Intern",
    company: "Architecture Technology Corporation",
    period: "Jun – Dec 2019",
    description:
      "Contributed to Cyrm®, a cyber range platform for training military cybersecurity professionals. Built advanced instructional labs and worked on full-stack application features.",
  },
  {
    title: "Data Security Specialist Intern",
    company: "DataHub, LLC",
    period: "Mar – Jun 2019",
    description:
      "Administered systems for IBM’s Guardium distributed database security service. Worked with enterprise-scale data infrastructure.",
  },
];

export const education = [
  {
    degree: "Graduate Studies",
    institution: "The Ohio State University",
    period: "2024 – Present",
    gpa: "3.88/4.00",
    coursework: [
      "Machine Learning & Statistical Pattern Recognition",
      "Neural Networks",
      "Data Mining",
      "Computer Vision for Human-Computer Interaction",
      "Speech & Language Processing",
    ],
    current: [
      "Embedded Computer Systems",
      "Software Startups",
    ],
  },
  {
    degree: "B.S. Computer Science",
    institution: "Cornell University",
    period: "Graduated Dec 2020",
    coursework: [
      "Artificial Intelligence",
      "Machine Learning",
      "Industrial Data & Systems Analysis",
      "Database Systems",
      "Unix Tools & Scripting",
      "Computer System Organization",
      "Operating Systems & Networks",
    ],
  },
];
