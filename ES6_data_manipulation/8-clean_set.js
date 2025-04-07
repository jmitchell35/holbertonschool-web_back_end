export default function cleanSet(set, startString) {
  return [...set]  // Convert Set to array with constructor, method chaining structure
    .filter(value => 
      typeof value === 'string' && value.startsWith(startString)
    )  // Keep only strings that start with startString
    .map(value => 
      value.slice(startString.length)
    )  // Remove the startString prefix
    .join('-');  // Join with hyphens
}
