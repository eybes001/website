from playwright.sync_api import sync_playwright
from pathlib import Path
import time
out=Path('/mnt/data/eyad-lumen-studio/tests');out.mkdir(exist_ok=True)
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu'])
 for w,h,name in [(1440,900,'desktop'),(390,844,'mobile'),(320,690,'small-mobile'),(768,1024,'tablet')]:
  page=browser.new_page(viewport={'width':w,'height':h},device_scale_factor=1)
  errors=[];page.on('pageerror',lambda err:errors.append(str(err)))
  page.goto('http://localhost:8765',wait_until='domcontentloaded',timeout=20000)
  page.wait_for_timeout(800)
  page.screenshot(path=str(out/f'{name}.png'),full_page=False)
  print(name,'title=',page.title(),'errors=',errors[:4], 'scrollWidth=',page.evaluate('document.documentElement.scrollWidth'), 'width=',w)
  assert 'Eyad' in page.title()
  assert not errors,errors
  assert page.evaluate('document.documentElement.scrollWidth') <= w+2
  assert page.locator('#kpiRevenue').inner_text()!="—"
  page.locator('#businessSelect').select_option('retail');page.wait_for_timeout(80)
  value=page.locator('#kpiRevenue').inner_text();assert value!="—"
  page.locator('#periodSelect').select_option('3');page.wait_for_timeout(70);assert page.locator('#chartPeriod').inner_text()=='3 months'
  # project panel button should work; use direct click normal
  page.locator('[data-open="automation"]').first.click();assert page.locator('#panelDialog').is_visible()
  page.locator('#nextStep').click();assert 'missing delivery date' in page.locator('#stepDetails').inner_text()
  page.locator('#closePanel').click();assert not page.locator('#panelDialog').is_visible()
  page.locator('[data-open="quality"]').first.click()
  page.locator('#records .record').nth(1).click();assert '1 / 4' in page.locator('#reviewCount').inner_text()
  page.locator('#closePanel').click()
  print(' interactions pass',name)
  page.close()
 browser.close()
