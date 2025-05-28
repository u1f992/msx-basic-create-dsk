export function getTimeString() {
  return new Date().toISOString().replace(/:/g, "_");
}
