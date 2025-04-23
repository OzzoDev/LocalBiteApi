export const sanitizeValues = (values) => {
  return values.map((value) => {
    if (typeof value === "string") {
      return value.trim();
    }
    return value;
  });
};

export const calculateUnicodeSum = (str) =>
  Array.from(str).reduce((sum, char) => sum + char.codePointAt(0), 0);

export const normalizeString = (str) =>
  str
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");

export const validateIsBusinessOwner = (businessName = "", email = "") => {
  const emailDomain = email.split("@")[1].split(".")[0];
  const normalizedBusinessName = normalizeString(businessName);
  const normalizedEmailDomain = normalizeString(emailDomain);

  const businessNameScore = calculateUnicodeSum(normalizedBusinessName);
  const emailDomainScore = calculateUnicodeSum(normalizedEmailDomain);

  const maxScore = Math.max(businessNameScore, emailDomainScore);
  const minScore = Math.min(businessNameScore, emailDomainScore);

  const scorePercentage = (minScore / maxScore) * 100;

  return scorePercentage >= 70;
};
