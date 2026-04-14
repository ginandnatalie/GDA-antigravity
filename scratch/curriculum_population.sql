-- GDA Curriculum Population Script
INSERT INTO curriculum_tracks (name, slug, color_theme, description) VALUES ('Cloud Computing', 'cloud', 'blue', 'South Africa's Gateway to Cloud Infrastructure & Engineering.') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, color_theme = EXCLUDED.color_theme, description = EXCLUDED.description;
INSERT INTO curriculum_tracks (name, slug, color_theme, description) VALUES ('AI & Machine Learning', 'ai-ml', 'purple', 'MLOps, Applied AI, and Strategy for the African Context.') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, color_theme = EXCLUDED.color_theme, description = EXCLUDED.description;
INSERT INTO curriculum_tracks (name, slug, color_theme, description) VALUES ('Cybersecurity', 'cyber', 'amber', 'Defending Digital Frontiers, Governance, and Risk Management.') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, color_theme = EXCLUDED.color_theme, description = EXCLUDED.description;
INSERT INTO curriculum_tracks (name, slug, color_theme, description) VALUES ('Data & Analytics', 'data', 'sky', 'Building the Data-Driven Enterprise with Modern Pipelines.') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, color_theme = EXCLUDED.color_theme, description = EXCLUDED.description;
INSERT INTO curriculum_tracks (name, slug, color_theme, description) VALUES ('Digital Transformation', 'dx', 'emerald', 'Leading Change and Process Digitisation in the Modern Workspace.') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, color_theme = EXCLUDED.color_theme, description = EXCLUDED.description;
INSERT INTO curriculum_tracks (name, slug, color_theme, description) VALUES ('Software & DevOps', 'software', 'rose', 'Full-Stack Development and Platform Engineering at Scale.') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, color_theme = EXCLUDED.color_theme, description = EXCLUDED.description;
INSERT INTO curriculum_tracks (name, slug, color_theme, description) VALUES ('Digital Business', 'business', 'coral', 'Entrepreneurship, E-Commerce, and Digital Revenue Strategy.') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, color_theme = EXCLUDED.color_theme, description = EXCLUDED.description;
INSERT INTO courses (track_id, title, slug, nqf_level, progression_level, thumbnail_url, description) 
VALUES (
    (SELECT id FROM curriculum_tracks WHERE slug = 'cloud'), 
    'Cloud Launchpad', 'cloud-launchpad', 4, 'Foundation', '🚀', 'The gateway to cloud computing. Linux, Networking, and AWS/Azure basics.'
) 
ON CONFLICT (slug) DO UPDATE SET 
    track_id = EXCLUDED.track_id,
    title = EXCLUDED.title, 
    nqf_level = EXCLUDED.nqf_level, 
    progression_level = EXCLUDED.progression_level, 
    description = EXCLUDED.description;
INSERT INTO courses (track_id, title, slug, nqf_level, progression_level, thumbnail_url, description) 
VALUES (
    (SELECT id FROM curriculum_tracks WHERE slug = 'cloud'), 
    'Cloud Practitioner Pro', 'cloud-practitioner-pro', 5, 'Associate', '☁️', 'Advanced cloud service configuration, IAM, and virtualized compute.'
) 
ON CONFLICT (slug) DO UPDATE SET 
    track_id = EXCLUDED.track_id,
    title = EXCLUDED.title, 
    nqf_level = EXCLUDED.nqf_level, 
    progression_level = EXCLUDED.progression_level, 
    description = EXCLUDED.description;
INSERT INTO courses (track_id, title, slug, nqf_level, progression_level, thumbnail_url, description) 
VALUES (
    (SELECT id FROM curriculum_tracks WHERE slug = 'cloud'), 
    'Cloud Architect', 'cloud-architect', 6, 'Professional', '🏗️', 'Designing resilient, scalable multi-region architectures and FinOps.'
) 
ON CONFLICT (slug) DO UPDATE SET 
    track_id = EXCLUDED.track_id,
    title = EXCLUDED.title, 
    nqf_level = EXCLUDED.nqf_level, 
    progression_level = EXCLUDED.progression_level, 
    description = EXCLUDED.description;
INSERT INTO courses (track_id, title, slug, nqf_level, progression_level, thumbnail_url, description) 
VALUES (
    (SELECT id FROM curriculum_tracks WHERE slug = 'cloud'), 
    'Multi-Cloud Enterprise', 'multi-cloud-enterprise', 8, 'Enterprise', '🏢', 'Executive governance, multi-cloud strategy, and landing zone design.'
) 
ON CONFLICT (slug) DO UPDATE SET 
    track_id = EXCLUDED.track_id,
    title = EXCLUDED.title, 
    nqf_level = EXCLUDED.nqf_level, 
    progression_level = EXCLUDED.progression_level, 
    description = EXCLUDED.description;
INSERT INTO courses (track_id, title, slug, nqf_level, progression_level, thumbnail_url, description) 
VALUES (
    (SELECT id FROM curriculum_tracks WHERE slug = 'ai-ml'), 
    'AI Fundamentals', 'ai-fundamentals', 4, 'Foundation', '🤖', 'Introduction to AI concepts, generative AI, and prompt engineering.'
) 
ON CONFLICT (slug) DO UPDATE SET 
    track_id = EXCLUDED.track_id,
    title = EXCLUDED.title, 
    nqf_level = EXCLUDED.nqf_level, 
    progression_level = EXCLUDED.progression_level, 
    description = EXCLUDED.description;
INSERT INTO courses (track_id, title, slug, nqf_level, progression_level, thumbnail_url, description) 
VALUES (
    (SELECT id FROM curriculum_tracks WHERE slug = 'ai-ml'), 
    'ML Essentials', 'ml-essentials', 5, 'Associate', '🧬', 'Supervised learning, model evaluation, and Python ML toolchain.'
) 
ON CONFLICT (slug) DO UPDATE SET 
    track_id = EXCLUDED.track_id,
    title = EXCLUDED.title, 
    nqf_level = EXCLUDED.nqf_level, 
    progression_level = EXCLUDED.progression_level, 
    description = EXCLUDED.description;
INSERT INTO courses (track_id, title, slug, nqf_level, progression_level, thumbnail_url, description) 
VALUES (
    (SELECT id FROM curriculum_tracks WHERE slug = 'ai-ml'), 
    'Applied AI Engineering', 'applied-ai-engineering', 6, 'Professional', '⚡', 'Building LLM-powered applications and MLOps pipelines.'
) 
ON CONFLICT (slug) DO UPDATE SET 
    track_id = EXCLUDED.track_id,
    title = EXCLUDED.title, 
    nqf_level = EXCLUDED.nqf_level, 
    progression_level = EXCLUDED.progression_level, 
    description = EXCLUDED.description;
INSERT INTO courses (track_id, title, slug, nqf_level, progression_level, thumbnail_url, description) 
VALUES (
    (SELECT id FROM curriculum_tracks WHERE slug = 'ai-ml'), 
    'AI Strategy & Enterprise', 'ai-strategy-enterprise', 8, 'Enterprise', '🧠', 'Enterprise AI adoption, risk frameworks, and regulatory compliance.'
) 
ON CONFLICT (slug) DO UPDATE SET 
    track_id = EXCLUDED.track_id,
    title = EXCLUDED.title, 
    nqf_level = EXCLUDED.nqf_level, 
    progression_level = EXCLUDED.progression_level, 
    description = EXCLUDED.description;
INSERT INTO courses (track_id, title, slug, nqf_level, progression_level, thumbnail_url, description) 
VALUES (
    (SELECT id FROM curriculum_tracks WHERE slug = 'cyber'), 
    'Cyber Essentials', 'cyber-essentials', 4, 'Foundation', '🛡️', 'Digital safety fundamentals, phishing awareness, and device security.'
) 
ON CONFLICT (slug) DO UPDATE SET 
    track_id = EXCLUDED.track_id,
    title = EXCLUDED.title, 
    nqf_level = EXCLUDED.nqf_level, 
    progression_level = EXCLUDED.progression_level, 
    description = EXCLUDED.description;
INSERT INTO courses (track_id, title, slug, nqf_level, progression_level, thumbnail_url, description) 
VALUES (
    (SELECT id FROM curriculum_tracks WHERE slug = 'cyber'), 
    'Ethical Hacking', 'ethical-hacking', 5, 'Associate', '🕵️', 'Penetration testing, Scanning, Exploitation, and CompTIA S+.'
) 
ON CONFLICT (slug) DO UPDATE SET 
    track_id = EXCLUDED.track_id,
    title = EXCLUDED.title, 
    nqf_level = EXCLUDED.nqf_level, 
    progression_level = EXCLUDED.progression_level, 
    description = EXCLUDED.description;
INSERT INTO courses (track_id, title, slug, nqf_level, progression_level, thumbnail_url, description) 
VALUES (
    (SELECT id FROM curriculum_tracks WHERE slug = 'cyber'), 
    'Security Operations', 'security-operations', 6, 'Professional', '🚨', 'SOC analyst skills, SIEM tools, and Incident Response.'
) 
ON CONFLICT (slug) DO UPDATE SET 
    track_id = EXCLUDED.track_id,
    title = EXCLUDED.title, 
    nqf_level = EXCLUDED.nqf_level, 
    progression_level = EXCLUDED.progression_level, 
    description = EXCLUDED.description;
INSERT INTO courses (track_id, title, slug, nqf_level, progression_level, thumbnail_url, description) 
VALUES (
    (SELECT id FROM curriculum_tracks WHERE slug = 'cyber'), 
    'CISO Programme', 'ciso-programme', 8, 'Enterprise', '👑', 'Enterprise security strategy, POPIA, and ISO 27001 leadership.'
) 
ON CONFLICT (slug) DO UPDATE SET 
    track_id = EXCLUDED.track_id,
    title = EXCLUDED.title, 
    nqf_level = EXCLUDED.nqf_level, 
    progression_level = EXCLUDED.progression_level, 
    description = EXCLUDED.description;
INSERT INTO courses (track_id, title, slug, nqf_level, progression_level, thumbnail_url, description) 
VALUES (
    (SELECT id FROM curriculum_tracks WHERE slug = 'data'), 
    'Data Literacy', 'data-literacy', 4, 'Foundation', '📊', 'Spreadsheets, charts, basic SQL, and data storytelling.'
) 
ON CONFLICT (slug) DO UPDATE SET 
    track_id = EXCLUDED.track_id,
    title = EXCLUDED.title, 
    nqf_level = EXCLUDED.nqf_level, 
    progression_level = EXCLUDED.progression_level, 
    description = EXCLUDED.description;
INSERT INTO courses (track_id, title, slug, nqf_level, progression_level, thumbnail_url, description) 
VALUES (
    (SELECT id FROM curriculum_tracks WHERE slug = 'data'), 
    'Data Analysis & BI', 'data-analysis-bi', 5, 'Associate', '📈', 'Power BI dashboards, Python pandas, and descriptive statistics.'
) 
ON CONFLICT (slug) DO UPDATE SET 
    track_id = EXCLUDED.track_id,
    title = EXCLUDED.title, 
    nqf_level = EXCLUDED.nqf_level, 
    progression_level = EXCLUDED.progression_level, 
    description = EXCLUDED.description;
INSERT INTO courses (track_id, title, slug, nqf_level, progression_level, thumbnail_url, description) 
VALUES (
    (SELECT id FROM curriculum_tracks WHERE slug = 'data'), 
    'Data Engineering', 'data-engineering', 6, 'Professional', '🛠️', 'ETL/ELT pipelines, dbt, Spark, and cloud data warehouses.'
) 
ON CONFLICT (slug) DO UPDATE SET 
    track_id = EXCLUDED.track_id,
    title = EXCLUDED.title, 
    nqf_level = EXCLUDED.nqf_level, 
    progression_level = EXCLUDED.progression_level, 
    description = EXCLUDED.description;
INSERT INTO courses (track_id, title, slug, nqf_level, progression_level, thumbnail_url, description) 
VALUES (
    (SELECT id FROM curriculum_tracks WHERE slug = 'data'), 
    'AI-Driven Analytics', 'ai-driven-analytics', 8, 'Enterprise', '🔍', 'CDO capability, data mesh, and AI-augmented analytics strategy.'
) 
ON CONFLICT (slug) DO UPDATE SET 
    track_id = EXCLUDED.track_id,
    title = EXCLUDED.title, 
    nqf_level = EXCLUDED.nqf_level, 
    progression_level = EXCLUDED.progression_level, 
    description = EXCLUDED.description;
INSERT INTO courses (track_id, title, slug, nqf_level, progression_level, thumbnail_url, description) 
VALUES (
    (SELECT id FROM curriculum_tracks WHERE slug = 'dx'), 
    'Digital Literacy for Work', 'digital-literacy-work', 4, 'Foundation', '💻', 'M365, Google Workspace, and professional digital communication.'
) 
ON CONFLICT (slug) DO UPDATE SET 
    track_id = EXCLUDED.track_id,
    title = EXCLUDED.title, 
    nqf_level = EXCLUDED.nqf_level, 
    progression_level = EXCLUDED.progression_level, 
    description = EXCLUDED.description;
INSERT INTO courses (track_id, title, slug, nqf_level, progression_level, thumbnail_url, description) 
VALUES (
    (SELECT id FROM curriculum_tracks WHERE slug = 'dx'), 
    'Process Digitisation', 'process-digitisation', 5, 'Associate', '⚙️', 'No-code/low-code platforms, Zapier, and process mapping.'
) 
ON CONFLICT (slug) DO UPDATE SET 
    track_id = EXCLUDED.track_id,
    title = EXCLUDED.title, 
    nqf_level = EXCLUDED.nqf_level, 
    progression_level = EXCLUDED.progression_level, 
    description = EXCLUDED.description;
INSERT INTO courses (track_id, title, slug, nqf_level, progression_level, thumbnail_url, description) 
VALUES (
    (SELECT id FROM curriculum_tracks WHERE slug = 'dx'), 
    'Digital Transformation Lead', 'dx-lead', 6, 'Professional', '🗺️', 'Leading change, CX design, and strategic DX roadmapping.'
) 
ON CONFLICT (slug) DO UPDATE SET 
    track_id = EXCLUDED.track_id,
    title = EXCLUDED.title, 
    nqf_level = EXCLUDED.nqf_level, 
    progression_level = EXCLUDED.progression_level, 
    description = EXCLUDED.description;
INSERT INTO courses (track_id, title, slug, nqf_level, progression_level, thumbnail_url, description) 
VALUES (
    (SELECT id FROM curriculum_tracks WHERE slug = 'dx'), 
    'CDO Programme', 'cdo-programme', 8, 'Enterprise', '🏢', 'Chief Digital Officer curriculum: Innovation and KPI frameworks.'
) 
ON CONFLICT (slug) DO UPDATE SET 
    track_id = EXCLUDED.track_id,
    title = EXCLUDED.title, 
    nqf_level = EXCLUDED.nqf_level, 
    progression_level = EXCLUDED.progression_level, 
    description = EXCLUDED.description;
INSERT INTO courses (track_id, title, slug, nqf_level, progression_level, thumbnail_url, description) 
VALUES (
    (SELECT id FROM curriculum_tracks WHERE slug = 'software'), 
    'Code Launchpad', 'code-launchpad', 4, 'Foundation', '⌨️', 'Web fundamentals, HTML/CSS, Python, and Git version control.'
) 
ON CONFLICT (slug) DO UPDATE SET 
    track_id = EXCLUDED.track_id,
    title = EXCLUDED.title, 
    nqf_level = EXCLUDED.nqf_level, 
    progression_level = EXCLUDED.progression_level, 
    description = EXCLUDED.description;
INSERT INTO courses (track_id, title, slug, nqf_level, progression_level, thumbnail_url, description) 
VALUES (
    (SELECT id FROM curriculum_tracks WHERE slug = 'software'), 
    'Full-Stack Development', 'full-stack-dev', 5, 'Associate', '🌐', 'Frontend React, Backend Node.js, REST APIs, and Databases.'
) 
ON CONFLICT (slug) DO UPDATE SET 
    track_id = EXCLUDED.track_id,
    title = EXCLUDED.title, 
    nqf_level = EXCLUDED.nqf_level, 
    progression_level = EXCLUDED.progression_level, 
    description = EXCLUDED.description;
INSERT INTO courses (track_id, title, slug, nqf_level, progression_level, thumbnail_url, description) 
VALUES (
    (SELECT id FROM curriculum_tracks WHERE slug = 'software'), 
    'DevOps & Cloud-Native', 'devops-cloud-native', 6, 'Professional', '📦', 'Docker, Kubernetes, CI/CD, and Infrastructure-as-Code.'
) 
ON CONFLICT (slug) DO UPDATE SET 
    track_id = EXCLUDED.track_id,
    title = EXCLUDED.title, 
    nqf_level = EXCLUDED.nqf_level, 
    progression_level = EXCLUDED.progression_level, 
    description = EXCLUDED.description;
INSERT INTO courses (track_id, title, slug, nqf_level, progression_level, thumbnail_url, description) 
VALUES (
    (SELECT id FROM curriculum_tracks WHERE slug = 'software'), 
    'Platform Engineering', 'platform-engineering', 8, 'Enterprise', '🏗️', 'SRE practices, internal developer platforms, and platform strategy.'
) 
ON CONFLICT (slug) DO UPDATE SET 
    track_id = EXCLUDED.track_id,
    title = EXCLUDED.title, 
    nqf_level = EXCLUDED.nqf_level, 
    progression_level = EXCLUDED.progression_level, 
    description = EXCLUDED.description;
INSERT INTO courses (track_id, title, slug, nqf_level, progression_level, thumbnail_url, description) 
VALUES (
    (SELECT id FROM curriculum_tracks WHERE slug = 'business'), 
    'Digital Entrepreneurship 101', 'digital-entre entrepreneurship', 4, 'Foundation', '💡', 'Lean startup, online presence, SEO, and digital branding.'
) 
ON CONFLICT (slug) DO UPDATE SET 
    track_id = EXCLUDED.track_id,
    title = EXCLUDED.title, 
    nqf_level = EXCLUDED.nqf_level, 
    progression_level = EXCLUDED.progression_level, 
    description = EXCLUDED.description;
INSERT INTO courses (track_id, title, slug, nqf_level, progression_level, thumbnail_url, description) 
VALUES (
    (SELECT id FROM curriculum_tracks WHERE slug = 'business'), 
    'E-Commerce & Marketing', 'ecommerce-marketing', 5, 'Associate', '🛒', 'Shopify management, paid ads, and social media marketing.'
) 
ON CONFLICT (slug) DO UPDATE SET 
    track_id = EXCLUDED.track_id,
    title = EXCLUDED.title, 
    nqf_level = EXCLUDED.nqf_level, 
    progression_level = EXCLUDED.progression_level, 
    description = EXCLUDED.description;
INSERT INTO courses (track_id, title, slug, nqf_level, progression_level, thumbnail_url, description) 
VALUES (
    (SELECT id FROM curriculum_tracks WHERE slug = 'business'), 
    'Digital Business Strategy', 'digital-business-strategy', 6, 'Professional', '📈', 'Product management, growth frameworks, and monetization models.'
) 
ON CONFLICT (slug) DO UPDATE SET 
    track_id = EXCLUDED.track_id,
    title = EXCLUDED.title, 
    nqf_level = EXCLUDED.nqf_level, 
    progression_level = EXCLUDED.progression_level, 
    description = EXCLUDED.description;
INSERT INTO courses (track_id, title, slug, nqf_level, progression_level, thumbnail_url, description) 
VALUES (
    (SELECT id FROM curriculum_tracks WHERE slug = 'business'), 
    'Innovation & Ventures', 'innovation-ventures', 8, 'Enterprise', '🚀', 'Venture building, fundraising, and scaling across African markets.'
) 
ON CONFLICT (slug) DO UPDATE SET 
    track_id = EXCLUDED.track_id,
    title = EXCLUDED.title, 
    nqf_level = EXCLUDED.nqf_level, 
    progression_level = EXCLUDED.progression_level, 
    description = EXCLUDED.description;
INSERT INTO modules (course_id, title, order_index) SELECT id, 'Digital & Cloud Foundations', 1 FROM courses WHERE slug = 'cloud-launchpad' ON CONFLICT (course_id, order_index) DO NOTHING;
INSERT INTO modules (course_id, title, order_index) SELECT id, 'Linux Essentials', 2 FROM courses WHERE slug = 'cloud-launchpad' ON CONFLICT (course_id, order_index) DO NOTHING;
INSERT INTO modules (course_id, title, order_index) SELECT id, 'Networking Fundamentals', 3 FROM courses WHERE slug = 'cloud-launchpad' ON CONFLICT (course_id, order_index) DO NOTHING;
INSERT INTO modules (course_id, title, order_index) SELECT id, 'Cloud Infrastructure', 4 FROM courses WHERE slug = 'cloud-launchpad' ON CONFLICT (course_id, order_index) DO NOTHING;
INSERT INTO modules (course_id, title, order_index) SELECT id, 'Cloud Security', 5 FROM courses WHERE slug = 'cloud-launchpad' ON CONFLICT (course_id, order_index) DO NOTHING;
INSERT INTO modules (course_id, title, order_index) SELECT id, 'Capstone Project', 6 FROM courses WHERE slug = 'cloud-launchpad' ON CONFLICT (course_id, order_index) DO NOTHING;
INSERT INTO lessons (module_id, title, content, order_index, duration) SELECT id, 'What is the digital world?', 'Defining digital transformation in the SA context. From filing cabinets to the cloud.', 1, '5 hours' FROM modules WHERE order_index = 1 AND course_id = (SELECT id FROM courses WHERE slug = 'cloud-launchpad') ON CONFLICT (module_id, order_index) DO NOTHING;
INSERT INTO lessons (module_id, title, content, order_index, duration) SELECT id, 'Cloud Service Models', 'The Pizza Analogy: IaaS, PaaS, and SaaS explained. Shared responsibility matrix.', 2, '5 hours' FROM modules WHERE order_index = 1 AND course_id = (SELECT id FROM courses WHERE slug = 'cloud-launchpad') ON CONFLICT (module_id, order_index) DO NOTHING;
INSERT INTO lessons (module_id, title, content, order_index, duration) SELECT id, 'Deployment Models', 'Public vs Private vs Hybrid. Choosing the right region (Cape Town/Joburg).', 3, '5 hours' FROM modules WHERE order_index = 1 AND course_id = (SELECT id FROM courses WHERE slug = 'cloud-launchpad') ON CONFLICT (module_id, order_index) DO NOTHING;
INSERT INTO lessons (module_id, title, content, order_index, duration) SELECT id, 'Cloud Economics & Careers', 'CapEx vs OpEx. Using pricing calculators. Mapping your GDA pathway.', 4, '5 hours' FROM modules WHERE order_index = 1 AND course_id = (SELECT id FROM courses WHERE slug = 'cloud-launchpad') ON CONFLICT (module_id, order_index) DO NOTHING;