"use strict";

// Deliberately legacy-shaped code used by Chapter 17.
//
// The goal is to characterize this behavior before refactoring it. The magic
// values, mixed naming conventions and implicit precedence are intentional in
// the teaching scenario. Do not treat them as recommended design.

function calculatePriority(row, now) {
  if (!row) {
    throw new Error("row required");
  }

  if (row.status_code === "CLOSED") {
    return "NONE";
  }

  if (row.manual_hold == 1) {
    return "MANUAL_REVIEW";
  }

  if (row.problem_code === "PAY" && Number(row.failed_attempts || 0) >= 3) {
    return "URGENT";
  }

  var tier = String(row.customer_tier || "").trim().toUpperCase();
  var created = Date.parse(row.created_at);
  var ageMs = Number(now) - created;

  if (
    tier === "ENTERPRISE" &&
    Number.isFinite(ageMs) &&
    ageMs >= 30 * 60 * 1000
  ) {
    return "URGENT";
  }

  return "STANDARD";
}

module.exports = {
  calculatePriority,
};
