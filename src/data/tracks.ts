export interface TrackStep {
  level: string;
  title: string;
  description: string;
  modules: string[];
  vendor_alignment: string[];
}

export interface TrackData {
  id: string;
  title: string;
  shortTitle: string;
  color: string;
  icon: string;
  heroImage: string;
  mission: string;
  description: string;
  outcomes: string[];
  roadmap: TrackStep[];
}

export const TRACKS: Record<string, TrackData> = {
  'cloud-computing': {
    id: 'cloud-computing',
    title: 'Cloud Computing',
    shortTitle: 'Cloud',
    color: '#00f2ff',
    icon: '☁️',
    heroImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072',
    mission: 'Architecting the backbone of the African digital economy through multi-cloud resilience.',
    description: 'Master the design, deployment, and governance of high-availability cloud infrastructure across AWS, Azure, and Google Cloud Platform.',
    outcomes: ['Cloud Solutions Architect', 'Cloud Infrastructure Engineer', 'Multi-Cloud Strategist', 'Cloud Governance Lead'],
    roadmap: [
      {
        level: 'Foundation',
        title: 'Cloud Launchpad',
        description: 'Establishing core technical literacy and operating system mastery.',
        modules: ['Linux Fundamentals', 'Network Architecture', 'Cloud Economic Basics'],
        vendor_alignment: ['AWS CCP', 'AZ-900']
      },
      {
        level: 'Associate',
        title: 'Cloud Practitioner Pro',
        description: 'Active workload deployment and specialized resource management.',
        modules: ['Compute & Storage Design', 'IAM & Security Guardrails', 'Workload Deployment'],
        vendor_alignment: ['AWS SAA', 'AZ-104']
      },
      {
        level: 'Professional',
        title: 'Cloud Architect',
        description: 'Commanding complex, production-scale environments with architectural precision.',
        modules: ['Solutions Design Patterns', 'HA/DR Strategy', 'Cost Optimisation'],
        vendor_alignment: ['AWS SAP', 'Azure Solutions Architect']
      },
      {
        level: 'Enterprise',
        title: 'Multi-Cloud Enterprise',
        description: 'Strategic governance and financial engineering for global scale.',
        modules: ['Cloud Governance Frameworks', 'FinOps Mastery', 'Enterprise Landing Zones'],
        vendor_alignment: ['GDA Institutional Fellow']
      }
    ]
  },
  'ai-machine-learning': {
    id: 'ai-machine-learning',
    title: 'AI & Machine Learning',
    shortTitle: 'AI/ML',
    color: '#a78bfa',
    icon: '🤖',
    heroImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2070',
    mission: 'Engineering intelligence to solve complex problems with predictive precision.',
    description: 'From classical data science to modern Generative AI and LLMOps.',
    outcomes: ['AI Product Engineer', 'MLOps Specialist', 'Data Scientist', 'AI Strategy Executive'],
    roadmap: [
      {
        level: 'Foundation',
        title: 'AI Fundamentals',
        description: 'Understanding how intelligence is modeled and governed.',
        modules: ['Predictive Logic', 'Prompt Engineering', 'AI Ethics & Risk'],
        vendor_alignment: ['GDA AI Literacy Cert']
      },
      {
        level: 'Associate',
        title: 'ML Essentials',
        description: 'The core algorithms and data prep for machine learning.',
        modules: ['Python for AI', 'Scikit-learn Mastery', 'Model Evaluation & Tuning'],
        vendor_alignment: ['TensorFlow Associate']
      },
      {
        level: 'Professional',
        title: 'Applied AI Engineering',
        description: 'Building and deploying production-grade intelligent systems.',
        modules: ['LLM & RAG Architecture', 'API-First Intelligence', 'MLOps Automation'],
        vendor_alignment: ['AWS ML Specialty']
      },
      {
        level: 'Enterprise',
        title: 'AI Strategy & Enterprise',
        description: 'Governing institutional AI adoption and strategic ROI.',
        modules: ['AI Governance Frameworks', 'ROI Strategy for AI', 'Responsible AI Leadership'],
        vendor_alignment: ['GDA Leadership Fellow']
      }
    ]
  },
  'cybersecurity': {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    shortTitle: 'Cyber',
    color: '#ef4444',
    icon: '🛡️',
    heroImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070',
    mission: 'Defending institutional borders through practitioner-led vigilance.',
    description: 'Master offensive and defensive security in an era of zero-trust.',
    outcomes: ['Security Analyst', 'Penetration Tester', 'SOC Manager', 'CISO'],
    roadmap: [
      {
        level: 'Foundation',
        title: 'Cyber Essentials',
        description: 'Core literacy in threat detection and personal security.',
        modules: ['Threat Landscape Review', 'Safe Digital Practices', 'Identity Protocol Basics'],
        vendor_alignment: ['Security+', 'AWS Security Fundamentals']
      },
      {
        level: 'Associate',
        title: 'Ethical Hacking',
        description: 'Thinking like a threat actor to build better defences.',
        modules: ['Kali Linux Mastery', 'Penetration Testing Core', 'Vulnerability Assessment'],
        vendor_alignment: ['CEH (Certified Ethical Hacker)']
      },
      {
        level: 'Professional',
        title: 'Security Operations',
        description: 'Governing active detection and incident response.',
        modules: ['SOC Logic', 'SIEM Management', 'Incident Response Architecture'],
        vendor_alignment: ['CySA+', 'AWS Security Specialty']
      },
      {
        level: 'Enterprise',
        title: 'CISO Programme',
        description: 'Leading institutional security and compliance at scale.',
        modules: ['Risk Management Frameworks', 'POPIA & Regulatory Compliance', 'ISO 27001 Implementation'],
        vendor_alignment: ['CISSP Foundations']
      }
    ]
  },
  'data-analytics': {
    id: 'data-analytics',
    title: 'Data & Analytics',
    shortTitle: 'Data',
    color: '#56cfac',
    icon: '📊',
    heroImage: 'https://images.unsplash.com/photo-1551288049-bbda38a1091e?auto=format&fit=crop&q=80&w=2070',
    mission: 'Unlocking institutional value through data engineering and intelligence.',
    description: 'Master the full data lifecycle: from literacy to real-time pipelines.',
    outcomes: ['Data Engineer', 'Analytics Manager', 'BI Architect', 'CDO (Chief Data Officer)'],
    roadmap: [
      {
        level: 'Foundation',
        title: 'Data Literacy',
        description: 'Foundations of quantitative analysis and visualization.',
        modules: ['Analytical Thinking', 'Visual Representation', 'Basic SQL Logic'],
        vendor_alignment: ['GDA Data Literate']
      },
      {
        level: 'Associate',
        title: 'Data Analysis & BI',
        description: 'Driving business insights through modern toolkit mastery.',
        modules: ['Power BI / Tableau', 'Python for Analysis', 'Applied Statistics'],
        vendor_alignment: ['PL-300 (Microsoft Data Analyst)']
      },
      {
        level: 'Professional',
        title: 'Data Engineering',
        description: 'Architecting high-performance data pipelines and warehouses.',
        modules: ['Data Pipelines (ETL)', 'dbt & Cloud Orchestration', 'Spark & Distributed Data'],
        vendor_alignment: ['Azure Data Engineer Specialty']
      },
      {
        level: 'Enterprise',
        title: 'AI-Driven Analytics',
        description: 'Strategic leadership of data-centric institutions.',
        modules: ['CDO Strategy Pillars', 'Data Mesh Architecture', 'Institutional Data Mesh'],
        vendor_alignment: ['Executive Data Leadership']
      }
    ]
  },
  'digital-transformation': {
    id: 'digital-transformation',
    title: 'Digital Transformation',
    shortTitle: 'Transformation',
    color: '#fbbf24',
    icon: '⚡',
    heroImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2070',
    mission: 'Orchestrating the transition to cloud-native performance.',
    description: 'Transform legacy business models through process digitisation and strategic leadership.',
    outcomes: ['DX Strategist', 'Process Architect', 'Change Lead', 'Chief Digital Officer'],
    roadmap: [
      {
        level: 'Foundation',
        title: 'Digital Literacy for Work',
        description: 'Mastering the modern digital ecosystem for productivity.',
        modules: ['M365 Ecosystem', 'Google Workspace Mastery', 'Digital Collaboration Logic'],
        vendor_alignment: ['MS-900']
      },
      {
        level: 'Associate',
        title: 'Process Digitisation',
        description: 'Automating business processes with low-code/no-code tools.',
        modules: ['Low-Code Governance', 'Automation Logic (BPM)', 'Flow Orchestration'],
        vendor_alignment: ['Power Platform Associate']
      },
      {
        level: 'Professional',
        title: 'Digital Transformation Lead',
        description: 'Leading the bridge between technical design and cultural change.',
        modules: ['Technical Change Mgmt', 'DX Milestone Planning', 'CX Strategy Mastery'],
        vendor_alignment: ['Institutional Change Cert']
      },
      {
        level: 'Enterprise',
        title: 'CDO Programme',
        description: 'Directing the digital future of an entire organization.',
        modules: ['Digital Economic Strategy', 'Innovation Governance', 'Performance KPI Design'],
        vendor_alignment: ['Executive DX Fellow']
      }
    ]
  },
  'software-devops': {
    id: 'software-devops',
    title: 'Software & DevOps',
    shortTitle: 'Software/DevOps',
    color: '#ec4899',
    icon: '💻',
    heroImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2072',
    mission: 'Engineering resilient systems with high-velocity delivery.',
    description: 'Full-stack engineering sovereignty combined with automated reliability.',
    outcomes: ['Full-Stack Developer', 'DevOps Engineer', 'Platform Architect', 'SRE'],
    roadmap: [
      {
        level: 'Foundation',
        title: 'Code Launchpad',
        description: 'Building the bedrock of computer science and web literacy.',
        modules: ['HTML/CSS Foundations', 'Python Logic', 'Version Control (Git)'],
        vendor_alignment: ['GDA Developer Core']
      },
      {
        level: 'Associate',
        title: 'Full-Stack Development',
        description: 'Building production-grade applications across the stack.',
        modules: ['React & UI Architecture', 'Node.js & Backend Logic', 'Relational Databases'],
        vendor_alignment: ['GDA Associate Developer']
      },
      {
        level: 'Professional',
        title: 'DevOps & Cloud-Native',
        description: 'Automating the delivery of modern software architectures.',
        modules: ['Docker & Containers', 'CI/CD Pipelines (GitHub Actions)', 'Infrastructure as Code'],
        vendor_alignment: ['Certified Kubernetes Admin']
      },
      {
        level: 'Enterprise',
        title: 'Platform Engineering',
        description: 'Building the internal technical platforms for the enterprise.',
        modules: ['SRE (Site Reliability Engineering)', 'Internal Platform Design', 'Platform FinOps'],
        vendor_alignment: ['Professional Platform Architect']
      }
    ]
  },
  'digital-business': {
    id: 'digital-business',
    title: 'Digital Business',
    shortTitle: 'Business',
    color: '#8b5cf6',
    icon: '🚀',
    heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2015',
    mission: 'Architecting digital ventures for a global intelligence economy.',
    description: 'Master the mechanics of e-commerce, digital ventures, and innovation scaling.',
    outcomes: ['E-Commerce Strategist', 'Venture Designer', 'Digital Product Lead', 'Innovation Director'],
    roadmap: [
      {
        level: 'Foundation',
        title: 'Digital Entrepreneurship 101',
        description: 'The laws of the digital business world.',
        modules: ['Digital Business Models', 'Online Presence Systems', 'Search Governance (SEO)'],
        vendor_alignment: ['GDA Venture Fundamentals']
      },
      {
        level: 'Associate',
        title: 'E-Commerce & Marketing',
        description: 'Operationalizing digital sales and technical growth.',
        modules: ['Shopify Systems', 'Data-Driven Marketing', 'Conversion Logic'],
        vendor_alignment: ['Google Ads Search', 'Meta Marketing Science']
      },
      {
        level: 'Professional',
        title: 'Digital Business Strategy',
        description: 'Product leadership and strategic monetization.',
        modules: ['Technical Product Mgmt', 'Growth Hacking Ops', 'Monetisation Design'],
        vendor_alignment: ['GDA Product Masterclass']
      },
      {
        level: 'Enterprise',
        title: 'Innovation & Ventures',
        description: 'Capital raising and global scaling of digital property.',
        modules: ['Funding Architecture', 'African Market Scaling', 'Venture Governance'],
        vendor_alignment: ['Executive Innovation Fellow']
      }
    ]
  }
};
