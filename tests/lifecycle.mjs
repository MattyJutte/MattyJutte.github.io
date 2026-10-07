// Focus, paused animation, session reset, and low-height layout regressions.
import assert from "node:assert/strict";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const browser = await chromium.launch();
const url = process.env.PORTFOLIO_URL || "http://127.0.0.1:3107";
const errors = [];
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(url);
  await page.getByRole("button", { name: /Een rondje minigolf/ }).click();
  await page.locator(".golf-course").waitFor();
  await page.getByRole("button", { name: /^Slaan/ }).click();
  await page.waitForTimeout(150);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      value: true,
      configurable: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  const ball = page.locator(".golf-course > circle").last();
  const before = await ball.getAttribute("cx");
  await page.waitForTimeout(200);
  assert.equal(await ball.getAttribute("cx"), before);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      value: false,
      configurable: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.waitForTimeout(150);
  assert.notEqual(await ball.getAttribute("cx"), before);
  console.log("PASS hidden-tab animation pauses and resumes");
  await page.keyboard.press("Escape");
  await page.locator(".discovery-book-button").click();
  await page
    .getByRole("button", { name: "Voortgang en records wissen" })
    .click();
  await page.getByRole("button", { name: "Ja, wissen" }).click();
  await page.getByRole("button", { name: "Sluiten", exact: true }).click();
  await page.getByRole("button", { name: /Een rondje minigolf/ }).click();
  await page.locator(".golf-course").waitFor();
  assert.equal(
    await page.locator(".game-stats strong").nth(2).textContent(),
    "0",
  );
  assert.equal(await ball.getAttribute("cx"), "75");
  console.log("PASS reset discards cached golf session without a page reload");
  await page.keyboard.press("Escape");
  await page.locator(".discovery-book-button").click();
  await page.locator("summary").click();
  await page
    .getByRole("button", { name: "Geheime Arcade", exact: true })
    .click();
  await page.locator(".reaction-target").waitFor();
  assert.ok(
    await page
      .locator("dialog")
      .evaluate((node) => node.contains(document.activeElement)),
  );
  console.log("PASS notebook-to-game transition keeps focus inside the modal");
  await page.close();
  for (const height of [320, 390]) {
    const context = await browser.newContext({
      viewport: { width: 844, height },
      isMobile: true,
      hasTouch: true,
    });
    const p = await context.newPage();
    p.on("pageerror", (error) => errors.push(error.message));
    await p.goto(url);
    await p.getByRole("button", { name: /Een rondje minigolf/ }).tap();
    await p.locator(".golf-course").waitFor();
    await p.locator(".golf-course").scrollIntoViewIfNeeded();
    const rect = await p.locator(".golf-course").boundingBox();
    const header = await p.locator(".discovery-dialog-header").boundingBox();
    await p.screenshot({
      path: `${process.env.QA_OUTPUT || "/tmp/portfolio-qa"}/landscape-${height}-complete-course.png`,
    });
    console.log({ height, course: rect, header });
    assert.ok(
      rect.height <= height - 150 + 2 &&
        rect.y >= header.y + header.height - 1 &&
        rect.y + rect.height <= height - 8,
    );
    const client = await context.newCDPSession(p);
    const position = {
      x: rect.x + (rect.width * 75) / 600,
      y: rect.y + rect.height / 2,
      id: 1,
    };
    const scroll = await p
      .locator(".discovery-dialog-content")
      .evaluate((node) => node.scrollTop);
    await client.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [position],
    });
    await client.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ ...position, x: rect.x + (rect.width * 3) / 600 }],
    });
    await client.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    assert.equal(
      await p.locator(".game-stats strong").nth(2).textContent(),
      "1",
    );
    assert.equal(
      await p
        .locator(".discovery-dialog-content")
        .evaluate((node) => node.scrollTop),
      scroll,
    );
    await p.screenshot({
      path: `${process.env.QA_OUTPUT || "/tmp/portfolio-qa"}/landscape-${height}-complete-course.png`,
    });
    console.log(
      `PASS landscape ${height}px shows complete course, supports touch, and does not scroll during drag`,
    );
    await context.close();
  }
  assert.deepEqual(errors, []);
  console.log("PASS no runtime errors in lifecycle regressions");
} finally {
  await browser.close();
}
