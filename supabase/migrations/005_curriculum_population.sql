-- Clear existing programs to ensure a clean 28-course matrix
TRUNCATE public.programs;

-- Track aliases for consistency with UI
-- 'Cloud Computing', 'AI & Machine Learning', 'Cybersecurity', 'Data & Analytics', 'Digital Transformation', 'Software & DevOps', 'Digital Business'

-- Level aliases: 'Foundation', 'Associate', 'Professional', 'Enterprise'

INSERT INTO public.programs (track, level, cat, title, description, duration, meta, mode, certs, price, price_sub, icon, accent, num, nqf_level)
VALUES
-- Track 1: Cloud Computing
('Cloud Computing', 'Foundation', 'foundation', 'Cloud Launchpad', 'AWS/Azure/GCP fundamentals, Linux CLI, IP networking, cloud security intro. SETA-aligned unit standards.', '12 weeks', 'Start your cloud journey', 'Online/Blended', 'GDA Foundation Cert', 'R4,500', 'Once-off', 'Cloud', '#1B4F8A', '01', 'L3-L4'),
('Cloud Computing', 'Associate', 'associate', 'Cloud Practitioner Pro', 'Identity management, virtual machines, blob/S3 storage. Prep for AWS Cloud Practitioner & AZ-900.', '12 weeks', 'Master the core services', 'Online/Blended', 'Exam Readiness', 'R6,500', 'Once-off', 'Layers', '#1B4F8A', '02', 'L5'),
('Cloud Computing', 'Professional', 'professional', 'Cloud Architect', 'Well-Architected Framework, multi-AZ design, disaster recovery, cloud cost governance.', '16 weeks', 'Design resilient systems', 'Online/Blended', 'Architect Certificate', 'R12,000', 'Once-off', 'Shield', '#1B4F8A', '03', 'L6'),
('Cloud Computing', 'Enterprise', 'enterprise', 'Multi-Cloud Enterprise', 'Enterprise cloud strategy, landing zone deployment, multi-cloud governance, FinOps practices.', '20 weeks', 'Strategic multi-cloud leadership', 'Corporate', 'Enterprise Diploma', 'R25,000', 'Once-off', 'Globe', '#1B4F8A', '04', 'L7-L8'),

-- Track 2: AI & Machine Learning
('AI & Machine Learning', 'Foundation', 'foundation', 'AI Fundamentals', 'Introduction to AI concepts, generative AI, prompt engineering, AI ethics and responsible use.', '8 weeks', 'Understand the AI revolution', 'Online', 'AI Badge', 'R3,500', 'Once-off', 'Cpu', '#2E2580', '05', 'L3-L4'),
('AI & Machine Learning', 'Associate', 'associate', 'ML Essentials', 'Supervised/unsupervised learning, feature engineering, model selection, Python ML toolchain.', '12 weeks', 'Build your first models', 'Blended', 'ML Specialist', 'R8,500', 'Once-off', 'Zap', '#2E2580', '06', 'L5'),
('AI & Machine Learning', 'Professional', 'professional', 'Applied AI Engineering', 'Building LLM-powered applications, retrieval-augmented generation, API integration, model deployment.', '16 weeks', 'Engineered AI solutions', 'Online', 'AI Engineer', 'R15,000', 'Once-off', 'Code', '#2E2580', '07', 'L6'),
('AI & Machine Learning', 'Enterprise', 'enterprise', 'AI Strategy & Enterprise', 'Enterprise AI adoption, risk frameworks, AI KPIs, regulatory compliance, bias mitigation.', '20 weeks', 'Lead AI transformation', 'Executive', 'AI Strategy Diploma', 'R30,000', 'Once-off', 'BarChart', '#2E2580', '08', 'L7-L8'),

-- Track 3: Cybersecurity
('Cybersecurity', 'Foundation', 'foundation', 'Cyber Essentials', 'Cyber threat landscape, safe browsing, password hygiene, phishing awareness, home/work security.', '8 weeks', 'Secure your digital life', 'Online', 'Cyber Awareness', 'R2,500', 'Once-off', 'Lock', '#6B1D09', '09', 'L3-L4'),
('Cybersecurity', 'Associate', 'associate', 'Ethical Hacking', 'Reconnaissance, vulnerability scanning, exploitation basics, CompTIA Security+ exam prep.', '12 weeks', 'Think like a hacker', 'Blended', 'PenTester Cert', 'R9,500', 'Once-off', 'Terminal', '#6B1D09', '10', 'L5'),
('Cybersecurity', 'Professional', 'professional', 'Security Operations', 'Security operations centre workflow, SIEM tools, log analysis, incident detection & response.', '16 weeks', 'Defend the perimeter', 'Online', 'SOC Specialist', 'R14,000', 'Once-off', 'Activity', '#6B1D09', '11', 'L6'),
('Cybersecurity', 'Enterprise', 'enterprise', 'CISO Programme', 'Enterprise security strategy, POPIA compliance, ISO 27001 implementation, board reporting.', '24 weeks', 'Strategic security governance', 'Executive', 'CISO Diploma', 'R35,000', 'Once-off', 'Award', '#6B1D09', '12', 'L7-L8'),

-- Track 4: Data & Analytics
('Data & Analytics', 'Foundation', 'foundation', 'Data Literacy', 'Reading and interpreting data, Excel/Sheets, basic SQL queries, chart design, data storytelling.', '10 weeks', 'The language of data', 'Online', 'Data Ready', 'R3,000', 'Once-off', 'Database', '#5A3200', '13', 'L3-L4'),
('Data & Analytics', 'Associate', 'associate', 'Data Analysis & BI', 'Business Intelligence dashboards, Python pandas, descriptive statistics, data visualisation.', '14 weeks', 'Uncover business insights', 'Blended', 'BI Analyst', 'R8,000', 'Once-off', 'PieChart', '#5A3200', '14', 'L5'),
('Data & Analytics', 'Professional', 'professional', 'Data Engineering', 'Building ETL/ELT pipelines, dbt transformations, Apache Spark, Snowflake/BigQuery.', '18 weeks', 'Build robust data pipelines', 'Online', 'Data Engineer', 'R16,000', 'Once-off', 'Settings', '#5A3200', '15', 'L6'),
('Data & Analytics', 'Enterprise', 'enterprise', 'AI-Driven Analytics', 'Chief Data Officer capability, data mesh architecture, AI-augmented analytics, data governance strategy.', '22 weeks', 'Data-driven leadership', 'Executive', 'Data Strategy Cert', 'R28,000', 'Once-off', 'TrendingUp', '#5A3200', '16', 'L7-L8'),

-- Track 5: Digital Transformation
('Digital Transformation', 'Foundation', 'foundation', 'Digital Literacy for Work', 'Essential workplace digital tools, Microsoft 365, Google Workspace, digital communication, remote work.', '8 weeks', 'Modern workplace ready', 'Online', 'Workplace Cert', 'R1,500', 'Once-off', 'Compass', '#044535', '17', 'L3-L4'),
('Digital Transformation', 'Associate', 'associate', 'Process Digitisation', 'Power Automate, Zapier, process mapping, low-code platforms, business process management.', '12 weeks', 'Automate the mundane', 'Online', 'Automation Cert', 'R5,500', 'Once-off', 'Repeat', '#044535', '18', 'L5'),
('Digital Transformation', 'Professional', 'professional', 'Digital Transformation Lead', 'Leading digital change, customer experience design, digital roadmap planning, stakeholder management.', '16 weeks', 'Lead the change', 'Blended', 'DX Lead Cert', 'R12,500', 'Once-off', 'Users', '#044535', '19', 'L6'),
('Digital Transformation', 'Enterprise', 'enterprise', 'CDO Programme', 'Chief Digital Officer curriculum: digital strategy, innovation management, digital KPI frameworks.', '24 weeks', 'C-suite digital strategy', 'Executive', 'CDO Diploma', 'R40,000', 'Once-off', 'Briefcase', '#044535', '20', 'L7-L8'),

-- Track 6: Software & DevOps
('Software & DevOps', 'Foundation', 'foundation', 'Code Launchpad', 'Web fundamentals, HTML5/CSS3, intro Python, version control with Git, first web project.', '12 weeks', 'Start coding today', 'Blended', 'Web Builder', 'R4,000', 'Once-off', 'Code', '#1A3D07', '21', 'L3-L4'),
('Software & DevOps', 'Associate', 'associate', 'Full-Stack Development', 'Frontend React, backend Node.js/Express, REST APIs, PostgreSQL, full-stack project delivery.', '16 weeks', 'The complete developer', 'Blended', 'Full-Stack Cert', 'R10,500', 'Once-off', 'Cpu', '#1A3D07', '22', 'L5'),
('Software & DevOps', 'Professional', 'professional', 'DevOps & Cloud-Native', 'Containerisation, Kubernetes orchestration, GitHub Actions CI/CD, infrastructure-as-code.', '18 weeks', 'Modern release engineering', 'Online', 'DevOps Specialist', 'R18,000', 'Once-off', 'Layers', '#1A3D07', '23', 'L6'),
('Software & DevOps', 'Enterprise', 'enterprise', 'Platform Engineering', 'Site reliability engineering, internal developer platforms, cloud cost governance, platform strategy.', '24 weeks', 'Engineering at scale', 'Executive', 'Platform Diploma', 'R32,000', 'Once-off', 'Settings', '#1A3D07', '24', 'L7-L8'),

-- Track 7: Digital Business
('Digital Business', 'Foundation', 'foundation', 'Digital Entrepreneurship 101', 'Lean startup concepts, building an online presence, SEO basics, social media strategy, digital branding.', '8 weeks', 'Launch your digital idea', 'Online', 'Founder Badge', 'R2,500', 'Once-off', 'Rocket', '#4A1528', '25', 'L3-L4'),
('Digital Business', 'Associate', 'associate', 'E-Commerce & Marketing', 'E-commerce store setup, paid advertising, social media marketing, Google Analytics, conversion optimisation.', '12 weeks', 'Grow your online sales', 'Blended', 'Growth Hacker', 'R7,000', 'Once-off', 'ShoppingBag', '#4A1528', '26', 'L5'),
('Digital Business', 'Professional', 'professional', 'Digital Business Strategy', 'Product management principles, growth frameworks, monetisation models, digital venture strategy.', '16 weeks', 'Strategic product growth', 'Online', 'Business Strategist', 'R15,000', 'Once-off', 'Key', '#4A1528', '27', 'L6'),
('Digital Business', 'Enterprise', 'enterprise', 'Innovation & Ventures', 'Venture building, investor readiness, pan-African market entry, scaling digital businesses across Africa.', '24 weeks', 'Scale across Africa', 'Executive', 'Venture Diploma', 'R45,000', 'Once-off', 'Star', '#4A1528', '28', 'L7-L8');
