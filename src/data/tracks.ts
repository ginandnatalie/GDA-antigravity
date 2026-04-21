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
  'cloud-engineering': {
    id: 'cloud-engineering',
    title: 'Cloud Engineering (Computing)',
    shortTitle: 'Cloud Engineering',
    color: '#00f2ff',
    icon: '☁️',
    heroImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072',
    mission: 'To build the architects of Africa\'s digital infrastructure through multi-cloud mastery.',
    description: 'This pathway takes candidates from fundamental technical literacy to lead cloud architect roles. We focus on high-fidelity infrastructure, site reliability, and multi-cloud resilience (AWS, Azure, GCP).',
    outcomes: [
      'Certified Cloud Architect (AWS/Azure/GCP)',
      'Systems & Resilience Lead',
      'Infrastructure Developer (IaC Specialist)',
      'Enterprise Solutions Strategist'
    ],
    roadmap: [
      {
        level: 'Foundation',
        title: 'Cloud Launchpad',
        description: 'Establishing the core technical literacy and operating system mastery required for all engineering roles.',
        modules: ['Linux Systems Foundations', 'Networking Fundamentals', 'Security Protocol Basics'],
        vendor_alignment: ['AWS CCP', 'AZ-900']
      },
      {
        level: 'Associate',
        title: 'Compute & Storage Specialisation',
        description: 'Moving into active workload deployment and resource management on leading vendor platforms.',
        modules: ['High-Availability Architecture', 'Storage Solutions Design', 'Virtualisation & Containers'],
        vendor_alignment: ['AWS SAA', 'AZ-104']
      },
      {
        level: 'Professional',
        title: 'Architecture Residency',
        description: 'Commanding complex, production-scale environments with architectural precision.',
        modules: ['Hybrid Cloud Strategy', 'Infrastructure as Code (Terraform)', 'Performance Optimisation'],
        vendor_alignment: ['GCP Professional Architect', 'AWS SAP']
      },
      {
        level: 'Elite',
        title: 'Institutional Leadership',
        description: 'Governing global-scale digital transformation and leading institutional engineering teams.',
        modules: ['Financial Engineering (FinOps)', 'Crisis Architecture Management', 'Global Infrastructure Governance'],
        vendor_alignment: ['GDA Institutional Fellow']
      }
    ]
  },
  'ai-ml-engineering': {
    id: 'ai-ml-engineering',
    title: 'AI & ML Engineering',
    shortTitle: 'AI/ML Engineering',
    color: '#a78bfa',
    icon: '🤖',
    heroImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2070',
    mission: 'Engineering intelligent systems that solve African problems with global precision.',
    description: 'From classical machine learning to modern generative AI, this track covers the full intelligence lifecycle—from data prepping to LLMOps.',
    outcomes: [
      'MLOps Specialist',
      'AI Product Engineer',
      'Data Scientist (Applied)',
      'Intelligence Systems Lead'
    ],
    roadmap: [
      {
        level: 'Foundation',
        title: 'AI Ready Foundations',
        description: 'Mathematical foundations and Python mastery for artificial intelligence.',
        modules: ['Python for Data Science', 'Mathematical Logic for AI', 'API First Development'],
        vendor_alignment: ['Coursera / DeepLearning.ai']
      },
      {
        level: 'Associate',
        title: 'ML Engineering Core',
        description: 'Building, training, and evaluating classical machine learning models.',
        modules: ['Supervised & Unsupervised Learning', 'Data Pre-processing Pipelines', 'Model Evaluation & Testing'],
        vendor_alignment: ['TensorFlow Cert', 'Azure AI Engineer']
      },
      {
        level: 'Professional',
        title: 'Production Intelligence',
        description: 'Deploying and managing production-grade AI at scale.',
        modules: ['LLMOps & RAG Architecture', 'Model Deployment Patterns', 'Continuous AI Evaluation'],
        vendor_alignment: ['AWS Machine Learning Specialty']
      }
    ]
  },
  'data-engineering': {
    id: 'data-engineering',
    title: 'Data Engineering',
    shortTitle: 'Data Engineering',
    color: '#56cfac',
    icon: '📊',
    heroImage: 'https://images.unsplash.com/photo-1551288049-bbda38a1091e?auto=format&fit=crop&q=80&w=2070',
    mission: 'Building the data pipelines that power Africa\'s intelligence economy.',
    description: 'Master the design and operation of enterprise-grade data infrastructure, focusing on pipelines, warehouses, and real-time streaming.',
    outcomes: [
      'Big Data Architect',
      'DataOps Specialist',
      'ETL Engineer',
      'Data Systems Lead'
    ],
    roadmap: [
      {
        level: 'Foundation',
        title: 'Data Literacy Core',
        description: 'Mastery of query languages and data modelling fundamentals.',
        modules: ['Advanced SQL Mastery', 'Relational Modelling', 'ETL Logic'],
        vendor_alignment: ['PostgreSQL Core']
      }
    ]
  },
  'devsecops-sre': {
    id: 'devsecops-sre',
    title: 'DevSecOps & SRE',
    shortTitle: 'DevSecOps',
    color: '#f4664a',
    icon: '🔐',
    heroImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=2070',
    mission: 'Securing the velocity of digital delivery through automated rigour.',
    description: 'Focused on site reliability, delivery automation, and security-first engineering. This track prepares engineers to govern high-velocity deployment pipelines with absolute resilience.',
    outcomes: ['SRE Engineer', 'DevSecOps Lead', 'Platform Architect', 'Security Automations Engineer'],
    roadmap: [
      {
        level: 'Foundation',
        title: 'Automation Literacy',
        description: 'Mastering the shell and the foundations of automated systems.',
        modules: ['Advanced Linux Operations', 'Shell Scripting Foundations', 'Version Control Governance'],
        vendor_alignment: ['LPI Linux Essentials']
      },
      {
        level: 'Associate',
        title: 'CI/CD Engineering',
        description: 'Building and governing the delivery pipelines that power modern software.',
        modules: ['Container Orchestration (K8s)', 'Automated Delivery (ArgoCD)', 'Infrastructure as Code'],
        vendor_alignment: ['Certified Kubernetes Admin']
      },
      {
        level: 'Professional',
        title: 'Security Operations (SecOps)',
        description: 'Injecting security into every layer of the engineering lifecycle.',
        modules: ['SAST/DAST Integration', 'Vulnerability Governance', 'Automated Compliance'],
        vendor_alignment: ['AWS Security Specialty']
      }
    ]
  },
  'technical-leadership': {
    id: 'technical-leadership',
    title: 'Technical Leadership',
    shortTitle: 'Tech Lead',
    color: '#ffffff',
    icon: '💼',
    heroImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=2070',
    mission: 'To transition engineers into visionary institutional leaders.',
    description: 'The strategic bridge between technical execution and business value. Designed for senior practitioners moving into CTO, VP, and Lead Architect roles.',
    outcomes: ['CTO / VP Engineering', 'Lead Architect', 'Engineering Manager', 'Institutional Strategist'],
    roadmap: [
      {
        level: 'Management',
        title: 'Engineering Management',
        description: 'Transitioning from individual contributor to high-performance lead.',
        modules: ['Team Composition Strategy', 'Agile Delivery Governance', 'Conflict Resolution in Tech'],
        vendor_alignment: ['GDA Management Cert']
      },
      {
        level: 'Strategic',
        title: 'CTO / Architectural Strategy',
        description: 'Governing the technical roadmap of the entire institution.',
        modules: ['Buy vs Build Analysis', 'Technical Debt Governance', 'Vendor Ecosystem Strategy'],
        vendor_alignment: ['Executive Leadership Cert']
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
    mission: 'Defending Africa\'s digital borders through practitioner-led vigilance.',
    description: 'Master the principles of offensive and defensive security in a cloud-native world. We focus on zero-trust architecture and proactive threat governance.',
    outcomes: ['Security Analyst', 'Penetration Tester', 'Cloud Security Lead', 'GRC Specialist'],
    roadmap: [
      {
        level: 'Foundation',
        title: 'Digital Guardrails',
        description: 'The fundamentals of encryption, identity, and access.',
        modules: ['Cryptographic Logic', 'Identity & Access Mgmt (IAM)', 'Network Security Defense'],
        vendor_alignment: ['Security+', 'AWS Security']
      },
      {
        level: 'Associate',
        title: 'Offensive Security',
        description: 'Thinking like a threat actor to build better defenses.',
        modules: ['Vulnerability Assessment', 'Web Application Pentesting', 'Social Engineering Resilience'],
        vendor_alignment: ['CEH', 'OSCP Prep']
      },
      {
        level: 'Professional',
        title: 'Institutional Defense',
        description: 'Governing the cyber-posture of a global enterprise.',
        modules: ['Zero Trust Architecture', 'Incident Response (DFIR)', 'Security Governance (GRC)'],
        vendor_alignment: ['CISSP Foundations']
      }
    ]
  },
  'digital-transformation': {
    id: 'digital-transformation',
    title: 'Digital Transformation',
    shortTitle: 'Digital Transform',
    color: '#fbbf24',
    icon: '⚡',
    heroImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2070',
    mission: 'Orchestrating the shift to cloud-native institutional performance.',
    description: 'Transform legacy business models into high-perfmormance digital engines. Focuses on change architecture, process modernization, and cloud adoption.',
    outcomes: ['Transformation Lead', 'Change Architect', 'Digital Strategist', 'Modernisation Consultant'],
    roadmap: [
      {
        level: 'Analytical',
        title: 'Change Analysis',
        description: 'Identifying technical debt and transformation opportunities.',
        modules: ['Legacy Audit Techniques', 'Cloud Readiness Assessment', 'Business Value Mapping'],
        vendor_alignment: ['GDA Strategy Cert']
      },
      {
        level: 'Architectural',
        title: 'Transition Architecture',
        description: 'Designing the roadmap from legacy to cloud-native.',
        modules: ['Microservices Migration', 'Cultural Shift Governance', 'Agile Process Design'],
        vendor_alignment: ['AWS Cloud Adoption Framework']
      }
    ]
  },
  'digital-business': {
    id: 'digital-business',
    title: 'Digital Business',
    shortTitle: 'Digital Business',
    color: '#ec4899',
    icon: '🚀',
    heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2015',
    mission: 'Building and governing the next generation of African digital ventures.',
    description: 'Master the economics of the digital world. Focuses on e-commerce, venture design, digital marketing, and data-driven business models.',
    outcomes: ['Venture Builder', 'Digital Product Manager', 'E-Commerce Operator', 'Growth Strategist'],
    roadmap: [
      {
        level: 'Foundational',
        title: 'Digital Economics',
        description: 'The laws of the digital economy and venture creation.',
        modules: ['Platform Monetization', 'Digital Marketing Logic', 'E-Commerce Fundamentals'],
        vendor_alignment: ['GDA Venture Cert']
      },
      {
        level: 'Advanced',
        title: 'Digital Venture Design',
        description: 'Engineering and scaling digital products for global markets.',
        modules: ['Product Management Core', 'Growth Hacking Techniques', 'Digital Ethics & Compliance'],
        vendor_alignment: ['Executive Business Masterclass']
      }
    ]
  }
};
