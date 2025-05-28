// @ts-check

import { Jimp, intToRGBA } from "jimp";

import { getTimeString } from "./util.js";

// NOTE: https://qiita.com/uhyo/items/de4cb2085fdbdf484b83
const webmsxBrand = Symbol();
/**
 * @typedef {import("playwright").Page&{[webmsxBrand]:unknown}} WebMSXPage
 */

const KEY_KANA = "AltRight";
const KEY_CAPS = "CapsLock";
const KEY_GRAPH = "PageUp";

const REMAPPED_KEY_JIS_YEN = "Home";
const REMAPPED_KEY_JIS_BRACKET_RIGHT = "Insert";
const REMAPPED_KEY_JIS_BACKSLASH = "End";

/**
 * https://note.com/kazushinakamura/n/n8b09bf680b32
 *
 * @typedef {"Space"|"Digit1"|"Digit2"|"Digit3"|"Digit4"|"Digit5"|"Digit6"|"Digit7"|"Digit8"|"Digit9"|"Digit0"|"Minus"|"Equal"|typeof REMAPPED_KEY_JIS_YEN|"KeyQ"|"KeyW"|"KeyE"|"KeyR"|"KeyT"|"KeyY"|"KeyU"|"KeyI"|"KeyO"|"KeyP"|"BracketLeft"|"BracketRight"|"KeyA"|"KeyS"|"KeyD"|"KeyF"|"KeyG"|"KeyH"|"KeyJ"|"KeyK"|"KeyL"|"Semicolon"|"Quote"|typeof REMAPPED_KEY_JIS_BRACKET_RIGHT|"KeyZ"|"KeyX"|"KeyC"|"KeyV"|"KeyB"|"KeyN"|"KeyM"|"Comma"|"Period"|"Slash"|typeof REMAPPED_KEY_JIS_BACKSLASH} KeyInput
 * @typedef {' '|'0'|'1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'|'-'|'^'|'\\'|'q'|'w'|'e'|'r'|'t'|'y'|'u'|'i'|'o'|'p'|'@'|'['|'a'|'s'|'d'|'f'|'g'|'h'|'j'|'k'|'l'|';'|':'|']'|'z'|'x'|'c'|'v'|'b'|'n'|'m'|','|'.'|'/'|'!'|'"'|'#'|'$'|'%'|'&'|"'"|'('|')'|'='|'~'|'|'|'Q'|'W'|'E'|'R'|'T'|'Y'|'U'|'I'|'O'|'P'|'`'|'{'|'A'|'S'|'D'|'F'|'G'|'H'|'J'|'K'|'L'|'+'|'*'|'}'|'Z'|'X'|'C'|'V'|'B'|'N'|'M'|'<'|'>'|'?'|'_'|'日'|'月'|'火'|'水'|'木'|'金'|'土'|'百'|'千'|'万'|'─'|'円'|'┌'|'┬'|'┐'|'年'|'│'|'π'|'○'|'秒'|'├'|'┼'|'┤'|'時'|'中'|'♣'|'♥'|'●'|'╳'|'└'|'┴'|'┘'|'分'|'小'|'大'|'♠'|'♦'|'ぬ'|'ふ'|'あ'|'う'|'え'|'お'|'や'|'ゆ'|'よ'|'わ'|'ほ'|'へ'|'ー'|'た'|'て'|'い'|'す'|'か'|'ん'|'な'|'に'|'ら'|'せ'|'゛'|'゜'|'ち'|'と'|'し'|'は'|'き'|'く'|'ま'|'の'|'り'|'れ'|'け'|'む'|'つ'|'さ'|'そ'|'ひ'|'こ'|'み'|'も'|'ね'|'る'|'め'|'ろ'|'ぁ'|'ぅ'|'ぇ'|'ぉ'|'ゃ'|'ゅ'|'ょ'|'を'|'ぃ'|'「'|'」'|'っ'|'、'|'。'|'・'|'ヌ'|'フ'|'ア'|'ウ'|'エ'|'オ'|'ヤ'|'ユ'|'ヨ'|'ワ'|'ホ'|'ヘ'|'タ'|'テ'|'イ'|'ス'|'カ'|'ン'|'ナ'|'ニ'|'ラ'|'セ'|'チ'|'ト'|'シ'|'ハ'|'キ'|'ク'|'マ'|'ノ'|'リ'|'レ'|'ケ'|'ム'|'ツ'|'サ'|'ソ'|'ヒ'|'コ'|'ミ'|'モ'|'ネ'|'ル'|'メ'|'ロ'|'ァ'|'ゥ'|'ェ'|'ォ'|'ャ'|'ュ'|'ョ'|'ヲ'|'ィ'|'ッ'} AllowedChar
 * @type {Record<AllowedChar, { shift: boolean; graph: boolean; kana: boolean; caps: boolean; key: KeyInput }>}
 */
const KEY_MAPPING = {
  " ": {
    shift: false,
    graph: false,
    kana: false,
    caps: false,
    key: "Space",
  },
  1: {
    shift: false,
    graph: false,
    kana: false,
    caps: false,
    key: "Digit1",
  },
  2: {
    shift: false,
    graph: false,
    kana: false,
    caps: false,
    key: "Digit2",
  },
  3: {
    shift: false,
    graph: false,
    kana: false,
    caps: false,
    key: "Digit3",
  },
  4: {
    shift: false,
    graph: false,
    kana: false,
    caps: false,
    key: "Digit4",
  },
  5: {
    shift: false,
    graph: false,
    kana: false,
    caps: false,
    key: "Digit5",
  },
  6: {
    shift: false,
    graph: false,
    kana: false,
    caps: false,
    key: "Digit6",
  },
  7: {
    shift: false,
    graph: false,
    kana: false,
    caps: false,
    key: "Digit7",
  },
  8: {
    shift: false,
    graph: false,
    kana: false,
    caps: false,
    key: "Digit8",
  },
  9: {
    shift: false,
    graph: false,
    kana: false,
    caps: false,
    key: "Digit9",
  },
  0: {
    shift: false,
    graph: false,
    kana: false,
    caps: false,
    key: "Digit0",
  },
  "-": {
    shift: false,
    graph: false,
    kana: false,
    caps: false,
    key: "Minus",
  },
  "^": {
    shift: false,
    graph: false,
    kana: false,
    caps: false,
    key: "Equal",
  },
  "\\": {
    shift: false,
    graph: false,
    kana: false,
    caps: false,
    key: REMAPPED_KEY_JIS_YEN,
  },
  q: { shift: false, graph: false, kana: false, caps: false, key: "KeyQ" },
  w: { shift: false, graph: false, kana: false, caps: false, key: "KeyW" },
  e: { shift: false, graph: false, kana: false, caps: false, key: "KeyE" },
  r: { shift: false, graph: false, kana: false, caps: false, key: "KeyR" },
  t: { shift: false, graph: false, kana: false, caps: false, key: "KeyT" },
  y: { shift: false, graph: false, kana: false, caps: false, key: "KeyY" },
  u: { shift: false, graph: false, kana: false, caps: false, key: "KeyU" },
  i: { shift: false, graph: false, kana: false, caps: false, key: "KeyI" },
  o: { shift: false, graph: false, kana: false, caps: false, key: "KeyO" },
  p: { shift: false, graph: false, kana: false, caps: false, key: "KeyP" },
  "@": {
    shift: false,
    graph: false,
    kana: false,
    caps: false,
    key: "BracketLeft",
  },
  "[": {
    shift: false,
    graph: false,
    kana: false,
    caps: false,
    key: "BracketRight",
  },
  a: { shift: false, graph: false, kana: false, caps: false, key: "KeyA" },
  s: { shift: false, graph: false, kana: false, caps: false, key: "KeyS" },
  d: { shift: false, graph: false, kana: false, caps: false, key: "KeyD" },
  f: { shift: false, graph: false, kana: false, caps: false, key: "KeyF" },
  g: { shift: false, graph: false, kana: false, caps: false, key: "KeyG" },
  h: { shift: false, graph: false, kana: false, caps: false, key: "KeyH" },
  j: { shift: false, graph: false, kana: false, caps: false, key: "KeyJ" },
  k: { shift: false, graph: false, kana: false, caps: false, key: "KeyK" },
  l: { shift: false, graph: false, kana: false, caps: false, key: "KeyL" },
  ";": {
    shift: false,
    graph: false,
    kana: false,
    caps: false,
    key: "Semicolon",
  },
  ":": {
    shift: false,
    graph: false,
    kana: false,
    caps: false,
    key: "Quote",
  },
  "]": {
    shift: false,
    graph: false,
    kana: false,
    caps: false,
    key: REMAPPED_KEY_JIS_BRACKET_RIGHT,
  },
  z: { shift: false, graph: false, kana: false, caps: false, key: "KeyZ" },
  x: { shift: false, graph: false, kana: false, caps: false, key: "KeyX" },
  c: { shift: false, graph: false, kana: false, caps: false, key: "KeyC" },
  v: { shift: false, graph: false, kana: false, caps: false, key: "KeyV" },
  b: { shift: false, graph: false, kana: false, caps: false, key: "KeyB" },
  n: { shift: false, graph: false, kana: false, caps: false, key: "KeyN" },
  m: { shift: false, graph: false, kana: false, caps: false, key: "KeyM" },
  ",": {
    shift: false,
    graph: false,
    kana: false,
    caps: false,
    key: "Comma",
  },
  ".": {
    shift: false,
    graph: false,
    kana: false,
    caps: false,
    key: "Period",
  },
  "/": {
    shift: false,
    graph: false,
    kana: false,
    caps: false,
    key: "Slash",
  },
  "!": {
    shift: true,
    graph: false,
    kana: false,
    caps: false,
    key: "Digit1",
  },
  '"': {
    shift: true,
    graph: false,
    kana: false,
    caps: false,
    key: "Digit2",
  },
  "#": {
    shift: true,
    graph: false,
    kana: false,
    caps: false,
    key: "Digit3",
  },
  $: { shift: true, graph: false, kana: false, caps: false, key: "Digit4" },
  "%": {
    shift: true,
    graph: false,
    kana: false,
    caps: false,
    key: "Digit5",
  },
  "&": {
    shift: true,
    graph: false,
    kana: false,
    caps: false,
    key: "Digit6",
  },
  "'": {
    shift: true,
    graph: false,
    kana: false,
    caps: false,
    key: "Digit7",
  },
  "(": {
    shift: true,
    graph: false,
    kana: false,
    caps: false,
    key: "Digit8",
  },
  ")": {
    shift: true,
    graph: false,
    kana: false,
    caps: false,
    key: "Digit9",
  },
  "=": {
    shift: true,
    graph: false,
    kana: false,
    caps: false,
    key: "Minus",
  },
  "~": {
    shift: true,
    graph: false,
    kana: false,
    caps: false,
    key: "Equal",
  },
  "|": {
    shift: true,
    graph: false,
    kana: false,
    caps: false,
    key: REMAPPED_KEY_JIS_YEN,
  },
  Q: { shift: true, graph: false, kana: false, caps: false, key: "KeyQ" },
  W: { shift: true, graph: false, kana: false, caps: false, key: "KeyW" },
  E: { shift: true, graph: false, kana: false, caps: false, key: "KeyE" },
  R: { shift: true, graph: false, kana: false, caps: false, key: "KeyR" },
  T: { shift: true, graph: false, kana: false, caps: false, key: "KeyT" },
  Y: { shift: true, graph: false, kana: false, caps: false, key: "KeyY" },
  U: { shift: true, graph: false, kana: false, caps: false, key: "KeyU" },
  I: { shift: true, graph: false, kana: false, caps: false, key: "KeyI" },
  O: { shift: true, graph: false, kana: false, caps: false, key: "KeyO" },
  P: { shift: true, graph: false, kana: false, caps: false, key: "KeyP" },
  "`": {
    shift: true,
    graph: false,
    kana: false,
    caps: false,
    key: "BracketLeft",
  },
  "{": {
    shift: true,
    graph: false,
    kana: false,
    caps: false,
    key: "BracketRight",
  },
  A: { shift: true, graph: false, kana: false, caps: false, key: "KeyA" },
  S: { shift: true, graph: false, kana: false, caps: false, key: "KeyS" },
  D: { shift: true, graph: false, kana: false, caps: false, key: "KeyD" },
  F: { shift: true, graph: false, kana: false, caps: false, key: "KeyF" },
  G: { shift: true, graph: false, kana: false, caps: false, key: "KeyG" },
  H: { shift: true, graph: false, kana: false, caps: false, key: "KeyH" },
  J: { shift: true, graph: false, kana: false, caps: false, key: "KeyJ" },
  K: { shift: true, graph: false, kana: false, caps: false, key: "KeyK" },
  L: { shift: true, graph: false, kana: false, caps: false, key: "KeyL" },
  "+": {
    shift: true,
    graph: false,
    kana: false,
    caps: false,
    key: "Semicolon",
  },
  "*": {
    shift: true,
    graph: false,
    kana: false,
    caps: false,
    key: "Quote",
  },
  "}": {
    shift: true,
    graph: false,
    kana: false,
    caps: false,
    key: REMAPPED_KEY_JIS_BRACKET_RIGHT,
  },
  Z: { shift: true, graph: false, kana: false, caps: false, key: "KeyZ" },
  X: { shift: true, graph: false, kana: false, caps: false, key: "KeyX" },
  C: { shift: true, graph: false, kana: false, caps: false, key: "KeyC" },
  V: { shift: true, graph: false, kana: false, caps: false, key: "KeyV" },
  B: { shift: true, graph: false, kana: false, caps: false, key: "KeyB" },
  N: { shift: true, graph: false, kana: false, caps: false, key: "KeyN" },
  M: { shift: true, graph: false, kana: false, caps: false, key: "KeyM" },
  "<": {
    shift: true,
    graph: false,
    kana: false,
    caps: false,
    key: "Comma",
  },
  ">": {
    shift: true,
    graph: false,
    kana: false,
    caps: false,
    key: "Period",
  },
  "?": {
    shift: true,
    graph: false,
    kana: false,
    caps: false,
    key: "Slash",
  },
  _: {
    shift: true,
    graph: false,
    kana: false,
    caps: false,
    key: REMAPPED_KEY_JIS_BACKSLASH,
  },
  日: {
    shift: false,
    graph: true,
    kana: false,
    caps: false,
    key: "Digit1",
  },
  月: {
    shift: false,
    graph: true,
    kana: false,
    caps: false,
    key: "Digit2",
  },
  火: {
    shift: false,
    graph: true,
    kana: false,
    caps: false,
    key: "Digit3",
  },
  水: {
    shift: false,
    graph: true,
    kana: false,
    caps: false,
    key: "Digit4",
  },
  木: {
    shift: false,
    graph: true,
    kana: false,
    caps: false,
    key: "Digit5",
  },
  金: {
    shift: false,
    graph: true,
    kana: false,
    caps: false,
    key: "Digit6",
  },
  土: {
    shift: false,
    graph: true,
    kana: false,
    caps: false,
    key: "Digit7",
  },
  百: {
    shift: false,
    graph: true,
    kana: false,
    caps: false,
    key: "Digit8",
  },
  千: {
    shift: false,
    graph: true,
    kana: false,
    caps: false,
    key: "Digit9",
  },
  万: {
    shift: false,
    graph: true,
    kana: false,
    caps: false,
    key: "Digit0",
  },
  "─": {
    shift: false,
    graph: true,
    kana: false,
    caps: false,
    key: "Minus",
  },
  円: {
    shift: false,
    graph: true,
    kana: false,
    caps: false,
    key: REMAPPED_KEY_JIS_YEN,
  },
  "┌": { shift: false, graph: true, kana: false, caps: false, key: "KeyE" },
  "┬": { shift: false, graph: true, kana: false, caps: false, key: "KeyR" },
  "┐": { shift: false, graph: true, kana: false, caps: false, key: "KeyT" },
  年: { shift: false, graph: true, kana: false, caps: false, key: "KeyY" },
  "│": { shift: false, graph: true, kana: false, caps: false, key: "KeyI" },
  π: { shift: false, graph: true, kana: false, caps: false, key: "KeyP" },
  "○": {
    shift: false,
    graph: true,
    kana: false,
    caps: false,
    key: "BracketRight",
  },
  秒: { shift: false, graph: true, kana: false, caps: false, key: "KeyS" },
  "├": { shift: false, graph: true, kana: false, caps: false, key: "KeyD" },
  "┼": { shift: false, graph: true, kana: false, caps: false, key: "KeyF" },
  "┤": { shift: false, graph: true, kana: false, caps: false, key: "KeyG" },
  時: { shift: false, graph: true, kana: false, caps: false, key: "KeyH" },
  中: { shift: false, graph: true, kana: false, caps: false, key: "KeyL" },
  "♣": {
    shift: false,
    graph: true,
    kana: false,
    caps: false,
    key: "Semicolon",
  },
  "♥": {
    shift: false,
    graph: true,
    kana: false,
    caps: false,
    key: "Quote",
  },
  "●": {
    shift: false,
    graph: true,
    kana: false,
    caps: false,
    key: REMAPPED_KEY_JIS_BRACKET_RIGHT,
  },
  "╳": { shift: false, graph: true, kana: false, caps: false, key: "KeyX" },
  "└": { shift: false, graph: true, kana: false, caps: false, key: "KeyC" },
  "┴": { shift: false, graph: true, kana: false, caps: false, key: "KeyV" },
  "┘": { shift: false, graph: true, kana: false, caps: false, key: "KeyB" },
  分: { shift: false, graph: true, kana: false, caps: false, key: "KeyM" },
  小: { shift: false, graph: true, kana: false, caps: false, key: "Comma" },
  大: {
    shift: false,
    graph: true,
    kana: false,
    caps: false,
    key: "Period",
  },
  "♠": {
    shift: false,
    graph: true,
    kana: false,
    caps: false,
    key: "Slash",
  },
  "♦": {
    shift: false,
    graph: true,
    kana: false,
    caps: false,
    key: REMAPPED_KEY_JIS_BACKSLASH,
  },
  ぬ: {
    shift: false,
    graph: false,
    kana: true,
    caps: false,
    key: "Digit1",
  },
  ふ: {
    shift: false,
    graph: false,
    kana: true,
    caps: false,
    key: "Digit2",
  },
  あ: {
    shift: false,
    graph: false,
    kana: true,
    caps: false,
    key: "Digit3",
  },
  う: {
    shift: false,
    graph: false,
    kana: true,
    caps: false,
    key: "Digit4",
  },
  え: {
    shift: false,
    graph: false,
    kana: true,
    caps: false,
    key: "Digit5",
  },
  お: {
    shift: false,
    graph: false,
    kana: true,
    caps: false,
    key: "Digit6",
  },
  や: {
    shift: false,
    graph: false,
    kana: true,
    caps: false,
    key: "Digit7",
  },
  ゆ: {
    shift: false,
    graph: false,
    kana: true,
    caps: false,
    key: "Digit8",
  },
  よ: {
    shift: false,
    graph: false,
    kana: true,
    caps: false,
    key: "Digit9",
  },
  わ: {
    shift: false,
    graph: false,
    kana: true,
    caps: false,
    key: "Digit0",
  },
  ほ: { shift: false, graph: false, kana: true, caps: false, key: "Minus" },
  へ: { shift: false, graph: false, kana: true, caps: false, key: "Equal" },
  ー: {
    shift: false,
    graph: false,
    kana: true,
    caps: false,
    key: REMAPPED_KEY_JIS_YEN,
  },
  た: { shift: false, graph: false, kana: true, caps: false, key: "KeyQ" },
  て: { shift: false, graph: false, kana: true, caps: false, key: "KeyW" },
  い: { shift: false, graph: false, kana: true, caps: false, key: "KeyE" },
  す: { shift: false, graph: false, kana: true, caps: false, key: "KeyR" },
  か: { shift: false, graph: false, kana: true, caps: false, key: "KeyT" },
  ん: { shift: false, graph: false, kana: true, caps: false, key: "KeyY" },
  な: { shift: false, graph: false, kana: true, caps: false, key: "KeyU" },
  に: { shift: false, graph: false, kana: true, caps: false, key: "KeyI" },
  ら: { shift: false, graph: false, kana: true, caps: false, key: "KeyO" },
  せ: { shift: false, graph: false, kana: true, caps: false, key: "KeyP" },
  "゛": {
    shift: false,
    graph: false,
    kana: true,
    caps: false,
    key: "BracketLeft",
  },
  "゜": {
    shift: false,
    graph: false,
    kana: true,
    caps: false,
    key: "BracketRight",
  },
  ち: { shift: false, graph: false, kana: true, caps: false, key: "KeyA" },
  と: { shift: false, graph: false, kana: true, caps: false, key: "KeyS" },
  し: { shift: false, graph: false, kana: true, caps: false, key: "KeyD" },
  は: { shift: false, graph: false, kana: true, caps: false, key: "KeyF" },
  き: { shift: false, graph: false, kana: true, caps: false, key: "KeyG" },
  く: { shift: false, graph: false, kana: true, caps: false, key: "KeyH" },
  ま: { shift: false, graph: false, kana: true, caps: false, key: "KeyJ" },
  の: { shift: false, graph: false, kana: true, caps: false, key: "KeyK" },
  り: { shift: false, graph: false, kana: true, caps: false, key: "KeyL" },
  れ: {
    shift: false,
    graph: false,
    kana: true,
    caps: false,
    key: "Semicolon",
  },
  け: { shift: false, graph: false, kana: true, caps: false, key: "Quote" },
  む: {
    shift: false,
    graph: false,
    kana: true,
    caps: false,
    key: REMAPPED_KEY_JIS_BRACKET_RIGHT,
  },
  つ: { shift: false, graph: false, kana: true, caps: false, key: "KeyZ" },
  さ: { shift: false, graph: false, kana: true, caps: false, key: "KeyX" },
  そ: { shift: false, graph: false, kana: true, caps: false, key: "KeyC" },
  ひ: { shift: false, graph: false, kana: true, caps: false, key: "KeyV" },
  こ: { shift: false, graph: false, kana: true, caps: false, key: "KeyB" },
  み: { shift: false, graph: false, kana: true, caps: false, key: "KeyN" },
  も: { shift: false, graph: false, kana: true, caps: false, key: "KeyM" },
  ね: { shift: false, graph: false, kana: true, caps: false, key: "Comma" },
  る: {
    shift: false,
    graph: false,
    kana: true,
    caps: false,
    key: "Period",
  },
  め: { shift: false, graph: false, kana: true, caps: false, key: "Slash" },
  ろ: {
    shift: false,
    graph: false,
    kana: true,
    caps: false,
    key: REMAPPED_KEY_JIS_BACKSLASH,
  },
  ぁ: { shift: true, graph: false, kana: true, caps: false, key: "Digit3" },
  ぅ: { shift: true, graph: false, kana: true, caps: false, key: "Digit4" },
  ぇ: { shift: true, graph: false, kana: true, caps: false, key: "Digit5" },
  ぉ: { shift: true, graph: false, kana: true, caps: false, key: "Digit6" },
  ゃ: { shift: true, graph: false, kana: true, caps: false, key: "Digit7" },
  ゅ: { shift: true, graph: false, kana: true, caps: false, key: "Digit8" },
  ょ: { shift: true, graph: false, kana: true, caps: false, key: "Digit9" },
  を: { shift: true, graph: false, kana: true, caps: false, key: "Digit0" },
  ぃ: { shift: true, graph: false, kana: true, caps: false, key: "KeyE" },
  "「": {
    shift: true,
    graph: false,
    kana: true,
    caps: false,
    key: "BracketRight",
  },
  "」": {
    shift: true,
    graph: false,
    kana: true,
    caps: false,
    key: REMAPPED_KEY_JIS_BRACKET_RIGHT,
  },
  っ: { shift: true, graph: false, kana: true, caps: false, key: "KeyZ" },
  "、": {
    shift: true,
    graph: false,
    kana: true,
    caps: false,
    key: "Comma",
  },
  "。": {
    shift: true,
    graph: false,
    kana: true,
    caps: false,
    key: "Period",
  },
  "・": {
    shift: true,
    graph: false,
    kana: true,
    caps: false,
    key: "Slash",
  },
  ヌ: { shift: false, graph: false, kana: true, caps: true, key: "Digit1" },
  フ: { shift: false, graph: false, kana: true, caps: true, key: "Digit2" },
  ア: { shift: false, graph: false, kana: true, caps: true, key: "Digit3" },
  ウ: { shift: false, graph: false, kana: true, caps: true, key: "Digit4" },
  エ: { shift: false, graph: false, kana: true, caps: true, key: "Digit5" },
  オ: { shift: false, graph: false, kana: true, caps: true, key: "Digit6" },
  ヤ: { shift: false, graph: false, kana: true, caps: true, key: "Digit7" },
  ユ: { shift: false, graph: false, kana: true, caps: true, key: "Digit8" },
  ヨ: { shift: false, graph: false, kana: true, caps: true, key: "Digit9" },
  ワ: { shift: false, graph: false, kana: true, caps: true, key: "Digit0" },
  ホ: { shift: false, graph: false, kana: true, caps: true, key: "Minus" },
  ヘ: { shift: false, graph: false, kana: true, caps: true, key: "Equal" },
  タ: { shift: false, graph: false, kana: true, caps: true, key: "KeyQ" },
  テ: { shift: false, graph: false, kana: true, caps: true, key: "KeyW" },
  イ: { shift: false, graph: false, kana: true, caps: true, key: "KeyE" },
  ス: { shift: false, graph: false, kana: true, caps: true, key: "KeyR" },
  カ: { shift: false, graph: false, kana: true, caps: true, key: "KeyT" },
  ン: { shift: false, graph: false, kana: true, caps: true, key: "KeyY" },
  ナ: { shift: false, graph: false, kana: true, caps: true, key: "KeyU" },
  ニ: { shift: false, graph: false, kana: true, caps: true, key: "KeyI" },
  ラ: { shift: false, graph: false, kana: true, caps: true, key: "KeyO" },
  セ: { shift: false, graph: false, kana: true, caps: true, key: "KeyP" },
  チ: {
    shift: false,
    graph: false,
    kana: true,
    caps: true,
    key: "KeyA",
  },
  ト: {
    shift: false,
    graph: false,
    kana: true,
    caps: true,
    key: "KeyS",
  },
  シ: { shift: false, graph: false, kana: true, caps: true, key: "KeyD" },
  ハ: { shift: false, graph: false, kana: true, caps: true, key: "KeyF" },
  キ: { shift: false, graph: false, kana: true, caps: true, key: "KeyG" },
  ク: { shift: false, graph: false, kana: true, caps: true, key: "KeyH" },
  マ: { shift: false, graph: false, kana: true, caps: true, key: "KeyJ" },
  ノ: { shift: false, graph: false, kana: true, caps: true, key: "KeyK" },
  リ: { shift: false, graph: false, kana: true, caps: true, key: "KeyL" },
  レ: {
    shift: false,
    graph: false,
    kana: true,
    caps: true,
    key: "Semicolon",
  },
  ケ: { shift: false, graph: false, kana: true, caps: true, key: "Quote" },
  ム: {
    shift: false,
    graph: false,
    kana: true,
    caps: true,
    key: REMAPPED_KEY_JIS_BRACKET_RIGHT,
  },
  ツ: { shift: false, graph: false, kana: true, caps: true, key: "KeyZ" },
  サ: { shift: false, graph: false, kana: true, caps: true, key: "KeyX" },
  ソ: { shift: false, graph: false, kana: true, caps: true, key: "KeyC" },
  ヒ: { shift: false, graph: false, kana: true, caps: true, key: "KeyV" },
  コ: { shift: false, graph: false, kana: true, caps: true, key: "KeyB" },
  ミ: { shift: false, graph: false, kana: true, caps: true, key: "KeyN" },
  モ: { shift: false, graph: false, kana: true, caps: true, key: "KeyM" },
  ネ: { shift: false, graph: false, kana: true, caps: true, key: "Comma" },
  ル: { shift: false, graph: false, kana: true, caps: true, key: "Period" },
  メ: { shift: false, graph: false, kana: true, caps: true, key: "Slash" },
  ロ: {
    shift: false,
    graph: false,
    kana: true,
    caps: true,
    key: REMAPPED_KEY_JIS_BACKSLASH,
  },
  ァ: { shift: true, graph: false, kana: true, caps: true, key: "Digit3" },
  ゥ: { shift: true, graph: false, kana: true, caps: true, key: "Digit4" },
  ェ: { shift: true, graph: false, kana: true, caps: true, key: "Digit5" },
  ォ: { shift: true, graph: false, kana: true, caps: true, key: "Digit6" },
  ャ: { shift: true, graph: false, kana: true, caps: true, key: "Digit7" },
  ュ: { shift: true, graph: false, kana: true, caps: true, key: "Digit8" },
  ョ: { shift: true, graph: false, kana: true, caps: true, key: "Digit9" },
  ヲ: { shift: true, graph: false, kana: true, caps: true, key: "Digit0" },
  ィ: { shift: true, graph: false, kana: true, caps: true, key: "KeyE" },
  ッ: { shift: true, graph: false, kana: true, caps: true, key: "KeyZ" },
};
/**
 * @param {string} c
 */
function decomposeKana(c) {
  return [...c.normalize("NFKD")].map((c) =>
    c === "\u3099" ? "゛" : c === "\u309A" ? "゜" : c,
  );
}

/**
 * @param {WebMSXPage} webmsx
 */
export async function init(webmsx) {
  await webmsx.locator("#wmsx-bar-settings").click();
  await webmsx.waitForTimeout(500);
  await webmsx.keyboard.press("ArrowUp", { delay: 50 });
  await webmsx.waitForTimeout(50);
  await webmsx.keyboard.press("ArrowUp", { delay: 50 });
  await webmsx.waitForTimeout(50);
  await webmsx.keyboard.press("ArrowUp", { delay: 50 });
  await webmsx.waitForTimeout(50);
  await webmsx.keyboard.press("Enter", { delay: 50 });
  await webmsx.waitForTimeout(2_000);

  /*
   * 一部キーはPlaywrightから入力できないためマッピングを変更
   */

  await webmsx.locator("#wmsx-menu-inputs").click();
  await webmsx.waitForTimeout(2_000);

  await webmsx.locator(".wmsx-keyboard-backslash").click({ button: "right" });
  await webmsx.waitForTimeout(500);
  await webmsx.keyboard.press(REMAPPED_KEY_JIS_YEN, { delay: 50 });
  await webmsx.waitForTimeout(1_000);

  await webmsx.locator(".wmsx-keyboard-backquote").click({ button: "right" });
  await webmsx.waitForTimeout(500);
  await webmsx.keyboard.press(REMAPPED_KEY_JIS_BRACKET_RIGHT, { delay: 50 });
  await webmsx.waitForTimeout(1_000);

  await webmsx.locator(".wmsx-keyboard-dead").click({ button: "right" });
  await webmsx.waitForTimeout(500);
  await webmsx.keyboard.press(REMAPPED_KEY_JIS_BACKSLASH, { delay: 50 });
  await webmsx.waitForTimeout(1_000);

  await webmsx.locator(".wmsx-keyboard-capslock").click({ button: "right" });
  await webmsx.waitForTimeout(500);
  await webmsx.keyboard.press(KEY_CAPS, { delay: 50 });
  await webmsx.waitForTimeout(1_000);

  await webmsx.locator("#wmsx-back").click();
  await webmsx.waitForTimeout(2_000);

  await webmsx.keyboard.press("Enter", { delay: 50 });
  await webmsx.waitForTimeout(2_000);
}

/**
 * @param {string[]} lines
 * @returns {AllowedChar[][]}
 */
export function sanitizeLines(lines) {
  return lines.map((line, lineIndex) => {
    const decomposed = decomposeKana(line);
    return decomposed.map((c, charIndex) => {
      if (Object.hasOwn(KEY_MAPPING, c)) {
        return /** @type {AllowedChar} */ (c);
      }

      // コメント処理: 対応する元行の該当位置までに `'` があるか調べる
      const decomposedUpTo = decomposed.slice(0, charIndex).join("");
      const originalIndex =
        line.indexOf(decomposedUpTo) + decomposedUpTo.length;

      if (line.slice(0, originalIndex).includes("'")) {
        console.warn(
          `Warning: unsupported character "${c}" (U+${c.charCodeAt(0).toString(16).toUpperCase()}) on line ${lineIndex + 1} in comment - replaced with "・"\n> ${line}`,
        );
        return "・"; // コメント内なので置換
      }

      throw new Error(
        `Unsupported character "${c}" (U+${c.charCodeAt(0).toString(16).toUpperCase()}) on line ${lineIndex + 1}: ${line}`,
      );
    });
  });
}

/**
 * @param {WebMSXPage} webmsx
 * @param {AllowedChar[][]} lines
 * @param {{proofDir?: string}} param0
 */
export async function inputText(webmsx, lines, { proofDir } = {}) {
  let isShiftDown = false;
  let isGraphDown = false;
  let isKanaMode = false;
  let isCapsMode = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    for (const c of line) {
      const input = KEY_MAPPING[c];

      if (input.shift !== isShiftDown) {
        await webmsx.keyboard[input.shift ? "down" : "up"]("Shift");
        isShiftDown = input.shift;
        await webmsx.waitForTimeout(50);
      }

      if (input.graph !== isGraphDown) {
        await webmsx.keyboard[input.graph ? "down" : "up"](KEY_GRAPH);
        isGraphDown = input.graph;
        await webmsx.waitForTimeout(50);
      }

      if (input.kana !== isKanaMode) {
        await webmsx.keyboard.press(KEY_KANA, { delay: 50 });
        isKanaMode = input.kana;
        await webmsx.waitForTimeout(50);
      }

      if (input.caps !== isCapsMode) {
        await webmsx.keyboard.press(KEY_CAPS, { delay: 50 });
        isCapsMode = input.caps;
        await webmsx.waitForTimeout(50);
      }

      await webmsx.keyboard.press(input.key, { delay: 50 });
      await webmsx.waitForTimeout(50);
    }

    if (i < lines.length - 1) {
      await webmsx.keyboard.press("Enter", { delay: 50 });
      await webmsx.waitForTimeout(500);
    }

    if (typeof proofDir !== "undefined") {
      // await webmsx.screenshot({
      //   path: `${proofDir}/${getTimeString()}.png`,
      // });
      const [download] = await Promise.all([
        webmsx.waitForEvent("download"),
        webmsx.keyboard.press("Alt+G", { delay: 50 }),
      ]);
      await download.saveAs(`${proofDir}/${getTimeString()}.png`);
    }
  }

  if (isShiftDown) await webmsx.keyboard.up("Shift");
  if (isGraphDown) await webmsx.keyboard.up(KEY_GRAPH);
}

/**
 * @param {WebMSXPage} webmsx
 */
export async function addBlankDiskA(webmsx) {
  const diskA = webmsx.locator("#wmsx-bar-diska");
  await diskA.click();
  await webmsx.waitForTimeout(500);
  await webmsx.keyboard.press("ArrowDown", { delay: 50 });
  await webmsx.waitForTimeout(50);
  await webmsx.keyboard.press("ArrowDown", { delay: 50 });
  await webmsx.waitForTimeout(50);
  await webmsx.keyboard.press("ArrowDown", { delay: 50 });
  await webmsx.waitForTimeout(50);
  await webmsx.keyboard.press("Enter", { delay: 50 });
  await webmsx.waitForTimeout(50);
}

/**
 * @param {import("playwright").Browser} browser
 * @returns {Promise<WebMSXPage>}
 */
export async function open(browser) {
  const context = await browser.newContext();
  /** @type {WebMSXPage} */
  // @ts-ignore
  const webmsx = await context.newPage();
  await webmsx.goto("https://webmsx.org/?MACHINE=MSX1J");
  return webmsx;
}

/**
 * @param {WebMSXPage} webmsx
 * @param {string} filename
 */
export async function exportDiskA(webmsx, filename) {
  const diskA = webmsx.locator("#wmsx-bar-diska");
  await diskA.click();
  await webmsx.waitForTimeout(500);
  await webmsx.keyboard.press("ArrowUp", { delay: 50 });
  await webmsx.waitForTimeout(50);
  await webmsx.keyboard.press("ArrowUp", { delay: 50 });
  await webmsx.waitForTimeout(50);
  const [download] = await Promise.all([
    webmsx.waitForEvent("download"),
    webmsx.keyboard.press("Enter", { delay: 50 }),
  ]);
  await download.saveAs(filename);
}

/**
 * @param {WebMSXPage} webmsx
 */
export async function selectMSXJapanNTSC(webmsx) {
  await webmsx.locator("#wmsx-bar-settings").click();
  await webmsx.waitForTimeout(500);
  await webmsx.keyboard.press("ArrowUp", { delay: 50 });
  await webmsx.waitForTimeout(50);
  await webmsx.keyboard.press("ArrowUp", { delay: 50 });
  await webmsx.waitForTimeout(50);
  await webmsx.keyboard.press("ArrowUp", { delay: 50 });
  await webmsx.waitForTimeout(50);
  await webmsx.keyboard.press("ArrowUp", { delay: 50 });
  await webmsx.waitForTimeout(50);
  await webmsx.keyboard.press("Enter", { delay: 50 });
  await webmsx.waitForTimeout(500);
  await webmsx.keyboard.press("ArrowDown", { delay: 50 });
  await webmsx.waitForTimeout(50);
  await webmsx.keyboard.press("ArrowDown", { delay: 50 });
  await webmsx.waitForTimeout(50);
  await webmsx.keyboard.press("ArrowDown", { delay: 50 });
  await webmsx.waitForTimeout(50);
  await webmsx.keyboard.press("ArrowDown", { delay: 50 });
  await webmsx.waitForTimeout(50);
  await webmsx.keyboard.press("ArrowDown", { delay: 50 });
  await webmsx.waitForTimeout(50);
  await webmsx.keyboard.press("ArrowDown", { delay: 50 });
  await webmsx.waitForTimeout(50);
  await webmsx.keyboard.press("ArrowDown", { delay: 50 });
  await webmsx.waitForTimeout(50);
  await webmsx.keyboard.press("ArrowDown", { delay: 50 });
  await webmsx.waitForTimeout(50);
  await webmsx.keyboard.press("Enter", { delay: 50 });
  await webmsx.waitForTimeout(50);
}

/**
 * @param {WebMSXPage} webmsx
 */
export async function removeDiskA(webmsx) {
  await webmsx.locator("#wmsx-bar-diska").click();
  await webmsx.waitForTimeout(500);
  await webmsx.keyboard.press("ArrowUp", { delay: 50 });
  await webmsx.waitForTimeout(50);
  await webmsx.keyboard.press("Enter", { delay: 50 });
  await webmsx.waitForTimeout(50);
}

/**
 * @param {WebMSXPage} webmsx
 * @param {string} filename
 */
export async function loadDiskA(webmsx, filename) {
  await webmsx.locator("#wmsx-bar-diska").click();
  await webmsx.waitForTimeout(500);
  await webmsx.keyboard.press("ArrowDown", { delay: 50 });
  await webmsx.waitForTimeout(50);
  const fileChooserPromise = webmsx.waitForEvent("filechooser", {
    timeout: 10_000,
  });
  await webmsx.keyboard.press("Enter", { delay: 50 });
  const fileChooser = await fileChooserPromise;
  fileChooser.setFiles(filename);
}

/**
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @param {{r:number,g:number,b:number}} ref
 * @param {number} tolerance
 */
function isColorInRange(r, g, b, ref, tolerance = 10) {
  return (
    Math.abs(r - ref.r) <= tolerance &&
    Math.abs(g - ref.g) <= tolerance &&
    Math.abs(b - ref.b) <= tolerance
  );
}

/**
 * @param {import("./webmsx.js").WebMSXPage} webmsx
 */
export async function isDiskABusy(webmsx) {
  const image = await Jimp.read(
    await webmsx.locator("#wmsx-bar-diska").screenshot({ type: "png" }),
  );
  const { r, g, b } = intToRGBA(image.getPixelColor(9, 10));
  // console.debug({ r, g, b });
  const refColors = [
    { r: 255, g: 36, b: 34 },
    { r: 170, g: 24, b: 23 },
  ];
  return refColors.some((ref) => isColorInRange(r, g, b, ref));
}

/**
 * @param {WebMSXPage} webmsx
 */
export async function pressStop(webmsx) {
  const wmsx = webmsx.locator("#wmsx-screen");
  await wmsx.click();
  await webmsx.waitForTimeout(500);
  // await wmsx.press("Control+F9", { delay: 500 });
  await webmsx.keyboard.down("Control");
  await webmsx.keyboard.down("F9");
  await webmsx.waitForTimeout(500);
  await webmsx.keyboard.up("F9");
  await webmsx.keyboard.up("Control");
  await webmsx.waitForTimeout(50);
}
