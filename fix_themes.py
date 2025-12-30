import re

# Read StudentPowerUps.tsx
with open(r'E:\AntiGravity-Assets\frontend\src\pages\student\StudentPowerUps.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the Marketplace - Themes section (lines 150-191 approximately)
# Find the pattern and remove it
pattern = r'\s*{/\* Marketplace - Themes Section \*/}.*?</div>\s*(?=\s*{/\* How Power-Ups Work \*/})'
content_new = re.sub(pattern, '\n\n', content, flags=re.DOTALL)

# Write back
with open(r'E:\AntiGravity-Assets\frontend\src\pages\student\StudentPowerUps.tsx', 'w', encoding='utf-8') as f:
    f.write(content_new)

print("✅ Removed Marketplace section from PowerUps")

# Update StudentMarketplace.tsx
with open(r'E:\AntiGravity-Assets\frontend\src\pages\student\StudentMarketplace.tsx', 'r', encoding='utf-8') as f:
    marketplace = f.read()

# Replace items array
old_items = r"const items: MarketplaceItem\[\] = \[.*?\];"
new_items = """const items: MarketplaceItem[] = [
        { id: 'theme_light', name: 'Light Theme (Default)', description: 'Clean, bright interface', cost: 0, type: 'theme', icon: '☀️' },
        { id: 'theme_dark', name: 'Dark Theme', description: 'Eye-friendly dark mode', cost: 60, type: 'theme', icon: '🌙' },
        { id: 'theme_colorful', name: 'Colorful Theme', description: 'Vibrant, energetic colors', cost: 30, type: 'theme', icon: '🎨' },
        { id: 'avatar1', name: 'Custom Avatar', description: 'Choose your own profile picture', cost: 50, type: 'avatar', icon: '🖼️' },
        { id: 'music', name: 'Study Music Access', description: 'Lo-fi beats while you learn', cost: 30, type: 'music', icon: '🎵' },
        { id: 'cert_premium', name: 'Premium Certificate', description: 'Enhanced certificate design', cost: 100, type: 'certificate', icon: '📜' }
    ];"""

marketplace = re.sub(old_items, new_items, marketplace, flags=re.DOTALL)

# Replace handlePurchase function
old_purchase = r"const handlePurchase = \(item: MarketplaceItem\) => \{.*?    \};"
new_purchase = """const handlePurchase = (item: MarketplaceItem) => {
        // Handle free light theme
        if (item.id === 'theme_light') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            setPurchasedItem(item.name);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            return;
        }

        if (student.credits >= item.cost) {
            // Deduct credits
            const studentData = JSON.parse(localStorage.getItem('studentData') || '{}');
            studentData[1] = {
                ...studentData[1],
                credits: student.credits - item.cost
            };
            localStorage.setItem('studentData', JSON.stringify(studentData));

            // Save purchase
            const purchases = JSON.parse(localStorage.getItem('marketplace_purchases') || '[]');
            purchases.push({ itemId: item.id, purchasedAt: new Date().toISOString() });
            localStorage.setItem('marketplace_purchases', JSON.stringify(purchases));

            // Instantly apply theme if it's a theme type
            if (item.type === 'theme') {
                if (item.id === 'theme_dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    localStorage.setItem('theme', 'dark');
                } else if (item.id === 'theme_colorful') {
                    document.documentElement.setAttribute('data-theme', 'colorful');
                    localStorage.setItem('theme', 'colorful');
                }
            }

            setPurchasedItem(item.name);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }
    };"""

marketplace = re.sub(old_purchase, new_purchase, marketplace, flags=re.DOTALL)

with open(r'E:\AntiGravity-Assets\frontend\src\pages\student\StudentMarketplace.tsx', 'w', encoding='utf-8') as f:
    f.write(marketplace)

print("✅ Updated Marketplace with instant theme application")

# Update index.css colorful theme
with open(r'E:\AntiGravity-Assets\frontend\src\index.css', 'r', encoding='utf-8') as f:
    css = f.read()

old_colorful = r'/\* Colorful theme.*?\}'
new_colorful = """/* Colorful theme - VIBRANT and ENERGETIC */
[data-theme="colorful"] {
  /* Bright, saturated backgrounds - clearly different */
  --bg-primary: #fff0f5;      /* Bright lavender pink */
  --bg-secondary: #d4f1f9;    /* Vibrant cyan */
  --bg-tertiary: #fff7ed;     /* Bright peach */
  
  /* Bold, vivid text colors */
  --text-primary: #1e40af;    /* Rich royal blue */
  --text-secondary: #db2777;  /* Hot pink */
  --text-tertiary: #ea580c;   /* Vivid orange */
  
  /* Colorful, eye-catching accents */
  --border-color: #f472b6;    /* Bright pink */
  --border-hover: #a855f7;    /* Vibrant purple */
  --shadow: rgba(219, 39, 119, 0.25);
}"""

css = re.sub(old_colorful, new_colorful, css, flags=re.DOTALL)

with open(r'E:\AntiGravity-Assets\frontend\src\index.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("✅ Made colorful theme MORE vibrant")
print("\\n🎉 All changes complete!")
