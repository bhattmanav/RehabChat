export function isNullOrUndefined(value: any): boolean {
  return value === undefined || value === null;
}

export function toTitleCase(inputString) {
  if (!inputString) {
    return "";
  }

  const words = inputString.split(" ");
  const titleCaseWords = words.map((word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  return titleCaseWords.join(" ");
}
