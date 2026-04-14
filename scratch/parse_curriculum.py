import os
import re
import xml.etree.ElementTree as ET

def extract_text_from_xml(xml_path):
    if not os.path.exists(xml_path):
        return ""
    
    tree = ET.parse(xml_path)
    root = tree.getroot()
    
    # Namespaces
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    
    texts = []
    for paragraph in root.findall('.//w:p', ns):
        p_text = ""
        for run in paragraph.findall('.//w:r', ns):
            t_node = run.find('w:t', ns)
            if t_node is not None:
                p_text += t_node.text
        if p_text:
            texts.append(p_text.strip())
            
    return "\n".join(texts)

base_dir = r"c:\Users\ginas\OneDrive\Documents\George Master File\ginashe-digital-academy\Curriculumn"
folders = [
    "tmp_launchpad_2_3",
    "tmp_GDA_CloudLaunchpad_Phase4_Module2",
    "tmp_GDA_CloudLaunchpad_Phase5_Module3",
    "tmp_GDA_CloudLaunchpad_Phase6_Module4",
    "tmp_GDA_CloudLaunchpad_Phase7_Module5",
    "tmp_GDA_CloudLaunchpad_Phase8_Module6"
]

output_path = os.path.join(base_dir, "extracted_curriculum.txt")

with open(output_path, "w", encoding="utf-8") as f:
    for folder in folders:
        xml_file = os.path.join(base_dir, folder, "word", "document.xml")
        content = extract_text_from_xml(xml_file)
        f.write(f"--- FOLDER: {folder} ---\n")
        f.write(content)
        f.write("\n\n")

print(f"Extracted content written to {output_path}")
