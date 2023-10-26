import {DefaultTheme, ExtendedTheme} from '@react-navigation/native';

export const platte = {
  white: '#ffffff',
  lightRose: '#f1807e',
  lightGrey: '#808080',
  black: '#000000',
  lightBlue: '#ADD8E6',
};

export const DarkTheme: ExtendedTheme = {
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    backgroundColor: platte.black,
    textColor: platte.white,
    primary: platte.lightGrey,
    background: platte.white,
    card: platte.black,
    text: platte.black,
    notification: platte.black,
    border: platte.black,
    grey: platte.lightGrey,
    error: platte.lightRose,
  },
};

export const LightTheme: ExtendedTheme = {
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    backgroundColor: platte.white,
    textColor: platte.black,
    primary: platte.lightBlue,
    background: platte.white,
    card: platte.white,
    text: platte.white,
    notification: platte.white,
    border: platte.white,
    grey: platte.lightGrey,
    error: platte.lightRose,
  },
};
