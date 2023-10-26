import '@react-navigation/native';

export type Colors = {
  backgroundColor: string;
  textColor: string;
  grey: string;
  error: string;
  border: string;

  // manadatory colors
  primary: string;
  background: string;
  card: string;
  text: string;
  notification: string;
};

// Override the theme in react native navigation to accept our custom theme props.
declare module '@react-navigation/native' {
  export type ExtendedTheme = {
    dark: boolean;
    colors: Colors;
  };

  export function useTheme(): ExtendedTheme;
}
