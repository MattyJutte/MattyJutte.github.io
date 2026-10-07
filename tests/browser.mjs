// Optional browser QA: install Playwright separately or provide PLAYWRIGHT_MODULE.
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { holes, strike, stepBall, moving } from "../lib/discovery/golf.ts";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const url = process.env.PORTFOLIO_URL || "http://127.0.0.1:3107";
const output = process.env.QA_OUTPUT || "/tmp/portfolio-qa";
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const errors = [];
let checks = 0;
const check = (description, value = true) => {
  assert.ok(value, description);
  checks++;
  console.log(`PASS ${description}`);
};
const monitor = (page) => {
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
};
const close = (page) =>
  page.getByRole("button", { name: /^(Sluiten|Close)$/ }).click();
const openBook = (page) => page.locator(".discovery-book-button").click();
async function setRange(page, name, value) {
  await page
    .getByRole("slider", { name, exact: true })
    .evaluate((input, next) => {
      Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      ).set.call(input, String(next));
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }, value);
}
async function fits(page, label) {
  const layout = await page.evaluate(() => {
    const dialog = document.querySelector("dialog[open]");
    const rect = dialog?.getBoundingClientRect();
    const button = dialog
      ?.querySelector(".discovery-close")
      .getBoundingClientRect();
    return {
      width: document.documentElement.scrollWidth,
      screen: innerWidth,
      fits:
        !rect ||
        (rect.x >= 0 &&
          rect.right <= innerWidth + 1 &&
          rect.y >= 0 &&
          rect.bottom <= innerHeight + 1 &&
          button.bottom <= innerHeight),
      horizontal: !dialog || dialog.scrollWidth <= dialog.clientWidth,
    };
  });
  check(
    label,
    layout.width <= layout.screen && layout.fits && layout.horizontal,
  );
}
try {
  if (process.env.QA_SECTION !== "mobile") {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
    });
    const page = await context.newPage();
    monitor(page);
    const response = await page.goto(url);
    check("static export responds with HTTP 200", response.status() === 200);
    await page.locator(".discovery-book-button").waitFor();
    await page.screenshot({ path: `${output}/desktop-hero-dark-nl.png` });
    check(
      "NL/dark initial state",
      (await page.locator("html").getAttribute("lang")) === "nl" &&
        (await page.locator("html").getAttribute("data-theme")) === "dark",
    );
    check(
      "heavy games absent before opening",
      (await page
        .locator(".golf-course, .path-grid, .reaction-target")
        .count()) === 0,
    );
    await page.locator("#discovery-stars").click();
    await page.locator("#star-settings select").selectOption("helix");
    await page.locator("#star-settings input").first().fill("2");
    await page.locator("#star-settings input").nth(1).fill("-30");
    await page.screenshot({ path: `${output}/desktop-star-studio.png` });
    await page.getByRole("button", { name: "Herstel standaard" }).click();
    check(
      "star studio resets speed, force and shape",
      (await page.locator("#star-settings input").first().inputValue()) ===
        "1" &&
        (await page.locator("#star-settings input").nth(1).inputValue()) ===
          "22" &&
        (await page.locator("#star-settings select").inputValue()) === "sphere",
    );
    await page.locator("#discovery-stars").click();
    await page.locator("#discovery-initials").click();
    await page.locator("#discovery-signal").click();
    check(
      "technical signal reveals explanation",
      await page.locator("#skill-signal-detail").isVisible(),
    );
    await page.locator("#discovery-robot").click();
    check(
      "footer robot reveals greeting",
      await page.locator("#footer-robot-detail").isVisible(),
    );
    await page.getByRole("button", { name: "Open het lab" }).click();
    await page.locator(".path-grid").waitFor();
    await fits(page, "desktop lab fits viewport");
    await page.getByRole("button", { name: "Voorbeeld", exact: true }).click();
    await setRange(page, "Zoeksnelheid", 100);
    await page
      .getByRole("button", { name: "Start zoeken", exact: true })
      .click();
    await page.getByRole("button", { name: "Pauzeren", exact: true }).click();
    const paused = await page.locator(".path-grid .is-visited").count();
    await page.waitForTimeout(150);
    check(
      "BFS pauses without progressing",
      paused === (await page.locator(".path-grid .is-visited").count()),
    );
    await page.getByRole("button", { name: "Hervatten", exact: true }).click();
    await page.waitForFunction(() =>
      document
        .querySelector(".game-feedback")
        ?.textContent.includes("Route gevonden"),
    );
    check(
      "BFS example finds and displays shortest path",
      (await page.locator(".path-cell.is-path").count()) > 0,
    );
    await page.getByRole("button", { name: "Bekijk de code" }).click();
    await page.waitForFunction(() =>
      document
        .querySelector("pre")
        ?.textContent.includes("export function breadthFirstSearch"),
    );
    check(
      "code view loads actual source",
      (await page.locator("pre").textContent()).includes(
        "const queue = [start]",
      ),
    );
    await page.screenshot({ path: `${output}/desktop-lab-dark-nl.png` });
    await page.getByRole("button", { name: "Reset raster" }).click();
    const cells = page.locator(".path-cell");
    await cells.nth(0).focus();
    await page.keyboard.press("ArrowRight");
    check(
      "BFS raster supports arrow-key navigation",
      await cells.nth(1).evaluate((node) => node === document.activeElement),
    );
    await page.getByRole("button", { name: "Start", exact: true }).click();
    await cells.nth(5).focus();
    await page.keyboard.press("Enter");
    await page.getByRole("button", { name: "Eind", exact: true }).click();
    await cells.nth(74).focus();
    await page.keyboard.press("Enter");
    check(
      "BFS endpoints can be changed with the keyboard",
      (await cells.nth(5).textContent()) === "S" &&
        (await cells.nth(74).textContent()) === "E",
    );
    await page.getByRole("button", { name: "Reset raster" }).click();
    await page.getByRole("button", { name: "Muur", exact: true }).click();
    // Keyboard places walls on every cell around S=31: up 21, right 32, down 41, left 30.
    for (const cell of [21, 32, 41, 30]) {
      await cells.nth(cell).focus();
      await page.keyboard.press("Enter");
    }
    await page
      .getByRole("button", { name: "Start zoeken", exact: true })
      .click();
    await page.waitForFunction(() =>
      document
        .querySelector(".game-feedback")
        ?.textContent.includes("Geen route"),
    );
    check("BFS clearly reports an unreachable end");
    await page.keyboard.press("Escape");
    check(
      "Escape closes panel and restores focus",
      (await page.locator("dialog").count()) === 0 &&
        (await page
          .getByRole("button", { name: "Open het lab" })
          .evaluate((node) => node === document.activeElement)),
    );

    // A full actual UI round, including drag input and closing/resuming a rolling ball.
    await page.getByRole("button", { name: /Een rondje minigolf/ }).click();
    await page.locator(".golf-course").waitFor();
    const surface = await page.locator(".golf-course").boundingBox();
    await page.mouse.move(
      surface.x + (75 / 600) * surface.width,
      surface.y + surface.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      surface.x + ((75 - 95 * 1.8) / 600) * surface.width,
      surface.y + surface.height / 2,
      { steps: 8 },
    );
    check(
      "golf drag previews power",
      (
        await page.locator(".golf-controls output").last().textContent()
      ).includes("95"),
    );
    await page.mouse.up();
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: /Een rondje minigolf/ }).click();
    await page.waitForFunction(
      () =>
        document.querySelector(".game-feedback")?.textContent.includes("Raak"),
      { timeout: 10000 },
    );
    check("golf closes and resumes same shot, then sinks");
    await page.getByRole("button", { name: "Volgende hole" }).click();
    const routes = [
      [
        { x: 100, y: 95 },
        { x: 330, y: 95 },
        { x: 330, y: 270 },
        { x: 510, y: 270 },
        { x: 530, y: 75 },
      ],
      [
        { x: 95, y: 80 },
        { x: 245, y: 80 },
        { x: 245, y: 255 },
        { x: 380, y: 255 },
        { x: 380, y: 70 },
        { x: 535, y: 65 },
      ],
    ];
    for (let h = 1; h <= 2; h++) {
      for (const target of routes[h - 1]) {
        if (
          (await page.locator(".game-feedback").textContent()).includes("Raak")
        )
          break;
        const live = await page
          .locator(".golf-course > circle")
          .last()
          .evaluate((node) => ({
            x: Number(node.getAttribute("cx")),
            y: Number(node.getAttribute("cy")),
            vx: 0,
            vy: 0,
            sunk: false,
          }));
        const angle = Math.round(
          (Math.atan2(target.y - live.y, target.x - live.x) * 180) / Math.PI,
        );
        let power = 1,
          error = Infinity;
        for (let p = 1; p <= 100; p++) {
          let trial = strike(live, angle, p);
          for (let n = 0; n < 1500 && moving(trial); n++)
            trial = stepBall(trial, holes[h], 1 / 120);
          const distance = Math.hypot(trial.x - target.x, trial.y - target.y);
          if (distance < error) {
            power = p;
            error = distance;
          }
        }
        console.log(
          `GOLF hole ${h + 1}: ball ${Math.round(live.x)},${Math.round(live.y)} → ${target.x},${target.y} angle=${angle} power=${power}`,
        );
        await setRange(page, "Richting", angle);
        await setRange(page, "Kracht", power);
        await page.getByRole("button", { name: /^Slaan/ }).focus();
        await page.keyboard.press("Space");
        await page.waitForFunction(
          () =>
            document
              .querySelector(".game-feedback")
              ?.textContent.includes("Raak") ||
            (document.querySelector(".golf-controls .button") &&
              !document.querySelector(".golf-controls .button").disabled),
        );
      }
      check(
        `actual UI completes golf hole ${h + 1}`,
        (await page.locator(".game-feedback").textContent()).includes("Raak"),
      );
      await page.screenshot({
        path: `${output}/desktop-golf-hole-${h + 1}.png`,
      });
      await page
        .getByRole("button", {
          name: h === 2 ? "Eindresultaat" : "Volgende hole",
        })
        .click();
    }
    check(
      "full golf result and local record",
      (await page.locator(".game-feedback").textContent()).includes(
        "Ronde voltooid",
      ) &&
        JSON.parse(
          await page.evaluate(() =>
            localStorage.getItem("portfolio-discoveries-v1"),
          ),
        ).golfBest > 0,
    );
    await page.getByRole("button", { name: "Nieuwe ronde" }).click();
    await page.getByRole("button", { name: "Bal terug (+1)" }).click();
    check(
      "ball recovery adds a penalty",
      (await page.locator(".game-feedback").textContent()).includes(
        "+1 strafslag",
      ),
    );
    await page.getByRole("button", { name: "Hole opnieuw" }).click();
    check(
      "retry hole clears strokes",
      (await page.locator(".game-stats strong").nth(2).textContent()) === "0",
    );
    await close(page);

    await page.locator("#discovery-initials").focus();
    for (const key of [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ])
      await page.keyboard.press(key);
    await page.locator(".reaction-target").waitFor();
    check("Konami unlocks Arcade");
    await page.getByRole("button", { name: "Start reactietest" }).click();
    await page.locator(".reaction-target").click();
    check(
      "reaction test rejects early taps",
      (await page.locator(".game-feedback").textContent()).includes(
        "Geen score",
      ),
    );
    await page.locator(".reaction-target").click();
    await page.locator(".reaction-target.phase-ready").waitFor();
    await page.locator(".reaction-target").focus();
    await page.keyboard.press("Enter");
    check(
      "reaction test returns result and stores record",
      (await page.locator(".game-feedback").textContent()).includes("ms") &&
        JSON.parse(
          await page.evaluate(() =>
            localStorage.getItem("portfolio-discoveries-v1"),
          ),
        ).reactionBest > 0,
    );
    await page.getByRole("button", { name: /Retro-uitstraling/ }).click();
    check(
      "optional retro mode enabled",
      await page
        .locator("html")
        .evaluate((node) => node.classList.contains("arcade-retro")),
    );
    await page.screenshot({ path: `${output}/desktop-arcade.png` });
    await page.getByRole("button", { name: "Arcade uitschakelen" }).click();
    check(
      "Arcade disables and clears retro mode",
      (await page.locator("dialog").count()) === 0 &&
        !(await page
          .locator("html")
          .evaluate((node) => node.classList.contains("arcade-retro"))),
    );
    await openBook(page);
    check(
      "all seven discoveries tracked",
      (await page.locator(".book-progress").textContent()).includes("7 / 7"),
    );
    await page.getByRole("button", { name: /Rustige weergave/ }).click();
    check(
      "calm view enabled",
      await page
        .locator("html")
        .evaluate((node) => node.classList.contains("discovery-quiet")),
    );
    for (let i = 0; i < 24; i++) await page.keyboard.press("Tab");
    check(
      "dialog traps keyboard focus",
      await page
        .locator("dialog")
        .evaluate((node) => node.contains(document.activeElement)),
    );
    await page.screenshot({ path: `${output}/desktop-book.png` });
    await close(page);
    await page.reload();
    await openBook(page);
    check(
      "discovery progress persists after reload",
      (await page.locator(".book-progress").textContent()).includes("7 / 7"),
    );
    await page
      .getByRole("button", { name: "Voortgang en records wissen" })
      .click();
    await page.getByRole("button", { name: "Ja, wissen" }).click();
    check(
      "reset clears progress and records",
      (await page.locator(".book-progress").textContent()).includes("0 / 7") &&
        JSON.parse(
          await page.evaluate(() =>
            localStorage.getItem("portfolio-discoveries-v1"),
          ),
        ).golfBest === null,
    );
    await close(page);
    // Inserting a real input verifies that secret input does not act while typing.
    await page.evaluate(() => {
      const input = document.createElement("input");
      input.id = "qa-input";
      document.body.append(input);
      input.focus();
    });
    for (const key of [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ])
      await page.keyboard.press(key);
    check(
      "Konami ignored while typing",
      (await page.locator("dialog").count()) === 0,
    );
    await page.evaluate(() => document.getElementById("qa-input").remove());
    await page.getByRole("button", { name: "Switch to English" }).click();
    await page.locator(".theme-button").click();
    check(
      "EN/light switch",
      (await page.locator("html").getAttribute("lang")) === "en" &&
        (await page.locator("html").getAttribute("data-theme")) === "light",
    );
    await page.getByRole("button", { name: "Open the lab" }).click();
    await page.locator(".path-grid").waitFor();
    await page.screenshot({ path: `${output}/desktop-lab-light-en.png` });
    await close(page);
    await context.close();
  }

  for (const width of [320, 390]) {
    const mobile = await browser.newContext({
      viewport: { width, height: 844 },
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
    });
    const p = await mobile.newPage();
    monitor(p);
    await p.goto(url);
    await p.locator(".discovery-book-button").waitFor();
    await fits(p, `mobile ${width}px portfolio has no horizontal overflow`);
    for (let i = 0; i < 5; i++) await p.locator("#discovery-initials").tap();
    await p.locator(".reaction-target").waitFor();
    check(`mobile ${width}px five logo taps unlock Arcade`);
    await fits(p, `mobile ${width}px Arcade fits with visible close button`);
    await close(p);
    await p.getByRole("button", { name: "Open het lab" }).tap();
    await p.locator(".path-grid").waitFor();
    await fits(p, `mobile ${width}px lab fits`);
    const client = await mobile.newCDPSession(p);
    const board = await p.locator(".path-grid").boundingBox();
    const touch = async (type, x, y) =>
      client.send("Input.dispatchTouchEvent", {
        type,
        touchPoints: type === "touchEnd" ? [] : [{ x, y, id: 1 }],
      });
    await touch(
      "touchStart",
      board.x + board.width * 0.25,
      board.y + board.height * 0.0625,
    );
    for (let x = 0.35; x <= 0.75; x += 0.1)
      await touch(
        "touchMove",
        board.x + board.width * x,
        board.y + board.height * 0.0625,
      );
    await touch("touchEnd", 0, 0);
    const walls = await p.locator(".path-cell.is-wall").count();
    check(`mobile ${width}px touch draws walls`, walls >= 4);
    await p.getByRole("button", { name: "Wissen", exact: true }).tap();
    await touch(
      "touchStart",
      board.x + board.width * 0.25,
      board.y + board.height * 0.0625,
    );
    await touch("touchEnd", 0, 0);
    check(
      `mobile ${width}px touch erases walls`,
      (await p.locator(".path-cell.is-wall").count()) < walls,
    );
    await p.screenshot({ path: `${output}/mobile-${width}-lab.png` });
    await close(p);
    await p.getByRole("button", { name: /Een rondje minigolf/ }).click();
    await p.locator(".golf-course").waitFor();
    await fits(p, `mobile ${width}px golf fits`);
    const course = await p.locator(".golf-course").boundingBox();
    await touch(
      "touchStart",
      course.x + (course.width * 75) / 600,
      course.y + course.height / 2,
    );
    await touch(
      "touchMove",
      course.x + (course.width * 3) / 600,
      course.y + course.height / 2,
    );
    await touch("touchEnd", 0, 0);
    check(
      `mobile ${width}px touch shoots ball`,
      (await p.locator(".game-stats strong").nth(2).textContent()) === "1",
    );
    await p.setViewportSize({ width: 844, height: width });
    await fits(p, `mobile rotated ${width}px golf panel fits`);
    await p.screenshot({
      path: `${output}/mobile-${width}-landscape-golf.png`,
    });
    await close(p);
    await p.setViewportSize({ width, height: 844 });
    await p.getByRole("button", { name: "Switch to English" }).click();
    await p.locator(".theme-button").click();
    await openBook(p);
    await p.locator("summary").click();
    await p.getByRole("button", { name: "Secret Arcade", exact: true }).click();
    await p.locator(".reaction-target").waitFor();
    check(
      `mobile ${width}px focus stays inside the newly opened game`,
      await p
        .locator("dialog")
        .evaluate((node) => node.contains(document.activeElement)),
    );
    check(
      `mobile ${width}px accessible Arcade alternative works in EN/light/reduced motion`,
    );
    await p.screenshot({
      path: `${output}/mobile-${width}-arcade-light-en.png`,
    });
    await close(p);
    await mobile.close();
  }
  for (const corrupt of [true, false]) {
    const fallback = await browser.newContext();
    await fallback.addInitScript((blocked) => {
      if (blocked)
        Object.defineProperty(window, "localStorage", {
          get() {
            throw new DOMException("Blocked", "SecurityError");
          },
        });
      else localStorage.setItem("portfolio-discoveries-v1", "{broken");
    }, corrupt);
    const p = await fallback.newPage();
    monitor(p);
    await p.goto(url);
    await p.locator("#discovery-initials").click();
    await openBook(p);
    check(
      corrupt
        ? "blocked localStorage still supports discovery state"
        : "corrupt localStorage safely recovers",
      (await p.locator(".book-progress").textContent()).includes("1 / 7"),
    );
    await fallback.close();
  }
  check("static site has no runtime or console errors", errors.length === 0);
  const report = {
    checks,
    errors,
    screenshots: output,
    browser: browser.version(),
    section: process.env.QA_SECTION || "all",
  };
  writeFileSync(
    `${output}/report-${report.section}.json`,
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  console.error(error);
  const page = browser
    .contexts()
    .flatMap((context) => context.pages())
    .at(-1);
  if (page) {
    await page.screenshot({ path: `${output}/failure.png` });
    if (await page.locator("dialog").count())
      console.log(await page.locator("dialog").textContent());
  }
  throw error;
} finally {
  await browser.close();
}
