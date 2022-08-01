export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  delay: number = 300
): (...funcArgs: Parameters<T>) => void {
  let timeoutId: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
