import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme';

export default function Card({ children, style, gradient = colors.gradientCard }) {
    return (
        <View style={[styles.outer, style]}>
            <LinearGradient
                colors={gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <View style={styles.inner}>{children}</View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    outer: {
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 10,
    },
    gradient: {
        borderRadius: 20,
    },
    inner: {
        padding: 20,
    },
});
