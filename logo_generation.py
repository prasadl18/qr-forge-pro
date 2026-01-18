from PIL import Image, ImageDraw

def create_qr_logo_icon(size):
    # Purple gradient background
    img = Image.new('RGB', (size, size))
    draw = ImageDraw.Draw(img)
    
    # Create gradient
    for y in range(size):
        r = int(102 + (118 - 102) * y / size)
        g = int(126 + (75 - 126) * y / size)
        b = int(234 + (162 - 234) * y / size)
        draw.line([(0, y), (size, y)], fill=(r, g, b))
    
    # QR pattern (white)
    margin = int(size * 0.15)
    square_size = int(size * 0.25)
    stroke = max(2, size // 18)
    
    # Top-left
    draw.rectangle([margin, margin, margin+square_size, margin+square_size], 
                   outline='white', width=stroke)
    inner = int(square_size * 0.4)
    inner_margin = int(square_size * 0.3)
    draw.rectangle([margin+inner_margin, margin+inner_margin, 
                   margin+inner_margin+inner, margin+inner_margin+inner], fill='white')
    
    # Top-right
    x = size - margin - square_size
    draw.rectangle([x, margin, x+square_size, margin+square_size], 
                   outline='white', width=stroke)
    draw.rectangle([x+inner_margin, margin+inner_margin, 
                   x+inner_margin+inner, margin+inner_margin+inner], fill='white')
    
    # Bottom-left
    y = size - margin - square_size
    draw.rectangle([margin, y, margin+square_size, y+square_size], 
                   outline='white', width=stroke)
    draw.rectangle([margin+inner_margin, y+inner_margin, 
                   margin+inner_margin+inner, y+inner_margin+inner], fill='white')
    
    # Bottom-right accent pattern
    accent = int(size * 0.12)
    x_acc = size - margin - accent
    y_acc = size - margin - accent
    draw.rectangle([x_acc, y_acc, size-margin, size-margin], fill='white')
    draw.rectangle([x_acc-accent-4, y_acc, x_acc-4, size-margin], fill='white')
    draw.rectangle([x_acc, y_acc-accent-4, size-margin, y_acc-4], fill='white')
    
    return img

for size in [16, 48, 128]:
    icon = create_qr_logo_icon(size)
    icon.save(f'icon{size}.png')
    print(f'✅ Created icon{size}.png')

print('\n✅ All icons created with QR code logo!')
PYEND
