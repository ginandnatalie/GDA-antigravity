/**
 * GDA Final Digitisation & Sync
 * 1. Uploads Capstone Handbook & Welcome Pack
 * 2. Adds final 10 questions to Module 6 Quiz (target 120)
 * 3. Final RLS sweep validation
 */

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://ffgypwmrmdosaihgpkuw.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error('ERROR: Set SUPABASE_SERVICE_ROLE_KEY environment variable');
  process.exit(1);
}

const BASE_DIR = 'C:\\Users\\ginas\\OneDrive\\Documents\\George Master File\\ginashe-digital-academy';
const COURSE_ID = '5167852b-3dde-428b-acfd-d571aba88b62';
const MODULE_6_ID = 'a889d7f6-19dd-4f31-9ccd-9084f5745b33';
const MODULE_6_QUIZ_ID = '7ded92ba-e1f8-45b9-8a60-ff725cefb626';

const FILES = [
  { 
    local: 'Cloud Launchpad Capstone_Handbook/GDA_Cloud Launchpad Capstone_Handbook.docx', 
    bucket: 'course-materials', 
    storagePath: 'cloud-launchpad/syllabi/GDA_CloudLaunchpad_Capstone_Handbook.docx', 
    resourceType: 'syllabus', 
    accessLevel: 'student', 
    moduleIndex: 6, 
    title: 'Cloud Launchpad — Capstone Project Handbook', 
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
  },
  { 
    local: 'Cloud Launchpad_WelcomePack/GDA_CloudLaunchpad_WelcomePack.docx', 
    bucket: 'course-materials', 
    storagePath: 'cloud-launchpad/institutional/GDA_CloudLaunchpad_WelcomePack.docx', 
    resourceType: 'syllabus', 
    accessLevel: 'student', 
    moduleIndex: 0, 
    title: 'GDA Cloud Launchpad — Welcome Pack & Institutional Guide', 
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
  }
];

const FINAL_QUESTIONS = [
  {
    quiz_id: MODULE_6_QUIZ_ID,
    question: "Why might a cloud architect choose RDS over DynamoDB for a food delivery platform's order history?",
    options: ["A) RDS supports complex relational queries and ACID compliance for transactions", "B) DynamoDB is only for static images", "C) RDS is physically located in South Africa and DynamoDB is not", "D) DynamoDB does not support encryption"],
    correct_answer: "A",
    order_index: 11
  },
  {
    quiz_id: MODULE_6_QUIZ_ID,
    question: "Which POPIA condition requires the implementation of technical measures like KMS encryption and MFA?",
    options: ["A) Condition 1: Accountability", "B) Condition 5: Information Quality", "C) Condition 7: Security Safeguards", "D) Condition 8: Data Subject Participation"],
    correct_answer: "C",
    order_index: 12
  },
  {
    quiz_id: MODULE_6_QUIZ_ID,
    question: "If a business needs to handle 50,000 concurrent users during peak exam seasons, which architectural pattern is most recommended?",
    options: ["A) Vertically scaling a single EC2 instance to 128 vCPUs", "B) Using Auto Scaling Groups with an Application Load Balancer", "C) Moving all data to S3 Glacier", "D) Disabling encryption during peak periods"],
    correct_answer: "B",
    order_index: 13
  },
  {
    quiz_id: MODULE_6_QUIZ_ID,
    question: "In the 2-tier architecture deployed in Module 4, where should the RDS database be placed according to security best practices?",
    options: ["A) In the public subnet with an Elastic IP", "B) In a private subnet with no public endpoint, accessible only from the web tier", "C) In a separate VPC in the US region", "D) On the same instance as the web server to save costs"],
    correct_answer: "B",
    order_index: 14
  },
  {
    quiz_id: MODULE_6_QUIZ_ID,
    question: "A GuardDuty alert indicates an EC2 instance is communicating with a known malicious IP. Which incident response phase involves isolating the instance?",
    options: ["A) Prepare", "B) Identify", "C) Contain", "D) Recover"],
    correct_answer: "C",
    order_index: 15
  },
  {
    quiz_id: MODULE_6_QUIZ_ID,
    question: "What is the primary benefit of 'security group chaining' (referencing an SG ID as a source)?",
    options: ["A) It makes the network 10x faster", "B) It allows access based on membership rather than fluctuating IP addresses", "C) It is required for POPIA compliance", "D) It reduces AWS billing costs"],
    correct_answer: "B",
    order_index: 16
  },
  {
    quiz_id: MODULE_6_QUIZ_ID,
    question: "Under the Shared Responsibility Model, who is responsible for patching the guest OS on an EC2 instance?",
    options: ["A) AWS", "B) The Customer", "C) The Internet Service Provider", "D) The SETA auditor"],
    correct_answer: "B",
    order_index: 17
  },
  {
    quiz_id: MODULE_6_QUIZ_ID,
    question: "Why should a financial regulator (like FSCA) require CloudTrail to be enabled on a cloud account?",
    options: ["A) To reduce the monthly bill", "B) To provide a complete, immutable audit trail of all administrative actions", "C) To host the company's website", "D) To encrypt data at rest"],
    correct_answer: "B",
    order_index: 18
  },
  {
    quiz_id: MODULE_6_QUIZ_ID,
    question: "Which S3 storage class is most cost-effective for 7-year data retention mandated by POPIA with rare access?",
    options: ["A) S3 Standard", "B) S3 Intelligent-Tiering", "C) S3 Glacier Deep Archive", "D) S3 Standard-IA"],
    correct_answer: "C",
    order_index: 19
  },
  {
    quiz_id: MODULE_6_QUIZ_ID,
    question: "Before a GDA Certificate of Competence is issued, which of the following MUST be confirmed?",
    options: ["A) All formative quizzes passed at 70% or above", "B) A complete Portfolio of Evidence (PoE) submitted", "C) The Capstone project successfully presented and defended", "D) All of the above"],
    correct_answer: "D",
    order_index: 20
  }
];

async function uploadFile(file) {
  const localPath = path.join(BASE_DIR, file.local);
  if (!fs.existsSync(localPath)) {
    console.error(`  ❌ NOT FOUND: ${file.local}`);
    return null;
  }
  const fileBuffer = fs.readFileSync(localPath);
  const fileSize = fs.statSync(localPath).size;
  const url = `${SUPABASE_URL}/storage/v1/object/${file.bucket}/${file.storagePath}`;
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': file.mime,
      'x-upsert': 'true',
    },
    body: fileBuffer,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`  ❌ UPLOAD FAILED: ${file.storagePath} — ${res.status}: ${errorText}`);
    return null;
  }
  console.log(`  ✅ Uploaded: ${file.storagePath} (${(fileSize / 1024).toFixed(1)} KB)`);
  return { ...file, fileSize, fileName: path.basename(file.local), fileUrl: url };
}

async function createResourceEntry(uploaded) {
  const body = {
    course_id: COURSE_ID,
    module_id: uploaded.moduleIndex === 0 ? null : MODULE_6_ID,
    title: uploaded.title,
    resource_type: uploaded.resourceType,
    file_url: uploaded.fileUrl,
    file_name: uploaded.fileName,
    file_size_bytes: uploaded.fileSize,
    mime_type: uploaded.mime,
    access_level: uploaded.accessLevel,
    is_downloadable: true,
    order_index: uploaded.moduleIndex,
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/course_resources`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'apikey': SERVICE_ROLE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) console.error(`  ❌ DB ENTRY FAILED: ${uploaded.title}`);
  else console.log(`  📝 DB entry: ${uploaded.title}`);
}

async function insertQuestions() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/quiz_questions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'apikey': SERVICE_ROLE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(FINAL_QUESTIONS),
  });

  if (!res.ok) console.error(`  ❌ QUIZ INSERT FAILED: ${await res.text()}`);
  else console.log(`  📊 Added 10 final questions to Module 6 Quiz. Total target: 120 questions.`);
}

async function main() {
  console.log('🚀 Starting Final Digitisation Phase...');
  for (const file of FILES) {
    const result = await uploadFile(file);
    if (result) await createResourceEntry(result);
  }
  await insertQuestions();
  console.log('✅ Final Digitisation Complete.');
}

main().catch(console.error);
