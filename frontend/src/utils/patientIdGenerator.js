/**
 * Generate auto patient ID
 * Format: 2 letters from name + YYYYMM + initial + unique series (00+)
 * Example: JD202604AB00 (John Doe, April 2026, initial A/B, series 00)
 */

// Store for tracking IDs (in production, this should be in backend)
let idCounter = {};

export const generatePatientId = (patientName) => {
  if (!patientName || patientName.trim() === "") {
    return "";
  }

  // Extract first 2 letters from name (uppercase)
  const nameParts = patientName.trim().split(" ");
  let firstTwoLetters = "";
  
  if (nameParts.length >= 1) {
    // First letter from first name + first letter from last name (if exists)
    firstTwoLetters = nameParts[0][0].toUpperCase();
    if (nameParts.length > 1) {
      firstTwoLetters += nameParts[nameParts.length - 1][0].toUpperCase();
    } else {
      // If only one name, take first two letters
      firstTwoLetters = nameParts[0].substring(0, 2).toUpperCase();
    }
  }

  // Get current date: YYYYMM
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const dateString = `${year}${month}`;

  // Get initials (both first and last if available)
  let initials = "";
  if (nameParts.length > 1) {
    initials = (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  } else {
    initials = nameParts[0].substring(0, 2).toUpperCase();
  }

  // Generate unique series number
  const key = `${firstTwoLetters}${dateString}${initials}`;
  if (!idCounter[key]) {
    idCounter[key] = 0;
  }
  const seriesNumber = String(idCounter[key]).padStart(2, "0");
  idCounter[key]++;

  // Combine: 2letters + YYYYMM + initials + series
  return `${firstTwoLetters}${dateString}${initials}${seriesNumber}`;
};

/**
 * Example usage:
 * generatePatientId("John Doe") → JD202604JD00
 * generatePatientId("John Doe") → JD202604JD01
 * generatePatientId("Alice Smith") → AS202604AS00
 */
