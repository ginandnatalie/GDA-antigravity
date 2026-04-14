import json

# Data extracted from docs
TRACKS = [
    {"id": "cloud", "name": "Cloud Computing", "color_theme": "blue", "description": "South Africa's Gateway to Cloud Infrastructure & Engineering."},
    {"id": "ai-ml", "name": "AI & Machine Learning", "color_theme": "purple", "description": "MLOps, Applied AI, and Strategy for the African Context."},
    {"id": "cyber", "name": "Cybersecurity", "color_theme": "amber", "description": "Defending Digital Frontiers, Governance, and Risk Management."},
    {"id": "data", "name": "Data & Analytics", "color_theme": "sky", "description": "Building the Data-Driven Enterprise with Modern Pipelines."},
    {"id": "dx", "name": "Digital Transformation", "color_theme": "emerald", "description": "Leading Change and Process Digitisation in the Modern Workspace."},
    {"id": "software", "name": "Software & DevOps", "color_theme": "rose", "description": "Full-Stack Development and Platform Engineering at Scale."},
    {"id": "business", "name": "Digital Business", "color_theme": "coral", "description": "Entrepreneurship, E-Commerce, and Digital Revenue Strategy."}
]

COURSES = [
    # Cloud Computing
    {"track_id": "cloud", "title": "Cloud Launchpad", "slug": "cloud-launchpad", "nqf_level": 4, "progression_level": "Foundation", "thumbnail_url": "🚀", "description": "The gateway to cloud computing. Linux, Networking, and AWS/Azure basics."},
    {"track_id": "cloud", "title": "Cloud Practitioner Pro", "slug": "cloud-practitioner-pro", "nqf_level": 5, "progression_level": "Associate", "thumbnail_url": "☁️", "description": "Advanced cloud service configuration, IAM, and virtualized compute."},
    {"track_id": "cloud", "title": "Cloud Architect", "slug": "cloud-architect", "nqf_level": 6, "progression_level": "Professional", "thumbnail_url": "🏗️", "description": "Designing resilient, scalable multi-region architectures and FinOps."},
    {"track_id": "cloud", "title": "Multi-Cloud Enterprise", "slug": "multi-cloud-enterprise", "nqf_level": 8, "progression_level": "Enterprise", "thumbnail_url": "🏢", "description": "Executive governance, multi-cloud strategy, and landing zone design."},
    
    # AI & ML
    {"track_id": "ai-ml", "title": "AI Fundamentals", "slug": "ai-fundamentals", "nqf_level": 4, "progression_level": "Foundation", "thumbnail_url": "🤖", "description": "Introduction to AI concepts, generative AI, and prompt engineering."},
    {"track_id": "ai-ml", "title": "ML Essentials", "slug": "ml-essentials", "nqf_level": 5, "progression_level": "Associate", "thumbnail_url": "🧬", "description": "Supervised learning, model evaluation, and Python ML toolchain."},
    {"track_id": "ai-ml", "title": "Applied AI Engineering", "slug": "applied-ai-engineering", "nqf_level": 6, "progression_level": "Professional", "thumbnail_url": "⚡", "description": "Building LLM-powered applications and MLOps pipelines."},
    {"track_id": "ai-ml", "title": "AI Strategy & Enterprise", "slug": "ai-strategy-enterprise", "nqf_level": 8, "progression_level": "Enterprise", "thumbnail_url": "🧠", "description": "Enterprise AI adoption, risk frameworks, and regulatory compliance."},

    # Cybersecurity
    {"track_id": "cyber", "title": "Cyber Essentials", "slug": "cyber-essentials", "nqf_level": 4, "progression_level": "Foundation", "thumbnail_url": "🛡️", "description": "Digital safety fundamentals, phishing awareness, and device security."},
    {"track_id": "cyber", "title": "Ethical Hacking", "slug": "ethical-hacking", "nqf_level": 5, "progression_level": "Associate", "thumbnail_url": "🕵️", "description": "Penetration testing, Scanning, Exploitation, and CompTIA S+."},
    {"track_id": "cyber", "title": "Security Operations", "slug": "security-operations", "nqf_level": 6, "progression_level": "Professional", "thumbnail_url": "🚨", "description": "SOC analyst skills, SIEM tools, and Incident Response."},
    {"track_id": "cyber", "title": "CISO Programme", "slug": "ciso-programme", "nqf_level": 8, "progression_level": "Enterprise", "thumbnail_url": "👑", "description": "Enterprise security strategy, POPIA, and ISO 27001 leadership."},

    # Data & Analytics
    {"track_id": "data", "title": "Data Literacy", "slug": "data-literacy", "nqf_level": 4, "progression_level": "Foundation", "thumbnail_url": "📊", "description": "Spreadsheets, charts, basic SQL, and data storytelling."},
    {"track_id": "data", "title": "Data Analysis & BI", "slug": "data-analysis-bi", "nqf_level": 5, "progression_level": "Associate", "thumbnail_url": "📈", "description": "Power BI dashboards, Python pandas, and descriptive statistics."},
    {"track_id": "data", "title": "Data Engineering", "slug": "data-engineering", "nqf_level": 6, "progression_level": "Professional", "thumbnail_url": "🛠️", "description": "ETL/ELT pipelines, dbt, Spark, and cloud data warehouses."},
    {"track_id": "data", "title": "AI-Driven Analytics", "slug": "ai-driven-analytics", "nqf_level": 8, "progression_level": "Enterprise", "thumbnail_url": "🔍", "description": "CDO capability, data mesh, and AI-augmented analytics strategy."},

    # Digital Transformation
    {"track_id": "dx", "title": "Digital Literacy for Work", "slug": "digital-literacy-work", "nqf_level": 4, "progression_level": "Foundation", "thumbnail_url": "💻", "description": "M365, Google Workspace, and professional digital communication."},
    {"track_id": "dx", "title": "Process Digitisation", "slug": "process-digitisation", "nqf_level": 5, "progression_level": "Associate", "thumbnail_url": "⚙️", "description": "No-code/low-code platforms, Zapier, and process mapping."},
    {"track_id": "dx", "title": "Digital Transformation Lead", "slug": "dx-lead", "nqf_level": 6, "progression_level": "Professional", "thumbnail_url": "🗺️", "description": "Leading change, CX design, and strategic DX roadmapping."},
    {"track_id": "dx", "title": "CDO Programme", "slug": "cdo-programme", "nqf_level": 8, "progression_level": "Enterprise", "thumbnail_url": "🏢", "description": "Chief Digital Officer curriculum: Innovation and KPI frameworks."},

    # Software & DevOps
    {"track_id": "software", "title": "Code Launchpad", "slug": "code-launchpad", "nqf_level": 4, "progression_level": "Foundation", "thumbnail_url": "⌨️", "description": "Web fundamentals, HTML/CSS, Python, and Git version control."},
    {"track_id": "software", "title": "Full-Stack Development", "slug": "full-stack-dev", "nqf_level": 5, "progression_level": "Associate", "thumbnail_url": "🌐", "description": "Frontend React, Backend Node.js, REST APIs, and Databases."},
    {"track_id": "software", "title": "DevOps & Cloud-Native", "slug": "devops-cloud-native", "nqf_level": 6, "progression_level": "Professional", "thumbnail_url": "📦", "description": "Docker, Kubernetes, CI/CD, and Infrastructure-as-Code."},
    {"track_id": "software", "title": "Platform Engineering", "slug": "platform-engineering", "nqf_level": 8, "progression_level": "Enterprise", "thumbnail_url": "🏗️", "description": "SRE practices, internal developer platforms, and platform strategy."},

    # Digital Business
    {"track_id": "business", "title": "Digital Entrepreneurship 101", "slug": "digital-entre entrepreneurship", "nqf_level": 4, "progression_level": "Foundation", "thumbnail_url": "💡", "description": "Lean startup, online presence, SEO, and digital branding."},
    {"track_id": "business", "title": "E-Commerce & Marketing", "slug": "ecommerce-marketing", "nqf_level": 5, "progression_level": "Associate", "thumbnail_url": "🛒", "description": "Shopify management, paid ads, and social media marketing."},
    {"track_id": "business", "title": "Digital Business Strategy", "slug": "digital-business-strategy", "nqf_level": 6, "progression_level": "Professional", "thumbnail_url": "📈", "description": "Product management, growth frameworks, and monetization models."},
    {"track_id": "business", "title": "Innovation & Ventures", "slug": "innovation-ventures", "nqf_level": 8, "progression_level": "Enterprise", "thumbnail_url": "🚀", "description": "Venture building, fundraising, and scaling across African markets."}
]

# Cloud Launchpad deep content (Module 1 as sample)
MODULES = [
    {"course_slug": "cloud-launchpad", "title": "Digital & Cloud Foundations", "order_index": 1, "description": "IaaS/PaaS/SaaS, Cloud Economics, and Career Pathways."},
    {"course_slug": "cloud-launchpad", "title": "Linux Essentials", "order_index": 2, "description": "File system, Shell, Permissions, and Bash Scripting."},
    {"course_slug": "cloud-launchpad", "title": "Networking Fundamentals", "order_index": 3, "description": "OSI model, TCP/IP, DNS, and Firewalls."},
    {"course_slug": "cloud-launchpad", "title": "Cloud Infrastructure", "order_index": 4, "description": "Compute, Storage, Databases, and IAM."},
    {"course_slug": "cloud-launchpad", "title": "Cloud Security", "order_index": 5, "description": "Shared Responsibility, Encryption, and POPIA Compliance."},
    {"course_slug": "cloud-launchpad", "title": "Capstone Project", "order_index": 6, "description": "Designing and deploying a real-world cloud solution."}
]

LESSONS = [
    # Module 1
    {"module_order": 1, "title": "What is the digital world?", "content": "Defining digital transformation in the SA context. From filing cabinets to the cloud.", "order_index": 1, "duration": "5 hours"},
    {"module_order": 1, "title": "Cloud Service Models", "content": "The Pizza Analogy: IaaS, PaaS, and SaaS explained. Shared responsibility matrix.", "order_index": 2, "duration": "5 hours"},
    {"module_order": 1, "title": "Deployment Models", "content": "Public vs Private vs Hybrid. Choosing the right region (Cape Town/Joburg).", "order_index": 3, "duration": "5 hours"},
    {"module_order": 1, "title": "Cloud Economics & Careers", "content": "CapEx vs OpEx. Using pricing calculators. Mapping your GDA pathway.", "order_index": 4, "duration": "5 hours"}
]

QUIZ_QUESTIONS = [
    {"module_order": 1, "question": "What does the acronym NIST stand for?", "options": ["National Institute of Science and Technology", "National Institute of Standards and Technology", "Network Infrastructure Solutions Tool", "National Internet Services Technology"], "answer": "National Institute of Standards and Technology"},
    {"module_order": 1, "question": "Which cloud service model gives the customer the MOST control over the OS?", "options": ["SaaS", "PaaS", "IaaS", "FaaS"], "answer": "IaaS"},
    {"module_order": 1, "question": "Microsoft 365 is best classified as:", "options": ["IaaS", "PaaS", "SaaS", "On-premises"], "answer": "SaaS"}
]

def generate_sql():
    sql = ["-- GDA Curriculum Population Script"]
    
    # 1. Tracks
    for t in TRACKS:
        slug = t['id']
        sql.append(f"INSERT INTO curriculum_tracks (name, slug, color_theme, description) VALUES ('{t['name']}', '{slug}', '{t['color_theme']}', '{t['description']}') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, color_theme = EXCLUDED.color_theme, description = EXCLUDED.description;")
    
    # 2. Courses
    for c in COURSES:
        track_slug = c['track_id']
        sql.append(f"""
INSERT INTO courses (track_id, title, slug, nqf_level, progression_level, thumbnail_url, description) 
VALUES (
    (SELECT id FROM curriculum_tracks WHERE slug = '{track_slug}'), 
    '{c['title']}', '{c['slug']}', {c['nqf_level']}, '{c['progression_level']}', '{c['thumbnail_url']}', '{c['description']}'
) 
ON CONFLICT (slug) DO UPDATE SET 
    track_id = EXCLUDED.track_id,
    title = EXCLUDED.title, 
    nqf_level = EXCLUDED.nqf_level, 
    progression_level = EXCLUDED.progression_level, 
    description = EXCLUDED.description;
        """.strip())

    # 3. Modules (for Cloud Launchpad)
    for m in MODULES:
        sql.append(f"INSERT INTO modules (course_id, title, order_index) SELECT id, '{m['title']}', {m['order_index']} FROM courses WHERE slug = '{m['course_slug']}' ON CONFLICT (course_id, order_index) DO NOTHING;")

    # 4. Lessons (for Module 1 of Cloud Launchpad)
    for l in LESSONS:
        sql.append(f"INSERT INTO lessons (module_id, title, content, order_index, duration) SELECT id, '{l['title']}', '{l['content']}', {l['order_index']}, '{l['duration']}' FROM modules WHERE order_index = {l['module_order']} AND course_id = (SELECT id FROM courses WHERE slug = 'cloud-launchpad') ON CONFLICT (module_id, order_index) DO NOTHING;")

    return "\n".join(sql)

if __name__ == "__main__":
    sql_content = generate_sql()
    output_path = "scratch/curriculum_population.sql"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(sql_content)
    print(f"SQL generated and saved to {output_path}")
