function isValid(s) {
  let bracket = {
    "(": "1",
    "{": "2",
    "[": "3",
  };
  if (bracket[s]) {
    return bracket[s];
  } else {
    return false;
  }
}
