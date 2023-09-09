export function toTitleCase(inputString: string): string {
  if (!inputString) {
    return "";
  }

  const words: string[] = inputString.split(" ");
  const titleCaseWords: string[] = words.map((word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  return titleCaseWords.join(" ");
}

export function generateRandomId(): string {
  return crypto.randomUUID();
}
