import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json" with { type: "json" };

countries.registerLocale(enLocale);

export const getCountryCodeFromName = (name) => {
  return countries.getAlpha2Code(name, "en");
};

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

export const isCloseMatch = (value = "", referance = "") => {
  const normalizedValue = normalizeString(value);
  const normalizedReferance = normalizeString(referance);

  const businessNameScore = calculateUnicodeSum(normalizedValue);
  const emailDomainScore = calculateUnicodeSum(normalizedReferance);

  const maxScore = Math.max(businessNameScore, emailDomainScore);
  const minScore = Math.min(businessNameScore, emailDomainScore);

  const scorePercentage = (minScore / maxScore) * 100;

  return scorePercentage >= 70;
};
