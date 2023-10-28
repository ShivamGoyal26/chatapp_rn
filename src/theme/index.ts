import {createTheme} from '@shopify/restyle';
import {Fonts} from '../constants';
import {getScreenHeight} from '../utils/commonServices';

const palette = {
  purple: '#5A31F4',
  white: '#FFFFFF',
  black: '#222222',
  darkGray: '#A9A9A9',
  lightGray: '#EEE',
  lightRose: '#f1807e',
};

export const theme = createTheme({
  spacing: {
    xs: getScreenHeight(1),
    s: getScreenHeight(1.2),
    m: getScreenHeight(1.5),
    l: getScreenHeight(2),
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
      fontSize: getScreenHeight(1.4),
      lineHeight: 24,
      color: 'mainForeground',
      fontFamily: Fonts.regular,
    },
    body: {
      fontSize: getScreenHeight(1.4),
      lineHeight: 24,
      color: 'borderColor',
      fontFamily: Fonts.regular,
    },
    subtitle: {
      fontSize: getScreenHeight(1.4),
      lineHeight: 24,
      color: 'mainForeground',
      fontFamily: Fonts.regular,
    },
    title: {
      fontSize: getScreenHeight(1.6),
      lineHeight: 24,
      color: 'mainForeground',
      fontFamily: Fonts.medium,
    },
    heading: {
      fontSize: getScreenHeight(2),
      lineHeight: 24,
      color: 'primaryCardBackground',
      fontFamily: Fonts.semibold,
    },
    error: {
      fontSize: getScreenHeight(1.3),
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

    primaryCardBackground: palette.white,

    borderColor: palette.lightGray,
  },
};
