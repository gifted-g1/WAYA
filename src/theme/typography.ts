// Typography tokens for Waya - Contemporary African Editorial and Tech
import { TextStyle } from 'react-native';

export const Typography = {
  fontSizes: {
    hero: 34,
    display: 28,
    h1: 24,
    h2: 20,
    h3: 18,
    title: 16,
    body: 15,
    bodySmall: 13,
    caption: 11,
    tiny: 9,
  },
  fontWeights: {
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semibold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
    black: '900' as TextStyle['fontWeight'],
  },
  lineHeights: {
    hero: 42,
    display: 34,
    h1: 30,
    h2: 26,
    h3: 24,
    title: 22,
    body: 21,
    bodySmall: 18,
    caption: 15,
  },
  letterSpacings: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1.0,
    caps: 1.5,
  },
};
