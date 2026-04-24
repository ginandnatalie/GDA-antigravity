import base64
import re

with open(r"c:\Users\ginas\OneDrive\Documents\George Master File\ginashe-digital-academy\public\videos\ginashe-hero-combined.html", "r", encoding="utf-8") as f:
    content = f.read()

match = re.search(r'source src="data:video/mp4;base64,([^"]+)"', content)
if match:
    base64_data = match.group(1)
    video_data = base64.b64decode(base64_data)
    with open(r"c:\Users\ginas\OneDrive\Documents\George Master File\ginashe-digital-academy\public\videos\ginashe-institutional-hero.mp4", "wb") as f:
        f.write(video_data)
    print("Video extracted successfully.")
else:
    print("Video data not found.")
