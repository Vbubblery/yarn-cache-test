// 10      -> "10px"
// "10"    -> "10px"
// "10px"  -> "10px"
// "100%"  -> "100%"
// "string" -> "string"
export function toNumerableCSSValue(value: number | string): string {
  if (typeof value === "number" || !isNaN(+value)) {
    return `${value}px`;
  }
  return value;
}
