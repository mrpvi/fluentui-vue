import type { AvatarNamedColor } from './Avatar.types';

const unwantedEnclosures = /[([{][^\])}]*[\])}]/g;
// eslint-disable-next-line no-control-regex -- Mirrors the released initials cleanup range.
const unwantedCharacters = /[\0-!-/:-@[\-`{-¿ɐ-ͯ-￿]/g;
const phoneNumber = /^\d+[\d\s]*(?:ext|x|)\s*\d+$/i;
const multipleWhitespace = /\s+/g;
const unsupportedText = /[؀-ۿݐ-ݿࢠ-ࣿᄀ-ᇿ㄰-㆏ꥠ-꥿가-힯ힰ-퟿぀-ゟ゠-ヿ㐀-䶿一-鿿豈-﫿]/;

export const avatarNamedColors: readonly AvatarNamedColor[] = [
  'dark-red',
  'cranberry',
  'red',
  'pumpkin',
  'peach',
  'marigold',
  'gold',
  'brass',
  'brown',
  'forest',
  'seafoam',
  'dark-green',
  'light-teal',
  'teal',
  'steel',
  'blue',
  'royal-blue',
  'cornflower',
  'navy',
  'lavender',
  'purple',
  'grape',
  'lilac',
  'pink',
  'magenta',
  'plum',
  'beige',
  'mink',
  'platinum',
  'anchor',
];

function firstCodePoint(value: string) {
  const codePoint = value.codePointAt(0);
  return codePoint === undefined ? '' : String.fromCodePoint(codePoint);
}

export function getAvatarInitials(
  name: string | undefined,
  isRtl = false,
  firstInitialOnly = false,
) {
  if (!name) {
    return '';
  }

  const displayName = name
    .replace(unwantedEnclosures, '')
    .replace(unwantedCharacters, '')
    .replace(multipleWhitespace, ' ')
    .trim();
  const first = firstCodePoint(displayName);

  if (!displayName || unsupportedText.test(first) || phoneNumber.test(displayName)) {
    return '';
  }

  const words = displayName.split(' ');
  let initials = firstCodePoint(words[0] ?? '').toUpperCase();
  if (!firstInitialOnly) {
    if (words.length === 2) {
      initials += firstCodePoint(words[1] ?? '').toUpperCase();
    } else if (words.length === 3) {
      initials += firstCodePoint(words[2] ?? '').toUpperCase();
    }
  }

  const codePoints = [...initials];
  return isRtl && codePoints.length > 1 ? `${codePoints[1]}${codePoints[0]}` : initials;
}

export function getAvatarColorHash(value: string) {
  let hash = 0;
  for (let index = value.length - 1; index >= 0; index -= 1) {
    const character = value.charCodeAt(index);
    const shift = index % 8;
    hash ^= (character << shift) + (character >> (8 - shift));
  }
  return hash;
}

export function resolveColorfulAvatar(value: string | undefined) {
  return (
    avatarNamedColors[getAvatarColorHash(value ?? '') % avatarNamedColors.length] ?? 'dark-red'
  );
}
