export const personalInfo = {
  name: "Elijah Wayne Wilt",
  title: "Technologist\nML Engineer\nAgentic Engineer",
  tagline: "I dwell inside a (bash) shell \u{1F99E}…",
  subtitle: "Grad  | AI @ tOSU    | Current\nUGrad | CS @ Cornell | 2020",
  email: "ew356@cornell.edu",
  email2: "wilt.83@osu.edu",
  email3: "ooj@wilttechnologies.com",
  github: "https://github.com/oojbuffalo",
  replit: "https://replit.com/@ooj",
  linkedin: "https://linkedin.com/in/elijahwilt",
  x: "https://x.com/oojbuffalo",
};

export const heroTerminalLines = [
  { prompt: "$ whoami", output: personalInfo.name },
  { prompt: "$ cat role.txt", output: personalInfo.title },
  { prompt: "$ cat education.txt", output: personalInfo.subtitle },
  { prompt: "$ cat tagline.txt", output: personalInfo.tagline },
];

export const about = {
  focusAreas: [
    "Machine Learning",
    "Data Systems",
    "Embedded Systems",
    "Full-Stack",
  ],
  paragraphs: [
    "I’m a versatile engineer with strong foundations in machine learning, data systems, and full-stack development—currently pursuing graduate studies at Ohio State, with hands-on experience building production systems from embedded hardware to ML pipelines.",
    "I like understanding how systems actually work, not just the trendy parts—training neural networks, writing shell scripts, debugging embedded systems. And I love a good terminal workflow: I recently built a Sudoku SAT solver with a clean TUI just for the fun of it.",
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

/** Visual category of a project; drives the editor-tab file extension. */
export type ProjectType =
  | "Computer Vision"
  | "NLP"
  | "Machine Learning"
  | "Software"
  | "Hardware";

/** Lifecycle badge shown in the detail pane. Defaults to "shipped" in the UI. */
export type ProjectStatus = "shipped" | "wip" | "archived";

/** A single project — a "file" in the explorer tree. */
export interface Project {
  /** Stable slug; used as the `?project=` deep-link value and React key. */
  id: string;
  title: string;
  summary: string;
  description: string;
  tech: string[];
  type: ProjectType;
  /** GitHub URL; renders a "View on GitHub" link when present. */
  repo?: string;
  /** Lifecycle badge; defaults to "shipped" when omitted. */
  status?: ProjectStatus;
  /**
   * Scaffold placeholder. Renders dimmed and non-interactive, and is excluded
   * from deep-link targets. Replace with a real project to "fill in" the slot.
   */
  todo?: boolean;
}

/** A named subdirectory (a course or a company) holding project files. */
export interface ProjectDir {
  /** Stable slug — used for the `?dirs=` expand-state and element ids. */
  id: string;
  /** Display name without trailing slash, e.g. "Neural Networks". */
  name: string;
  projects: Project[];
}

/** A top-level directory. Either nests subdirs (coursework/professional) or holds flat files (personal). */
export interface ProjectCategory {
  id: "coursework" | "professional" | "personal";
  /** Shown as "<name>/". */
  name: string;
  /** Course/company subdirectories. */
  dirs?: ProjectDir[];
  /** Flat files directly in the category (personal). */
  projects?: Project[];
}

/** Convenience for a scaffold placeholder file under a given course/company. */
const todoProject = (id: string, context: string): Project => ({
  id,
  title: "Coming soon",
  summary: `Placeholder — add a project for ${context}.`,
  description: "",
  tech: [],
  type: "Software",
  todo: true,
});

/**
 * Projects as an explorer tree, ordered by hand (like `timeline`). Course folder
 * names are shortened to fit the file navigator on one line (the full course
 * titles live in `timeline`); company names mirror the `timeline` work entries.
 * Categorization of the existing projects is a best guess — moving a project
 * between courses/companies is a one-line array edit.
 */
export const projectTree: ProjectCategory[] = [
  {
    id: "coursework",
    name: "coursework",
    dirs: [
      {
        id: "cv-hci",
        name: "Computer Vision",
        projects: [
          {
            id: "cottonweed",
            title: "Cottonweed Detection",
            summary:
              "Agricultural weed detection using computer vision and transfer learning",
            description:
              "Took on a Kaggle competition for agricultural weed detection and extended it significantly beyond baseline. Applied transfer learning with modern vision architectures and ensemble techniques. Explored parameter-efficient fine-tuning methods to improve model performance.",
            tech: ["PyTorch", "Transformers", "timm", "OpenCV", "Albumentations", "W&B"],
            type: "Computer Vision",
            status: "shipped",
          },
          {
            id: "cse5524-rpn",
            title: "Region Proposal Network",
            summary:
              "CSE 5524 — anchor-based object-detection proposals built from scratch in NumPy",
            description:
              "Implemented the core of a simplified region proposal network from first principles in pure NumPy, with no detection libraries. Generated per-patch ground-truth tensors, encoded and decoded anchor boxes across scales and aspect ratios, computed Intersection-over-Union, and ran non-maximum suppression to filter overlapping proposals. Together these are the geometric and algorithmic machinery underlying modern object detectors.",
            tech: ["Python", "NumPy", "IoU", "Anchor Boxes", "Non-Max Suppression", "Object Detection"],
            type: "Computer Vision",
            status: "shipped",
          },
          {
            id: "cse5524-autoencoder",
            title: "Representation Learning with Autoencoders",
            summary:
              "CSE 5524 — probing a convolutional autoencoder layer-by-layer to see what it learns",
            description:
              "Built a convolutional autoencoder in PyTorch on a synthetic colored-shapes dataset (3 shapes, 8 colors). Probed what each layer encodes by running 1-nearest-neighbor classification of shape and color on its intermediate features using cosine distance, isolating where in the network each attribute becomes linearly separable.",
            tech: ["Python", "PyTorch", "CNN", "Autoencoders", "Representation Learning", "1-NN"],
            type: "Computer Vision",
            status: "shipped",
          },
        ],
      },
      {
        id: "speech-language",
        name: "NLP",
        projects: [
          {
            id: "twitter-nlp",
            title: "Twitter NLP Study",
            summary: "Investigating how emotion influences engagement during COVID-19",
            description:
              "Investigated how emotion and sentiment influence engagement on Twitter during COVID-19. Extracted polarity, VAD, and 11 emotion categories from tweets using both lexicon-based methods and transformer models. Decomposed text embeddings into orthogonal affect/non-affect subspaces to isolate emotional content contribution.",
            tech: ["PyTorch", "BERT", "RoBERTa", "NLTK", "SpaCy", "Scikit-learn"],
            type: "NLP",
            status: "shipped",
          },
          {
            id: "cse5525-transformer",
            title: "Transformer from Scratch",
            summary:
              "CSE 5525 — self-attention, positional encodings, and causal masking, hand-built",
            description:
              "Implemented a simplified Transformer from scratch in PyTorch, using scaled dot-product self-attention with query/key/value projections, residual connections, and feed-forward blocks to validate attention on a character-counting task. Extended the architecture for autoregressive character-level language modeling with causal masking on the text8 corpus, building on PyTorch's TransformerEncoder components.",
            tech: ["Python", "PyTorch", "Self-Attention", "Positional Encoding", "Causal Masking", "Language Modeling", "Transformer"],
            type: "NLP",
            status: "shipped",
          },
          {
            id: "cse5525-text-to-sql",
            title: "Natural Language to SQL",
            summary:
              "CSE 5525 — T5 fine-tuning vs. from-scratch vs. few-shot LLM prompting",
            description:
              "Translated natural-language questions into SQL three ways and compared them: fine-tuning a pretrained T5 encoder-decoder, training the same architecture from random initialization to isolate what pretraining buys, and zero-/few-shot prompting of instruction-tuned LLMs (Gemma 1.1 2B, CodeGemma 7B) with systematic prompt and example-selection ablations. Evaluated on database-record F1 so semantically-equivalent queries count as correct rather than penalizing surface string differences.",
            tech: ["Python", "PyTorch", "Hugging Face Transformers", "T5", "LLM Prompting", "Fine-Tuning", "Seq2Seq"],
            type: "NLP",
            status: "shipped",
          },
        ],
      },
      {
        id: "neural-networks",
        name: "Neural Networks",
        projects: [
          {
            id: "cse5526-rnn-lstm",
            title: "RNN vs. LSTM Sequence Models",
            summary:
              "CSE 5526 — isolating the effect of gating on long-range dependencies",
            description:
              "Trained vanilla RNNs and LSTMs in PyTorch on a synthetic sequence-classification task (flagging when a running sum crosses a threshold) to isolate the effect of gating on long-range dependencies. Ran a structured ablation sweep over sequence length (10, 25, 50, 100), network depth, hidden-unit count, and training-set size, analyzing where the vanilla RNN degrades and the LSTM holds up.",
            tech: ["Python", "PyTorch", "RNN", "LSTM", "Sequence Modeling", "Ablation Study"],
            type: "Machine Learning",
            status: "shipped",
          },
        ],
      },
      {
        id: "data-mining",
        name: "Data Mining",
        projects: [
          {
            id: "cse5243-classification",
            title: "Profit-Optimized Classification",
            summary: "CSE 5243 — purchase-intent classifier optimized for ROI, not accuracy",
            description:
              "End-to-end supervised-learning project on e-commerce purchase data: explored and cleaned 12,331 records, then built and compared K-Nearest Neighbor, decision-tree, and Naive Bayes classifiers with GridSearchCV tuning, cross-validation, and random undersampling for class imbalance. The differentiator is a custom cost-benefit metric that weighs intervention cost against conversion revenue, so models were selected for net profit rather than raw accuracy and the findings were packaged into a stakeholder-facing recommendation.",
            tech: ["Python", "pandas", "scikit-learn", "imbalanced-learn", "Random Undersampling", "GridSearchCV", "Classification"],
            type: "Machine Learning",
            status: "shipped",
          },
          {
            id: "cse5243-segmentation",
            title: "Customer Segmentation",
            summary: "CSE 5243 — K-Means vs. DBSCAN to surface restaurant market segments",
            description:
              "Segmented restaurant customers into interpretable market groups by comparing K-Means and DBSCAN on standardized visit features (adults, children, drink spending, visit length, time of day). Used hierarchical clustering with Ward linkage and dendrogram analysis to choose the cluster count (K=3) and seed K-Means centroids, then validated with silhouette analysis. The result was three actionable segments — couples on date nights, families with children, and happy-hour groups — communicated through PCA projections, parallel-coordinate plots, and cluster distributions.",
            tech: ["Python", "pandas", "scikit-learn", "K-Means", "DBSCAN", "Hierarchical Clustering", "Silhouette Analysis", "Clustering"],
            type: "Machine Learning",
            status: "shipped",
          },
          {
            id: "cse5243-market-basket",
            title: "Market-Basket Mining",
            summary: "CSE 5243 — association-rule mining for cross-sell opportunities",
            description:
              "Mined frequent itemsets and association rules from grocery transaction data using the Apriori algorithm, with contingency-table analysis to validate rule metrics. Ranked rules by total revenue impact — combining direct revenue changes from the discounted item with indirect gains from cross-sell — to surface the product pairings best suited to targeted 10% discounts.",
            tech: ["Python", "pandas", "mlxtend", "Apriori", "Association Rules", "Market Basket Analysis"],
            type: "Machine Learning",
            status: "shipped",
          },
        ],
      },
      {
        id: "embedded-systems",
        name: "Embedded Systems",
        projects: [
          {
            id: "cafftrak",
            title: "CaffTrak",
            summary: "ECE 5466 — ESP32 firmware for a smart caffeine-tracking coaster",
            description:
              "Wrote the complete embedded firmware for CaffTrak, a smart beverage coaster that tracks caffeine and hydration — roughly 2,000 lines of C/C++ on an ESP32 running a dual-core FreeRTOS design: the BLE stack on one core, sensor polling on the other, linked by a queue. An HX711 load cell drives a moving-average sip-detection state machine, an MFRC522 NFC reader auto-switches drinker profiles, a WS2812B strip signals status, and a physical button handles tare and profile cycling; profiles and calibration persist to ESP32 NVS. The whole system is exposed over a custom BLE GATT service with offline event buffering, which a teammate's Android app consumes.",
            tech: ["ESP32", "C/C++", "FreeRTOS", "PlatformIO", "BLE / NimBLE", "HX711", "MFRC522 / NFC", "FastLED"],
            type: "Hardware",
            status: "shipped",
            repo: "https://github.com/oojBuffalo/cafftrak",
          },
        ],
      },
      {
        id: "machine-learning",
        name: "Machine Learning",
        projects: [
          todoProject(
            "todo-machine-learning",
            "Machine Learning & Statistical Pattern Recognition"
          ),
        ],
      },
    ],
  },
  {
    id: "professional",
    name: "professional",
    dirs: [
      {
        id: "wilt-technologies",
        name: "Wilt Technologies LLC",
        projects: [
          {
            id: "cnc-router",
            title: "CNC Router",
            summary: "Complete machine build with custom electronics and web interface",
            description:
              "Complete machine build: aluminum frame, steel components, custom electronics. Configured grblHAL firmware with TMC2209 stepper drivers. Raspberry Pi web interface for remote operation and job management.",
            tech: ["grblHAL", "TMC2209", "Raspberry Pi", "CNC", "G-code"],
            type: "Hardware",
            status: "shipped",
          },
          {
            id: "photogrammetry",
            title: "Photogrammetry Scanner",
            summary: "Custom hardware build with OAK-D camera on motorized turntable",
            description:
              "Custom hardware build: OAK-D Lite camera on motorized turntable. ESP32 MCU controlling stepper motor with rotary encoder interface. Parameterized capture sequences for different scanning modes.",
            tech: ["ESP32", "OAK-D", "Python", "Stepper Motors", "3D Scanning"],
            type: "Hardware",
            status: "shipped",
          },
        ],
      },
    ],
  },
  {
    id: "personal",
    name: "personal",
    projects: [
      {
        id: "sudoku-sat",
        title: "Sudoku SAT Solver",
        summary: "Constraint satisfaction solver with polished terminal interface",
        description:
          "Built for fun—a constraint satisfaction solver with a polished command-line interface. Clean, navigable TUI for an elegant terminal experience. Currently cleaning up for GitHub release.",
        tech: ["Python", "SAT Solver", "TUI", "Constraint Satisfaction"],
        type: "Software",
        status: "wip",
      },
    ],
  },
];

interface TimelineEntryBase {
  /** Job title or degree name. */
  title: string;
  /** Company or institution. */
  org: string;
  /** Human-readable date range, e.g. "2024 – Present". */
  period: string;
}

export interface WorkEntry extends TimelineEntryBase {
  type: "work";
  description: string;
}

export interface EducationEntry extends TimelineEntryBase {
  type: "education";
  /** Field of study, rendered on its own line under the degree. */
  major?: string;
  gpa?: string;
  coursework: string[];
}

export type TimelineEntry = WorkEntry | EducationEntry;

/**
 * Unified work + education history, ordered newest-first. Order is maintained
 * by hand rather than derived from `period` so we never have to parse fuzzy
 * ranges like "Jun – Dec 2019". On wide screens education renders on the left
 * of a center spine and work on the right; on narrow screens it collapses to a
 * single left-spine column.
 */
export const timeline: TimelineEntry[] = [
  {
    type: "education",
    title: "Post-Baccalaureate Coursework",
    major: "Artificial Intelligence",
    org: "The Ohio State University",
    period: "2024 – Present",
    gpa: "3.93/4.00",
    coursework: [
      "Machine Learning & Statistical Pattern Recognition",
      "Neural Networks",
      "Data Mining",
      "Computer Vision for Human-Computer Interaction",
      "Speech & Language Processing",
      "Embedded Computer Systems",
      "Software Startups",
    ]
  },
  {
    type: "work",
    title: "Founder",
    org: "Wilt Technologies, LLC",
    period: "Jan 2021 – Aug 2024",
    description:
      "Ran independent consulting startup focused on rapid prototyping and product development. Built complete systems from scratch: hardware, firmware, software. Projects ranged from IoT devices to custom manufacturing equipment.",
  },
  {
    type: "education",
    title: "Bachelor of Science",
    major: "Computer Science",
    org: "Cornell University",
    period: "Dec 2020",
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
  {
    type: "work",
    title: "Software Engineer Intern",
    org: "Architecture Technology Corporation",
    period: "Jun – Dec 2019",
    description:
      "Contributed to Cyrm®, a cyber range platform for training military cybersecurity professionals. Built advanced instructional labs and worked on full-stack application features.",
  },
  {
    type: "work",
    title: "Data Security Specialist Intern",
    org: "DataHub, LLC",
    period: "Mar – Jun 2019",
    description:
      "Administered systems for IBM’s Guardium distributed database security service. Worked with enterprise-scale data infrastructure.",
  },
];
