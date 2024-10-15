/**
 * Capitalizes the first letter of each word in a sentence.
 *
 * @param {string} str - The input string to capitalize.
 * @returns {string} The string with the first letter of each word capitalized.
 */
export const capitaliseSentence = (str: string) => {
  let splitStr = str.toLowerCase().split(' ');
  for (let i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(' ');
};

/**
 * Checks if a password meets the specified criteria.
 *
 * @param {string} password - The password to be validated.
 * @returns {boolean} True if the password is valid, otherwise false.
 */
export const isPasswordValid = (password: string) => {
  return (
    password.length >= 8 &&
    /\d/.test(password) &&
    /[!@#$%^&*().?"':{}|<>]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password)
  );
};

export const isValidFullName = (fullName: string) => {
  return fullName.split(' ').length >= 2;
};

export const isEmailValid = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Extracts and capitalizes the error message from Firebase Auth errors.
 *
 * @param {string} errorMsg - The error message from Firebase Auth.
 * @returns {string} The formatted error message.
 */
export const getFirebaseErrorMsg = (errorMsg: string) => {
  const match = errorMsg.match(/auth\/([^\s]+)/);
  return match ? capitaliseSentence(match[1].replace('-', ' ')) : errorMsg;
};

/**
 * Extracts keys from an object and converts them into an array of numbers.
 *
 * @param {Record<any, any>} obj - The object from which keys are extracted.
 * @returns {number[]} An array containing the keys of the object as numbers.
 */
export const getNumberArrayFromKeys = (obj: Record<any, any>): number[] => {
  return Object.keys(obj).map((ele) => parseInt(ele));
};

/**
 * Parses the year from a metric date format.
 *
 * @param {string} year - The year in metric date format (e.g., "MM/DD/YYYY").
 * @returns {number} The parsed year as a number.
 */
export const parseMetricYear = (year: string): number =>
  parseInt(year.split('/')[2]);
