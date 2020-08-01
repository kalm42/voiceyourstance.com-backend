export function filterValidTags(tags: string[]) {
  if (!tags) throw new Error("No tags provided.")
  const regex = /(#\S*)*/ // Matches all words beinging with a '#' and followed by non-white space characters
  return tags.filter((tag) => regex.test(tag))
}
