import { expect, test } from "@playwright/test";

const origin = "http://localhost:5173";
const apk =
  "https://github.com/tilawatify-app/Tilawatifyapp/releases/download/v1.0.0/Tilawatify.apk";
const paths = ["/", "/features", "/reciters", "/pro", "/download"];

test("all five pages render with exact official download links", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const path of paths) {
    await page.goto(origin + path);
    await expect(page.locator("main h1")).toBeVisible();
    const downloads = page.locator("a.button-primary");
    expect(await downloads.count()).toBeGreaterThanOrEqual(2);
    for (const link of await downloads.all())
      await expect(link).toHaveAttribute("href", apk);
    await expect(page.locator(".site-header .logo img")).toHaveJSProperty(
      "naturalWidth",
      1254,
    );
  }
  expect(errors).toEqual([]);
});

test("navigation transitions work across all pages", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(origin);
  for (const path of ["/features", "/reciters", "/pro", "/download", "/"]) {
    await page
      .getByRole("navigation", { name: "Main navigation", exact: true })
      .locator(`a[href="${path}"]`)
      .click();
    await expect(page).toHaveURL(origin + path);
    await expect(page.locator("main h1")).toBeVisible();
  }
});

test("reciter search, filters, favourites and accessible modal work", async ({
  page,
}) => {
  await page.goto(origin + "/reciters");
  await expect(page.locator(".reciter-card")).toHaveCount(7);
  await page.getByRole("button", { name: "Melodic", exact: true }).click();
  await expect(page.locator(".reciter-card")).toHaveCount(2);
  await page.getByRole("button", { name: "All voices", exact: true }).click();
  await page
    .getByRole("searchbox", { name: "Search reciters" })
    .fill("Mishary");
  await expect(page.locator(".reciter-card")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Save Mishary Rashid Alafasy", exact: true })
    .click();
  await page.getByRole("button", { name: "Saved voices", exact: true }).click();
  await expect(page.locator(".reciter-card")).toHaveCount(1);
  await page
    .getByRole("button", {
      name: "Explore Mishary Rashid Alafasy",
      exact: true,
    })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page
      .getByRole("dialog")
      .getByRole("heading", { name: "Mishary Rashid Alafasy" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("button", {
      name: "Unsave Mishary Rashid Alafasy",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("searchbox", { name: "Search reciters" })
    .fill("unknown name");
  await expect(
    page.getByRole("heading", { name: "No voices found, just yet." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Explore all voices" }).click();
  await expect(page.locator(".reciter-card")).toHaveCount(7);
});

test("feature explorer supports interactive tracker, playlists and theme", async ({
  page,
}) => {
  await page.goto(origin + "/features");
  await page.getByRole("tab", { name: /A journey/ }).click();
  await expect(page.locator(".hifz-demo-progress strong")).toContainText("1");
  await page.getByRole("button", { name: /113 Al-Falaq/ }).click();
  await expect(page.locator(".hifz-demo-progress strong")).toContainText("2");
  await page.getByRole("tab", { name: /listening space/ }).click();
  await page.getByRole("button", { name: "Try naming your playlist" }).click();
  await page
    .getByRole("textbox", { name: "Preview playlist name" })
    .fill("Morning reflections");
  await page
    .getByRole("button", { name: "Save preview playlist name" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Morning reflections" }),
  ).toBeVisible();
  await page.getByRole("tab", { name: /Less distraction/ }).click();
  await page.getByRole("button", { name: "Compare a light interface" }).click();
  await expect(page.locator(".midnight-preview")).toHaveClass(/day/);
  await page.getByRole("tab", { name: /Your peace/ }).click();
  await page.getByRole("button", { name: /Connected. Ready/ }).click();
  await expect(
    page.getByRole("button", { name: /You are offline/ }),
  ).toBeVisible();
});

test("Pro walkthrough and download installation guide respond", async ({
  page,
}) => {
  await page.goto(origin + "/pro");
  await page.getByRole("button", { name: /03 Redeem. Reconnect/ }).click();
  await expect(
    page.getByRole("heading", { name: "Unlock your Pro." }),
  ).toBeVisible();
  await page.goto(origin + "/download");
  await page
    .getByRole("button", { name: "Release details & file verification" })
    .click();
  await expect(page.locator(".checksum-value code")).toHaveText(
    "336f62d0032e9be0db0274eddf148141a30abcc07c40eafd016636052e64247e",
  );
  await page.getByRole("button", { name: /02 ALLOW THIS SOURCE/ }).click();
  await expect(
    page.getByText("A quick note about Android security."),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Is Tilawatify available on iPhone?" })
    .click();
  await expect(
    page.getByText(/This release is for Android only/),
  ).toBeVisible();
});

test("all pages fit desktop, tablet and mobile viewports", async ({ page }) => {
  for (const width of [1440, 900, 768, 390, 360]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of paths) {
      await page.goto(origin + path);
      await expect(page.locator("main h1")).toBeVisible();
      await page.waitForTimeout(350);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        `${path} at ${width}px`,
      ).toBeTruthy();
    }
  }
});

test("mobile menu routes and closes correctly", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin);
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const navigation = page.getByRole("navigation", {
    name: "Mobile navigation",
    exact: true,
  });
  await expect(navigation).toBeVisible();
  await navigation.getByRole("link", { name: /Reciters/ }).click();
  await expect(page).toHaveURL(origin + "/reciters");
  await expect(navigation).not.toBeVisible();
  await expect(page.locator("main h1")).toBeVisible();
});

test("real recitation audio plays and player controls work", async ({
  page,
}) => {
  await page.goto(origin + "/reciters");
  await page
    .getByRole("button", {
      name: "Play Al-Fatihah by Mishary Rashid Alafasy",
      exact: true,
    })
    .click();
  await expect
    .poll(
      async () => page.locator("audio").evaluate((audio) => audio.currentTime),
      { timeout: 30000 },
    )
    .toBeGreaterThan(0);
  await page
    .getByRole("button", { name: "Pause recitation", exact: true })
    .click();
  await expect(page.locator("audio")).toHaveJSProperty("paused", true);
  await page
    .getByRole("button", { name: "Mute recitation", exact: true })
    .click();
  await expect(page.locator("audio")).toHaveJSProperty("muted", true);
  await page.getByRole("button", { name: "Close audio player" }).click();
  await expect(
    page.getByRole("complementary", { name: "Recitation preview player" }),
  ).not.toBeVisible();
});

test("audio failures show a helpful fallback instead of a stuck loader", async ({
  page,
}) => {
  await page.route("https://cdn.mp3quran.net/**", (route) =>
    route.abort("failed"),
  );
  await page.goto(origin + "/reciters");
  await page
    .getByRole("button", {
      name: "Play Al-Fatihah by Mishary Rashid Alafasy",
      exact: true,
    })
    .click();
  await expect(page.locator(".player-error")).toHaveText(
    "This preview could not load. Please try again or listen in the app.",
  );
  await expect(page.locator(".player-play .spin")).not.toBeVisible();
});

test("reduced-motion preference disables ambient and phone animations", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(origin);
  const duration = await page
    .locator(".phone-float")
    .evaluate((phone) => getComputedStyle(phone).animationDuration);
  expect(duration).toBe("1e-05s");
});

test("top Qaris section displays Meet our top Qari Quran with Sudais, Maher, and Yasser", async ({
  page,
}) => {
  await page.goto(origin);
  const section = page.locator("#top-qaris");
  await expect(section.locator("h2")).toContainText("Meet our top");
  await expect(section.locator("h2")).toContainText("Qari Quran.");
  const cards = section.locator(".featured-reciter h3");
  await expect(cards).toHaveCount(3);
  await expect(cards.nth(0)).toHaveText("Qari Sudais");
  await expect(cards.nth(1)).toHaveText("Qari Maher");
  await expect(cards.nth(2)).toHaveText("Qari Yasser");
});

test("Pro Plan hides redeem code by default, enforces secret rule, applies Tilawatify10, and unlocks Pro", async ({
  page,
}) => {
  await page.goto(origin + "/pro");
  // No redeem code input or promo code shown by default
  await expect(page.getByRole("textbox", { name: "Redeem code" })).toHaveCount(
    0,
  );
  await expect(page.locator("body")).not.toContainText("Tilawatify10");
  await expect(page.locator("body")).not.toContainText("TILAWATIFYPRO0");

  // Open Pro Plan card
  await page.getByRole("button", { name: /View Pro Plan/i }).first().click();
  const card = page.locator(".pro-plan-card");
  await expect(card).toBeVisible();
  await expect(card).toContainText("500 per month");
  await expect(card).toContainText("Audio downloads included");
  await expect(card).toContainText("or redeem code");
  await expect(card).toContainText("redeem code for 10 percent off");
  await expect(card).toContainText("Tilawatify10");

  // Strict secret rule: never visible anywhere in DOM text or input attributes
  const bodyHtml = await page.locator("main").innerHTML();
  expect(bodyHtml.toUpperCase()).not.toContain("TILAWATIFYPRO0");

  // Apply 10% off code
  await page.getByRole("textbox", { name: "Redeem code" }).fill("Tilawatify10");
  await page.getByRole("button", { name: "Apply Code" }).click();
  await expect(card).toContainText("450 per month");
  await expect(card).toContainText("10% off applied");

  // Invalid code reveals no secret hint
  await page.getByRole("textbox", { name: "Redeem code" }).fill("WRONG123");
  await page.getByRole("button", { name: "Apply Code" }).click();
  await expect(card.locator(".pro-redeem-feedback")).toContainText(
    "Invalid code",
  );
  expect((await card.innerText()).toUpperCase()).not.toContain(
    "TILAWATIFYPRO0",
  );

  // Unlock Pro with secret code
  await page
    .getByRole("textbox", { name: "Redeem code" })
    .fill("TILAWATIFYPRO0");
  await page.getByRole("button", { name: "Apply Code" }).click();
  await expect(card).toContainText("Pro Active");
  await expect(card).toContainText("Your Tilawatify Pro membership is active.");
});

test("free audio player locks seeking & rewinding and unlocks after Pro redeem", async ({
  page,
}) => {
  await page.goto(origin + "/reciters");
  await page
    .getByRole("button", {
      name: "Play Al-Fatihah by Mishary Rashid Alafasy",
      exact: true,
    })
    .click();
  await expect
    .poll(
      async () => page.locator("audio").evaluate((audio) => audio.currentTime),
      { timeout: 30000 },
    )
    .toBeGreaterThan(0);

  // Try clicking forward/rewind while Free -> shows Pro prompt
  await page.getByRole("button", { name: /Forward locked/i }).click();
  await expect(page.locator(".player-lock-prompt")).toBeVisible();
  await expect(page.locator(".player-lock-prompt")).toContainText(
    "500 per month",
  );

  // Open Pro modal right from the audio lock prompt and unlock Pro
  await page
    .locator(".player-lock-prompt")
    .getByRole("button", { name: /View Pro Plan/i })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("textbox", { name: "Redeem code" }).fill(
    "TILAWATIFYPRO0",
  );
  await dialog.getByRole("button", { name: "Apply Code" }).click();
  await expect(dialog).toContainText("Pro Active");
  await page.keyboard.press("Escape");

  // Now forward 10s works freely!
  const before = await page
    .locator("audio")
    .evaluate((audio) => audio.currentTime);
  await page.getByRole("button", { name: "Forward 10 seconds" }).click();
  await expect
    .poll(
      async () => page.locator("audio").evaluate((audio) => audio.currentTime),
      { timeout: 10000 },
    )
    .toBeGreaterThan(before + 5);
});

test("live download counter increments on click and persists across reload", async ({
  page,
}) => {
  // Mock counter endpoint so tests stay deterministic and don't pollute live production stats
  let mockRemoteCount = 42;
  await page.route("https://countapi.mileshilliard.com/api/v1/**", (route) => {
    const url = route.request().url();
    if (url.includes("/hit/")) {
      mockRemoteCount += 1;
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        key: "tilawatify_app_total_downloads_permanent",
        value: mockRemoteCount,
      }),
    });
  });

  await page.goto(origin + "/download");
  const counter = page
    .locator('[data-testid="live-download-counter"] strong')
    .first();
  await expect(counter).toHaveText("42");

  // Prevent browser navigation to APK binary during click assertion while keeping onclick firing
  await page.locator("a.download-main-button").evaluate((el) => {
    el.addEventListener("click", (e) => e.preventDefault());
  });
  await page.locator("a.download-main-button").click();
  await expect(counter).toHaveText("43");

  await page.reload();
  await expect(counter).toHaveText("43");
});
