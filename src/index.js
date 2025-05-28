// @ts-check

import path from "node:path";

import { chromium } from "playwright";

import { open, pressRun, pasteText } from "./msxpen.js";
import { getTimeString } from "./util.js";
import {
  exportDiskA,
  init,
  inputText,
  isDiskABusy,
  loadDiskA,
  pressStop,
  removeDiskA,
  sanitizeLines,
  selectMSXJapanNTSC,
} from "./webmsx.js";

/**
 * @param {[string, string][]} files array of [content, msxPath]
 * @param {string} proofDir expect absolute path
 * @param {string} output expect absolute path
 * @param {boolean} headless
 */
export async function createDsk(files, proofDir, output, headless) {
  const browser = await chromium.launch({ headless });
  try {
    const msxpen = await open(browser);
    await msxpen.waitForTimeout(5_000);

    /**
     * @template T
     * @param {Promise<T>} promise
     * @param {number} wait
     */
    const $ = async (promise, wait) => {
      const ret = await promise;
      await msxpen.waitForTimeout(wait);
      return ret;
    };

    await $(selectMSXJapanNTSC(msxpen), 2_500);
    while (await isDiskABusy(msxpen)) {
      await msxpen.waitForTimeout(500);
    }
    let prevDisk = path.join(proofDir, `${getTimeString()}.dsk`);
    await $(exportDiskA(msxpen, prevDisk), 5_000);

    for (let i = 0; i < files.length; i++) {
      const [content, msxPath] = files[i];

      await $(msxpen.reload(), 2_500);
      while (await isDiskABusy(msxpen)) {
        await msxpen.waitForTimeout(500);
      }
      await $(init(msxpen), 5_000);

      await $(pasteText(msxpen, content), 5_000);
      await $(pressRun(msxpen), 2_500);
      while (await isDiskABusy(msxpen)) {
        await msxpen.waitForTimeout(500);
      }
      await $(pressStop(msxpen), 5_000);
      await $(removeDiskA(msxpen), 5_000);
      // FIXME: たまに失敗する。原因不明
      try {
        await $(loadDiskA(msxpen, prevDisk), 5_000);
      } catch (e) {
        console.error(`TIMEOUT: ${msxPath}`);
        i--;
        continue;
      }

      // 終了した位置がX=0でないと実行できないのでは……
      // CLSと複数回実行でごまかす
      const safeInput = sanitizeLines(["CLS", "CLS", `SAVE "${msxPath}"`, ""]);
      for (let j = 0; j < 2; j++) {
        await $(inputText(msxpen, safeInput, { proofDir }), 2_500);
        while (await isDiskABusy(msxpen)) {
          await msxpen.waitForTimeout(500);
        }
      }
      prevDisk = path.join(proofDir, `${getTimeString()}.dsk`);
      await $(exportDiskA(msxpen, prevDisk), 5_000);
      console.log(`OK: ${msxPath}`);
    }
    await $(exportDiskA(msxpen, output), 5_000);
  } finally {
    browser.close();
  }
}
