export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateSlug = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const capitalizeString = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export default { generateOTP, generateSlug, capitalizeString };
