import type { HsvColor } from './ColorPicker.types';

export const DEFAULT_HSV_COLOR: Readonly<HsvColor> = { h: 0, s: 1, v: 1, a: 1 };

export function clamp(value: number, min = 0, max = 1): number {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}

export function normalizeHue(value: number): number {
  return clamp(value, 0, 360);
}

export function normalizeColor(color?: HsvColor): HsvColor {
  const source = color ?? DEFAULT_HSV_COLOR;

  return {
    h: normalizeHue(source.h),
    s: clamp(source.s),
    v: clamp(source.v),
    a: clamp(source.a ?? 1),
  };
}

export function colorsEqual(left: HsvColor, right: HsvColor): boolean {
  return left.h === right.h && left.s === right.s && left.v === right.v && left.a === right.a;
}

export function roundChannel(value: number): number {
  return Math.round(clamp(value) * 100) / 100;
}

export function hsvToRgb(color: HsvColor): { r: number; g: number; b: number; a: number } {
  const normalized = normalizeColor(color);
  const hue = normalized.h === 360 ? 0 : normalized.h;
  const chroma = normalized.v * normalized.s;
  const hueSector = hue / 60;
  const secondary = chroma * (1 - Math.abs((hueSector % 2) - 1));
  let red = 0;
  let green = 0;
  let blue = 0;

  if (hueSector < 1) {
    red = chroma;
    green = secondary;
  } else if (hueSector < 2) {
    red = secondary;
    green = chroma;
  } else if (hueSector < 3) {
    green = chroma;
    blue = secondary;
  } else if (hueSector < 4) {
    green = secondary;
    blue = chroma;
  } else if (hueSector < 5) {
    red = secondary;
    blue = chroma;
  } else {
    red = chroma;
    blue = secondary;
  }

  const match = normalized.v - chroma;
  return {
    r: Math.round((red + match) * 255),
    g: Math.round((green + match) * 255),
    b: Math.round((blue + match) * 255),
    a: normalized.a ?? 1,
  };
}

export function colorToCss(color: HsvColor, alpha = color.a ?? 1): string {
  const rgb = hsvToRgb(color);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${clamp(alpha)})`;
}

export function hueToCss(hue: number): string {
  return `hsl(${normalizeHue(hue)} 100% 50%)`;
}
