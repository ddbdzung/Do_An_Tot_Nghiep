/**
 * Key - Value of state
 * @param {string} state state name
 * @returns {object|undefined} { state_key: state_value }
 */
export const loadState = (state) => {
  try {
    const serializedState = localStorage.getItem(state);
    if (serializedState === null) {
      return undefined;
    }

    return JSON.parse(serializedState)[state];
  } catch (err) {
    return undefined;
  }
};

/**
 * Set key-value to localStorage
 * @param {string} key
 * @param {object} value
 */
export const saveState = (key, value) => {
  try {
    const serializedState = JSON.stringify({ [key]: value });
    localStorage.setItem(key, serializedState);
  } catch (e) {
    // Ignore with error
  }
};

export const removeState = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    // Ignore with error
  }
};
