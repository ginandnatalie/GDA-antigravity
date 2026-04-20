import os

def create_bmp(filename, hex_color, size=15):
    # Strip # and convert to RGB
    hex_color = hex_color.lstrip('#')
    r, g, b = int(hex_color[0:2], 16), int(hex_color[2:4], 16), int(hex_color[4:6], 16)
    
    # 15x15 BMP is small enough to manually construct
    # File Header (14 bytes) + DIB Header (40 bytes) + Pixel Data
    # Pixel data for 15x15: 15 pixels * 3 bytes = 45 bytes. 
    # Must be padded to 4-byte boundary: 48 bytes per row.
    # Total pixel data: 48 * 15 = 720 bytes.
    # Total file size: 14 + 40 + 720 = 774 bytes.
    
    file_size = 774
    data = bytearray([0]*file_size)
    
    # File Header
    data[0:2] = b'BM'
    data[2:6] = file_size.to_bytes(4, 'little')
    data[10:14] = (54).to_bytes(4, 'little')
    
    # DIB Header
    data[14:18] = (40).to_bytes(4, 'little')
    data[18:22] = size.to_bytes(4, 'little') # Width
    data[22:26] = size.to_bytes(4, 'little') # Height
    data[26:28] = (1).to_bytes(2, 'little')
    data[28:30] = (24).to_bytes(2, 'little')
    # Use default 0 for the rest
    
    # Pixel Data (starts at offset 54)
    # Bottom-up storage
    offset = 54
    for y in range(size):
        for x in range(size):
            # Blue, Green, Red
            data[offset] = b
            data[offset+1] = g
            data[offset+2] = r
            offset += 3
        # Padding
        offset += 3 # 45 + 3 = 48
        
    with open(filename, 'wb') as f:
        f.write(data)

# Target directory
target_dir = r'C:\Users\ginas\.gemini\antigravity\brain\375469e8-657f-47dd-9e72-c73c09eeddf7'

colors = {
    "obsidian": "#05070a",
    "amber": "#f4a21a",
    "cyan": "#00f2ff",
    "purple": "#8b5cf6",
    "teal": "#56cfac"
}

for name, color in colors.items():
    create_bmp(os.path.join(target_dir, f"{name}_tile.bmp"), color)
    print(f"Created {name}_tile.bmp")
