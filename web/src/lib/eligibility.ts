export function checkEligibility(user: any, opportunity: any) {
  const r = opportunity.requirements;
  const missing: string[] = [];

  if (!user.age) missing.push("Age not set in profile");

  if (r.minAge && user.age < r.minAge)
    missing.push(`Must be at least ${r.minAge}`);

  if (r.maxAge && user.age > r.maxAge)
    missing.push(`Must be under ${r.maxAge}`);

  if (r.gender && r.gender !== "any" && user.gender !== r.gender)
    missing.push(`Must be ${r.gender}`);

  if (r.requiresValidID && !user.hasValidID)
    missing.push("Valid government ID required");

  if (r.requiresHealthScreening && !user.hasHealthScreening)
    missing.push("Health screening required");

  return {
    eligible: missing.length === 0,
    missing,
  };
}