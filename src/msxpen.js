// @ts-check

const msxpenBrand = Symbol();
/**
 * @typedef {import("./webmsx.js").WebMSXPage&{[msxpenBrand]:unknown}} MSXPenPage
 */

/**
 * @param {import("playwright").Browser} browser
 * @returns {Promise<MSXPenPage>}
 */
export async function open(browser) {
  const context = await browser.newContext();
  await context.grantPermissions(["clipboard-write"]);
  /** @type {MSXPenPage} */
  // @ts-ignore
  const msxpen = await context.newPage();
  await msxpen.goto("https://msxpen.com/");
  return msxpen;
}

/**
 * @param {import("playwright").Page} page
 * @param {string} text
 */
async function setClipboard(page, text) {
  await page.evaluate((text) => navigator.clipboard.writeText(text), text);
}

/**
 * @param {import("playwright").Locator} locator
 * @param {string} text
 */
async function pasteText_(locator, text) {
  await setClipboard(locator.page(), text);
  await locator.click();
  await locator.page().waitForTimeout(50);
  await locator.press("Control+V", { delay: 50 });
  await locator.page().waitForTimeout(50);
}

/**
 * @param {MSXPenPage} page
 * @param {string} text
 */
export async function pasteText(page, text) {
  const codeEditor = page.locator(".CodeMirror").first();
  await pasteText_(codeEditor, text);
}

/**
 * @param {MSXPenPage} msxpen
 */
export async function pressRun(msxpen) {
  await msxpen.locator(".btn-full").first().click();
  await msxpen.waitForTimeout(50);
}
