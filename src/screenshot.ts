import { chromium, Browser, Page, ElementHandle } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const a3Width = 128 * 16;

  const context = await browser.newContext({
    deviceScaleFactor: 3,
    viewport: { width: a3Width, height: Math.floor(a3Width * 1.414) } // 1280 × 1.414 = 1810 CSS pixels (Perfect A3 Ratio)
  });

  const page = await context.newPage();

  await page.goto('http://127.0.0.1:5500/index.html');

  await page.screenshot({ path: 'dist/fullpage.png', fullPage: true });

  let currentScrollY = 0;
  let previousScrollY = -1;

  while (currentScrollY !== previousScrollY) {
    previousScrollY = currentScrollY;

    // Scroll down natively by 300 pixels
    await page.mouse.wheel(0, 300);

    // Give the network/render thread a moment to process lazy assets
    await page.waitForTimeout(150);

    // Track our current scroll position
    currentScrollY = await page.evaluate(() => window.scrollY);

    // Safety break: If a navigation happens, break out instead of crashing
    const isDestroyed = await page.evaluate(() => !window.document).catch(() => true);
    if (isDestroyed) break;
  }

  // Reset back to the top cleanly
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);


  const totalPageHeight = await page.evaluate(() => {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight
    );
  });

  const a3TargetHeight = 1810;

  const elements = await page.$$('.historySquare');

  let fileIndex = 0;
  let targetHeight: number = a3TargetHeight;

  await page.evaluate(() => {
    document.body.style.paddingBottom = '3000px';
  });

  for (const element of elements) {

    const box = await element.boundingBox();
    if (!box) continue;                   //skip unbounded elements
    if (box.y < targetHeight) continue;   //skip if it doesn't put us further down
    fileIndex++;
    let currentY = Math.floor(box.y);



    console.log(`${box.y} and ${box.height}`);
    if ((box.y + box.height) > targetHeight) {
      console.log(`clipped slightly to avoid partial -- started at ${targetHeight}`);
      targetHeight = Math.floor(box.y) - 5;
      console.log(`clipped slightly to avoid partial -- cut to ${targetHeight}`);
    } else {
      console.log(`last box clears with at ${targetHeight} `);
    }

    console.log(`screenshot starts x:0, y: ${currentY} and  height: ${targetHeight}  vs total ${totalPageHeight}`);

    await page.screenshot({
      path: `dist/a3_page_${fileIndex}.png`,
      clip: { x: 0, y: 0, width: a3Width, height: targetHeight }
    });

    await page.evaluate((targetY) => {
      window.scrollTo(0, targetY);
    }, targetHeight + 5);
    // Next valid screenshot must start AFTER this entire screenshot's coverage area
  }


  if (targetHeight < totalPageHeight) {
    fileIndex++;
    console.log('cleanup item');
    const finalY = Math.max(0, totalPageHeight - a3TargetHeight);

    await page.screenshot({
      path: `dist/a3_page_${fileIndex}.png`,
      clip: { x: 0, y: 0, width: a3Width, height: a3TargetHeight }
    });
  }

  console.log(`${fileIndex} files`);


  await browser.close();
})();
