import os

directory = r'c:\Users\Tabarak\Desktop\leagal-dashboard\dropdownListsPages'
files = [
    'case-stages.html',
    'case-status.html',
    'court-fees.html',
    'notes-types.html',
    'sub-classification.html'
]

script_tag = '  <script src="../js/auth.js"></script>\n'
old_link = '  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">'
new_link = old_link + '\n' + script_tag

old_btn = '<button class="grid h-11 w-11 place-items-center rounded-2xl bg-legalGold/10 text-xl text-legalGold transition hover:bg-legalGold hover:text-white">\n              <i class="fa-solid fa-power-off text-base"></i>\n            </button>'
new_btn = '<button onclick="logout()" class="grid h-11 w-11 place-items-center rounded-2xl bg-legalGold/10 text-xl text-legalGold transition hover:bg-legalGold hover:text-white">\n              <i class="fa-solid fa-power-off text-base"></i>\n            </button>'

for filename in files:
    filepath = os.path.join(directory, filename)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Add script tag
        if script_tag not in content:
            content = content.replace(old_link, new_link)
        
        # Add logout() to button
        # Using a simpler replace if the exact structure varies slightly, but most seem identical
        content = content.replace(old_btn, new_btn)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filename}")
    else:
        print(f"File not found: {filename}")
