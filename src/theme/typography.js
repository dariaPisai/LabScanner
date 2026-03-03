import { Platform } from 'react-native';

const fontFamily = Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
});

export const typography = {
    fontFamily,

    // Sizes
    h1: { fontSize: 32, fontWeight: '800', lineHeight: 40 },
    h2: { fontSize: 26, fontWeight: '700', lineHeight: 34 },
    h3: { fontSize: 20, fontWeight: '700', lineHeight: 28 },
    h4: { fontSize: 17, fontWeight: '600', lineHeight: 24 },
    body: { fontSize: 15, fontWeight: '400', lineHeight: 22 },
    bodyBold: { fontSize: 15, fontWeight: '600', lineHeight: 22 },
    caption: { fontSize: 13, fontWeight: '400', lineHeight: 18 },
    captionBold: { fontSize: 13, fontWeight: '600', lineHeight: 18 },
    small: { fontSize: 11, fontWeight: '400', lineHeight: 16 },
    button: { fontSize: 16, fontWeight: '700', lineHeight: 22, letterSpacing: 0.5 },
};
