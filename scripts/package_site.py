"""Build a complete ZIP and a portable, self-contained preview outside the checkout."""
from pathlib import Path
import base64
import mimetypes
import re
import zipfile
root = Path(__file__).resolve().parents[1]
out = root.parent
html = (root / 'index.html').read_text()
def data_url(path):
    mime = mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
    return f'data:{mime};base64,' + base64.b64encode(path.read_bytes()).decode()
def embedded_css(match):
    css = (root / match.group(1)).read_text()
    def asset(m):
        value = m.group(1).strip('\"\' ')
        path = root / value
        return 'url("' + data_url(path) + '")' if path.is_file() else m.group(0)
    return '<style>' + re.sub(r'url\(([^)]+)\)', asset, css) + '</style>'
html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', embedded_css, html)
html = re.sub(r'\s*<link rel="preload"[^>]+>', '', html)
# Preserve deferred execution after the document has been parsed.
scripts = re.findall(r'<script src="([^"]+)" defer></script>', html)
html = re.sub(r'\s*<script src="[^"]+" defer></script>', '', html)
inline = ''
for name in scripts:
    text = (root / name).read_text()
    if name == 'projects.js':
        for image in (root / 'assets/projects').glob('*.png'):
            text = text.replace(str(image.relative_to(root)), data_url(image))
    inline += '<script>' + text.replace('</script', '<\\/script') + '</script>\n'
html = html.replace('</body>', inline + '</body>')
html = html.replace('assets/mark.svg', data_url(root / 'assets/mark.svg'))
(out / 'veytrixa-preview.html').write_text(html)
with zipfile.ZipFile(out / 'veytrixa-website.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
    for path in root.rglob('*'):
        relative = path.relative_to(root)
        if path.is_file() and '.git' not in relative.parts and 'node_modules' not in relative.parts:
            archive.write(path, 'veytrixa-website/' + str(relative))
print('Built veytrixa-preview.html and veytrixa-website.zip in', out)
