import tinycolor from "tinycolor2";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config";

const fullConfig = resolveConfig(tailwindConfig);
export const themeColors = fullConfig.theme.colors;

export const hexToRgba = (hexString, alpha = 1) => {
  const color = tinycolor(hexString);
  color.setAlpha(alpha);
  return color.toRgbString();
};
export const rgbaToHex = rgbaString => {
  return tinycolor(rgbaString).toHexString();
};
