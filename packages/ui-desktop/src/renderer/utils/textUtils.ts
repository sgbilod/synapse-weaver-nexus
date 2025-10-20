/**
 * textUtils - small text-cleaning utilities used by the renderer.
 *
 * These helpers intentionally avoid regex literals that contain
 * control-character escape sequences to satisfy lint rules like
 * `no-control-regex` while still removing problematic characters.
 */
export function removeControlChars(str: string): string {
  return Array.from(str)
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      // C0 controls (U+0000..U+001F)
      if (code >= 0 && code <= 0x1f) return false;
      // DEL and C1 controls (U+007F..U+009F)
      if (code >= 0x7f && code <= 0x9f) return false;
      return true;
    })
    .join("");
}

/**
 * Remove common ANSI escape sequences (e.g. color codes) by scanning
 * for ESC ('\x1b') followed by '[' and consuming until a letter.
 * This avoids constructing a control-character regex literal.
 */
export function stripAnsiEscapeSequences(input: string): string {
  const out: string[] = [];
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    const code = ch.charCodeAt(0);

    // ESC (0x1b)
    if (code === 27 && input[i + 1] === "[") {
      // Skip the CSI sequence until we reach a letter command
      i += 2;
      while (i < input.length) {
        const c = input[i];
        if ((c >= "a" && c <= "z") || (c >= "A" && c <= "Z")) break;
        i++;
      }
      continue;
    }

    out.push(ch);
  }

  return out.join("");
}

export function cleanOutput(input: string): string {
  return removeControlChars(stripAnsiEscapeSequences(input));
}
