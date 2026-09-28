/**
 * Site config — swap brand when the parent name locks.
 * Keep CONTACT_EMAIL empty until the inbox works.
 */
window.SITE = {
  // Temporary wordmark — infrastructure tone, not a vertical.
  // Replace everywhere by changing this string.
  brand: "Onsite",
  brandMark: "O",
  CONTACT_EMAIL: "",
  INTENDED_EMAIL: "hello@onsite.example",
  location: "Illinois · Central Time",
};
// Back-compat for older main.js hooks
window.FW = window.SITE;
