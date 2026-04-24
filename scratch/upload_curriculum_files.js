/**
 * GDA Curriculum File Upload Script
 * Uploads all curriculum files to Supabase Storage and creates course_resources entries
 */

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://ffgypwmrmdosaihgpkuw.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error('ERROR: Set SUPABASE_SERVICE_ROLE_KEY environment variable');
  process.exit(1);
}

const BASE_DIR = path.resolve(__dirname, '..');

// File manifest: what to upload and where
const FILES = [
  // === SLIDES (student access) ===
  { local: 'Cloud LaunchPad slides/GDA_Module1_Slides.pptx', bucket: 'course-materials', storagePath: 'cloud-launchpad/slides/GDA_Module1_Slides.pptx', resourceType: 'slides', accessLevel: 'student', moduleIndex: 1, title: 'Module 1 Teaching Slides — Digital & Cloud Foundations', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
  { local: 'Cloud LaunchPad slides/GDA_Module2_Slides.pptx', bucket: 'course-materials', storagePath: 'cloud-launchpad/slides/GDA_Module2_Slides.pptx', resourceType: 'slides', accessLevel: 'student', moduleIndex: 2, title: 'Module 2 Teaching Slides — Linux Essentials', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
  { local: 'Cloud LaunchPad slides/GDA_Module3_Slides.pptx', bucket: 'course-materials', storagePath: 'cloud-launchpad/slides/GDA_Module3_Slides.pptx', resourceType: 'slides', accessLevel: 'student', moduleIndex: 3, title: 'Module 3 Teaching Slides — Networking Fundamentals', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
  { local: 'Cloud LaunchPad slides/GDA_Module4_Slides.pptx', bucket: 'course-materials', storagePath: 'cloud-launchpad/slides/GDA_Module4_Slides.pptx', resourceType: 'slides', accessLevel: 'student', moduleIndex: 4, title: 'Module 4 Teaching Slides — Cloud Infrastructure', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
  { local: 'Cloud LaunchPad slides/GDA_Module5_Slides.pptx', bucket: 'course-materials', storagePath: 'cloud-launchpad/slides/GDA_Module5_Slides.pptx', resourceType: 'slides', accessLevel: 'student', moduleIndex: 5, title: 'Module 5 Teaching Slides — Cloud Security', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
  { local: 'Cloud LaunchPad slides/GDA_Module6_Slides.pptx', bucket: 'course-materials', storagePath: 'cloud-launchpad/slides/GDA_Module6_Slides.pptx', resourceType: 'slides', accessLevel: 'student', moduleIndex: 6, title: 'Module 6 Teaching Slides — Capstone Project', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
  { local: 'Cloud LaunchPad slides/GDA_Revision_Deck.pptx', bucket: 'course-materials', storagePath: 'cloud-launchpad/slides/GDA_Revision_Deck.pptx', resourceType: 'revision_deck', accessLevel: 'student', moduleIndex: null, title: 'Cloud LaunchPad Revision Deck — All Modules', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },

  // === TEACHING GUIDES (staff only) ===
  { local: 'Cloud LaunchPad LMS Teaching Material/GDA_Module1_Teaching_LMS_Materials.docx', bucket: 'course-materials', storagePath: 'cloud-launchpad/teaching-guides/GDA_Module1_Teaching_LMS_Materials.docx', resourceType: 'teaching_guide', accessLevel: 'staff', moduleIndex: 1, title: 'Module 1 Teaching Guide — Digital & Cloud Foundations', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { local: 'Cloud LaunchPad LMS Teaching Material/GDA_Module2_Teaching_LMS_Materials.docx', bucket: 'course-materials', storagePath: 'cloud-launchpad/teaching-guides/GDA_Module2_Teaching_LMS_Materials.docx', resourceType: 'teaching_guide', accessLevel: 'staff', moduleIndex: 2, title: 'Module 2 Teaching Guide — Linux Essentials', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { local: 'Cloud LaunchPad LMS Teaching Material/GDA_Module3_Teaching_LMS_Materials.docx', bucket: 'course-materials', storagePath: 'cloud-launchpad/teaching-guides/GDA_Module3_Teaching_LMS_Materials.docx', resourceType: 'teaching_guide', accessLevel: 'staff', moduleIndex: 3, title: 'Module 3 Teaching Guide — Networking Fundamentals', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { local: 'Cloud LaunchPad LMS Teaching Material/GDA_Module4_Teaching_LMS_Materials.docx', bucket: 'course-materials', storagePath: 'cloud-launchpad/teaching-guides/GDA_Module4_Teaching_LMS_Materials.docx', resourceType: 'teaching_guide', accessLevel: 'staff', moduleIndex: 4, title: 'Module 4 Teaching Guide — Cloud Infrastructure', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { local: 'Cloud LaunchPad LMS Teaching Material/GDA_Module5_Teaching_LMS_Materials.docx', bucket: 'course-materials', storagePath: 'cloud-launchpad/teaching-guides/GDA_Module5_Teaching_LMS_Materials.docx', resourceType: 'teaching_guide', accessLevel: 'staff', moduleIndex: 5, title: 'Module 5 Teaching Guide — Cloud Security', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { local: 'Cloud LaunchPad LMS Teaching Material/GDA_Module6_Teaching_LMS_Materials.docx', bucket: 'course-materials', storagePath: 'cloud-launchpad/teaching-guides/GDA_Module6_Teaching_LMS_Materials.docx', resourceType: 'teaching_guide', accessLevel: 'staff', moduleIndex: 6, title: 'Module 6 Teaching Guide — Capstone Project', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },

  // === MODULE SPECS / SYLLABI (staff only) ===
  { local: 'Cloud LaunchPad Modules/GDA_CloudLaunchpad_Phase2_3.docx', bucket: 'course-materials', storagePath: 'cloud-launchpad/syllabi/GDA_CloudLaunchpad_Phase2_3_Module1.docx', resourceType: 'syllabus', accessLevel: 'staff', moduleIndex: 1, title: 'Module 1 Syllabus — Course Architecture & Digital Foundations', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { local: 'Cloud LaunchPad Modules/GDA_CloudLaunchpad_Phase4_Module2.docx', bucket: 'course-materials', storagePath: 'cloud-launchpad/syllabi/GDA_CloudLaunchpad_Phase4_Module2.docx', resourceType: 'syllabus', accessLevel: 'staff', moduleIndex: 2, title: 'Module 2 Syllabus — Linux Essentials', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { local: 'Cloud LaunchPad Modules/GDA_CloudLaunchpad_Phase5_Module3.docx', bucket: 'course-materials', storagePath: 'cloud-launchpad/syllabi/GDA_CloudLaunchpad_Phase5_Module3.docx', resourceType: 'syllabus', accessLevel: 'staff', moduleIndex: 3, title: 'Module 3 Syllabus — Networking Fundamentals', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { local: 'Cloud LaunchPad Modules/GDA_CloudLaunchpad_Phase6_Module4.docx', bucket: 'course-materials', storagePath: 'cloud-launchpad/syllabi/GDA_CloudLaunchpad_Phase6_Module4.docx', resourceType: 'syllabus', accessLevel: 'staff', moduleIndex: 4, title: 'Module 4 Syllabus — Cloud Infrastructure', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { local: 'Cloud LaunchPad Modules/GDA_CloudLaunchpad_Phase7_Module5.docx', bucket: 'course-materials', storagePath: 'cloud-launchpad/syllabi/GDA_CloudLaunchpad_Phase7_Module5.docx', resourceType: 'syllabus', accessLevel: 'staff', moduleIndex: 5, title: 'Module 5 Syllabus — Cloud Security', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { local: 'Cloud LaunchPad Modules/GDA_CloudLaunchpad_Phase8_Module6.docx', bucket: 'course-materials', storagePath: 'cloud-launchpad/syllabi/GDA_CloudLaunchpad_Phase8_Module6.docx', resourceType: 'syllabus', accessLevel: 'staff', moduleIndex: 6, title: 'Module 6 Syllabus — Capstone Project', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },

  // === ASSIGNMENTS (student access) ===
  { local: 'Cloud LaunchPad Assignments/GDA_Assignment1_MidCourse.docx', bucket: 'course-materials', storagePath: 'cloud-launchpad/assignments/GDA_Assignment1_MidCourse.docx', resourceType: 'assignment', accessLevel: 'student', moduleIndex: null, title: 'Assignment 1 — Mid-Course Assessment', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { local: 'Cloud LaunchPad Assignments/GDA_Assignment2_EndOfCourse.docx', bucket: 'course-materials', storagePath: 'cloud-launchpad/assignments/GDA_Assignment2_EndOfCourse.docx', resourceType: 'assignment', accessLevel: 'student', moduleIndex: null, title: 'Assignment 2 — End-of-Course Assessment', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },

  // === FINAL EXAM (staff only — CRITICAL SECURITY) ===
  { local: 'Cloud LaunchPad Final Exam/GDA_CloudLaunchpad_Phase8_Module6.docx', bucket: 'course-materials', storagePath: 'cloud-launchpad/exams/GDA_CloudLaunchpad_FinalExam.docx', resourceType: 'exam', accessLevel: 'staff', moduleIndex: null, title: 'Cloud LaunchPad — Final Examination Paper', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },

  // === INSTITUTIONAL CURRICULUM DOCS (curriculum-docs bucket, staff only) ===
  { local: 'Full GDA Mapping of Curriculumn and Offerings/GDA_Phase1_Curriculum_Architecture.docx', bucket: 'curriculum-docs', storagePath: 'institutional/GDA_Phase1_Curriculum_Architecture.docx', resourceType: 'syllabus', accessLevel: 'staff', moduleIndex: null, title: 'GDA Phase 1 — Full Curriculum Architecture (7 Tracks × 4 Levels)', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', isCurriculumDoc: true },
  { local: 'Full GDA Mapping of Curriculumn and Offerings/GDA_Phase1_Curriculum_Map.docx', bucket: 'curriculum-docs', storagePath: 'institutional/GDA_Phase1_Curriculum_Map.docx', resourceType: 'syllabus', accessLevel: 'staff', moduleIndex: null, title: 'GDA Phase 1 — Curriculum Map (28-Course Matrix)', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', isCurriculumDoc: true },
];

async function uploadFile(file) {
  const localPath = path.join(BASE_DIR, file.local);
  
  if (!fs.existsSync(localPath)) {
    console.error(`  ❌ NOT FOUND: ${file.local}`);
    return null;
  }

  const fileBuffer = fs.readFileSync(localPath);
  const fileSize = fs.statSync(localPath).size;
  
  // Upload to Supabase storage
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

  const result = await res.json();
  console.log(`  ✅ Uploaded: ${file.storagePath} (${(fileSize / 1024).toFixed(1)} KB)`);
  
  return {
    ...file,
    fileSize,
    fileName: path.basename(file.local),
    fileUrl: `${SUPABASE_URL}/storage/v1/object/${file.bucket}/${file.storagePath}`,
  };
}

async function getCourseAndModuleIds() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/courses?slug=eq.cloud-launchpad&select=id`, {
    headers: { 'Authorization': `Bearer ${SERVICE_ROLE_KEY}`, 'apikey': SERVICE_ROLE_KEY },
  });
  const [course] = await res.json();
  
  const modRes = await fetch(`${SUPABASE_URL}/rest/v1/modules?course_id=eq.${course.id}&select=id,order_index&order=order_index`, {
    headers: { 'Authorization': `Bearer ${SERVICE_ROLE_KEY}`, 'apikey': SERVICE_ROLE_KEY },
  });
  const modules = await modRes.json();
  
  return { courseId: course.id, modules };
}

async function createResourceEntry(uploaded, courseId, modules) {
  if (uploaded.isCurriculumDoc) return; // Curriculum docs don't need course_resources entries
  
  const moduleId = uploaded.moduleIndex 
    ? modules.find(m => m.order_index === uploaded.moduleIndex)?.id || null
    : null;

  const body = {
    course_id: courseId,
    module_id: moduleId,
    title: uploaded.title,
    resource_type: uploaded.resourceType,
    file_url: uploaded.fileUrl,
    file_name: uploaded.fileName,
    file_size_bytes: uploaded.fileSize,
    mime_type: uploaded.mime,
    access_level: uploaded.accessLevel,
    is_downloadable: uploaded.accessLevel !== 'staff', // Staff-only files not downloadable by students
    order_index: uploaded.moduleIndex || 0,
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

  if (!res.ok) {
    const err = await res.text();
    console.error(`  ❌ DB ENTRY FAILED: ${uploaded.title} — ${err}`);
  } else {
    console.log(`  📝 DB entry: ${uploaded.title} [${uploaded.accessLevel}]`);
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  GDA Curriculum File Upload — Phase 2');
  console.log('═══════════════════════════════════════════════════════\n');

  // Get course and module IDs
  console.log('📋 Fetching course and module IDs...');
  const { courseId, modules } = await getCourseAndModuleIds();
  console.log(`  Course ID: ${courseId}`);
  console.log(`  Modules: ${modules.length}\n`);

  // Upload files
  console.log(`📤 Uploading ${FILES.length} files...\n`);
  const uploaded = [];
  
  for (const file of FILES) {
    const result = await uploadFile(file);
    if (result) uploaded.push(result);
  }

  console.log(`\n✅ Uploaded ${uploaded.length}/${FILES.length} files\n`);

  // Create course_resources entries
  console.log('📝 Creating course_resources database entries...\n');
  for (const u of uploaded) {
    await createResourceEntry(u, courseId, modules);
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log(`  COMPLETE: ${uploaded.length} files uploaded, DB entries created`);
  console.log('═══════════════════════════════════════════════════════');
}

main().catch(console.error);
