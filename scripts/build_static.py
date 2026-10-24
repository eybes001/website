"""Build the no-dependency static deployment edition into dist/."""
from pathlib import Path
import shutil,json,re
root=Path(__file__).resolve().parents[1]
out=root/'dist';out.mkdir(exist_ok=True)
for name in ('index.html','style.css','app.js','scene.js','site.config.json'):
 shutil.copy2(root/name,out/name)
for name in ('assets','models'):
 src=root/'public'/name
 target=out/name
 if target.exists():shutil.rmtree(target)
 shutil.copytree(src,target)
html=(out/'index.html').read_text()
assert '<section class="hero"' in html and 'id="studioOverlay"' in html
assert (out/'models'/'studio.glb').stat().st_size>100000
print('Static production build:',out)
for f in out.rglob('*'):
 if f.is_file():print(f.relative_to(out),f.stat().st_size,'bytes')
