import path from 'path';
import { patchPlaywright } from 'patchright';
import { chromium } from 'playwright';

async function main() {
  // 1) Stealth-patch Playwright’s Chromium install
  await patchPlaywright({
    browser: 'chromium',
    // omit `patches` for the full suite, or list specific ones:
    // patches: [require('patchright/lib/patches/hide-webdriver'), ...]
  });

  // 2) Point to your local nanobrowser extension folder
  const extensionPath = path.resolve('./nanobrowser');

  // 3) Launch a persistent context with ONLY nanobrowser loaded
  const context = await chromium.launchPersistentContext('', {
    headless: false,     // set to true if you don’t need the UI
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
      '--start-maximized',
    ],
  });

  // 4) Open the tab where nanobrowser shows up
  const pages = context.pages();
  const page  = pages.length ? pages[0] : await context.newPage();

  // 5) Navigate somewhere and let Nanobrowser do its thing
  await page.goto('https://twitter.com');

  // OPTIONAL: interact via Playwright
  // e.g. click Nanobrowser’s docked sidebar toggle
  // await page.click('css=[data-nanobrowser-toggle]');

  console.log('✅ Nanobrowser is running in a stealth-patched Playwright session.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
