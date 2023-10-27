import {createTheme} from '@shopify/restyle';
import {Fonts} from '../constants';

const palette = {
  purple: '#5A31F4',
  white: '#FFFFFF',
  black: '#000000',
  darkGray: '#A9A9A9',
  lightGray: '#EEE',
  lightRose: '#f1807e',
};

export const theme = createTheme({
  spacing: {
    s: 8,
    m: 16,
    l: 24,
  },
  colors: {
    mainBackground: palette.lightGray,
    mainForeground: palette.black,

    primaryCardBackground: palette.purple,
    secondaryCardBackground: palette.white,
    primaryCardText: palette.white,
    secondaryCardText: palette.black,
    error: palette.lightRose,

    borderColor: palette.darkGray,
  },
  textVariants: {
    defaults: {
      fontSize: 14,
      lineHeight: 24,
      color: 'mainForeground',
      fontFamily: Fonts.regular,
    },
    body: {
      fontSize: 14,
      lineHeight: 24,
      color: 'borderColor',
      fontFamily: Fonts.regular,
    },
    title: {
      fontSize: 15,
      lineHeight: 24,
      color: 'mainForeground',
      fontFamily: Fonts.medium,
    },
    heading: {
      fontSize: 22,
      lineHeight: 24,
      color: 'primaryCardBackground',
      fontFamily: Fonts.semibold,
    },
    error: {
      fontSize: 14,
      lineHeight: 24,
      color: 'error',
      fontFamily: Fonts.regular,
    },
  },
  cardVariants: {
    defaults: {},
    primary: {
      backgroundColor: 'primaryCardBackground',
      shadowOpacity: 0.3,
    },
    secondary: {
      backgroundColor: 'secondaryCardBackground',
      shadowOpacity: 0.1,
    },
  },
});

export type Theme = typeof theme;
export type ColorTheme = typeof theme.colors;

export const darkTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    mainBackground: palette.black,
    mainForeground: palette.white,

    secondaryCardBackground: palette.darkGray,
    secondaryCardText: palette.white,

    borderColor: palette.lightGray,
  },
};
