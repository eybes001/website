from pathlib import Path
from playwright.sync_api import sync_playwright
import base64,json
root=Path('/mnt/data/eyad-lumen-studio');out=root/'tests';out.mkdir(exist_ok=True)
html=(root/'index.html').read_text();css=(root/'style.css').read_text();js=(root/'app.js').read_text();cfg=(root/'site.config.json').read_text();
js=js.replace("import config from './site.config.json' with { type: 'json' };","const config = "+cfg.strip()+";")
for name in ['studio-cinematic','studio-mobile']:
 b64=base64.b64encode((root/'public/assets'/f'{name}.webp').read_bytes()).decode()
 css=css.replace(f"url('./assets/{name}.webp')",f"url('data:image/webp;base64,{b64}')")
import re
html=re.sub(r'<link [^>]*fonts.googleapis.com[^>]*>','',html)
html=re.sub(r'<link [^>]*fonts.gstatic.com[^>]*>','',html)
html=html.replace('<link rel="stylesheet" href="./style.css">','<style>'+css+'</style>')
html=html.replace('<script type="module" src="./app.js"></script>','<script>'+js+'</script>')
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu'])
 for w,h,name in [(1440,900,'desktop'),(390,844,'mobile'),(320,690,'small-mobile'),(768,1024,'tablet')]:
  pg=b.new_page(viewport={'width':w,'height':h})
  errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
  pg.set_content(html,wait_until='commit',timeout=10000)
  pg.wait_for_timeout(200)
  pg.screenshot(path=str(out/f'{name}.png'),animations='disabled')
  sw=pg.evaluate('document.documentElement.scrollWidth')
  rev=pg.locator('#kpiRevenue').inner_text()
  print(name,'scroll',sw,'width',w,'revenue',rev,'errors',errors[:2])
  assert sw <= w+2,(name,'horizontal overflow',sw)
  assert rev.startswith('$')
  assert not errors,errors
  pg.locator('#businessSelect').select_option('retail')
  a=pg.locator('#kpiRevenue').inner_text();pg.locator('#periodSelect').select_option('3');q=pg.locator('#kpiRevenue').inner_text()
  assert a!=q,(name,'chart controls did not update')
  pg.locator('[data-open="automation"]').first.click(timeout=5000);assert pg.locator('#panelDialog').is_visible()
  pg.locator('#nextStep').click();assert 'missing delivery date' in pg.locator('#stepDetails').inner_text()
  pg.locator('#closePanel').click();assert not pg.locator('#panelDialog').is_visible()
  pg.locator('[data-open="quality"]').first.click()
  pg.locator('#records .record').nth(1).click();assert '1 / 4' in pg.locator('#reviewCount').inner_text()
  pg.locator('#closePanel').click()
  print('  WORKFLOW+QUALITY+CHART PASS')
  pg.close()
 b.close()
