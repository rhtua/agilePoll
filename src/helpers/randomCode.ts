export function generateRandomCode(): string {
  const array = new Uint8Array(8)
  globalThis.crypto.getRandomValues(array)
  const code = Array.from(array, (byte) =>
    String.fromCharCode(65 + (byte % 26)),
  ).join('')

  return `${code.slice(0, 4)}-${code.slice(4)}`
}
