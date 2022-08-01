export const createDebounce = () => {
  let timeout: number | undefined = undefined;
  return (fnc: Function, delayMs: number) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fnc();
    }, delayMs || 500);
  };
};
