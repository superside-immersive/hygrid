// Number formatting utilities

/**
 * Split a number into leading zero padding (gray) and the actual numeric portion (yellow).
 * Ensures the string has a fixed total length using zero padding on the left.
 * When the value is 0, only the last zero is considered yellow.
 *
 * @param {number} value - Numeric value to format.
 * @param {number} totalDigits - Total width to pad to (e.g., 6).
 * @returns {{ grayPart: string, yellowPart: string, full: string }}
 */
export function splitPaddedNumber(value, totalDigits) {
  const numeric = Math.max(0, Number.isFinite(value) ? Math.trunc(value) : 0);
  const padded = numeric.toString().padStart(totalDigits, '0');

  // If the number is exactly 0, everything should be gray
  if (numeric === 0) {
    return { grayPart: padded, yellowPart: '', full: padded };
  }

  const splitIndex = padded.search(/[1-9]/);
  return {
    grayPart: padded.slice(0, splitIndex === -1 ? padded.length : splitIndex),
    yellowPart: padded.slice(splitIndex === -1 ? padded.length : splitIndex),
    full: padded,
  };
}


