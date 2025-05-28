#!/usr/bin/env node
// @ts-check

import fs from "node:fs";
import path from "node:path";
import util from "node:util";

import Ajv from "ajv";
import { createDsk } from "./index.js";

const {
  values: { config: configPath_ },
} = util.parseArgs({
  options: {
    config: {
      type: "string",
      short: "c",
      default: "create-dsk.config.json",
    },
  },
});

const configPath = path.resolve(configPath_);
const configDir = path.dirname(configPath);
const configContent = fs.readFileSync(configPath, { encoding: "utf-8" });
const configObj = JSON.parse(configContent);

/**
 * @typedef {{
 *   files: [string, string][];
 *   proofDir: string;
 *   output: string;
 *   headless: boolean;
 * }} Config
 * @type {import("ajv").JSONSchemaType<Config>}
 */
const configSchema = {
  type: "object",
  required: ["files", "proofDir", "output", "headless"],
  properties: {
    files: {
      type: "array",
      minItems: 1,
      items: {
        type: "array",
        minItems: 2,
        additionalItems: false,
        items: [{ type: "string" }, { type: "string" }],
      },
    },
    proofDir: { type: "string" },
    output: { type: "string" },
    headless: { type: "boolean" },
  },
  additionalProperties: false,
};
const ajv = new Ajv();
const configValidator = ajv.compile(configSchema);
if (!configValidator(configObj)) {
  throw configValidator.errors;
}
const {
  files: files_,
  proofDir: proofDir_,
  output: output_,
  headless,
} = configObj;
const files = files_.map(
  ([filePath, msxPath]) =>
    /** @type {[string, string]} */ ([
      fs.readFileSync(path.resolve(configDir, filePath), { encoding: "utf-8" }),
      msxPath,
    ]),
);

const proofDir = path.resolve(configDir, proofDir_);
if (!fs.existsSync(proofDir)) {
  fs.mkdirSync(proofDir, { recursive: true });
}

const output = path.resolve(configDir, output_);

await createDsk(files, proofDir, output, headless);
