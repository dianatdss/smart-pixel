import { Dimensions } from 'react-native'

export const dimensions = {
    fullHeight: Dimensions.get('window').height,
    fullWidth: Dimensions.get('window').width
}

export const colors = {
    primary: '#5F73FF',
    secondary: '#AC6DC7',
    light: '#fafafa',
    dark: '#121212',
    white: '#fafafa'
}

export const padding = {
    sm: 10,
    md: 20,
    lg: 30,
    xl: 40
}
export const gridGutterWidth = padding.lg;
export const borderRadius = 9;
export const fonts = {
    sm: 12,
    md: 18,
    lg: 28,
    primary: 'Cochin'
}
