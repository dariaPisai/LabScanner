import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography } from '../theme';

export default function GradientButton({
    title,
    onPress,
    gradient = colors.gradientPrimary,
    style,
    textStyle,
    loading = false,
    disabled = false,
    icon,
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            style={[styles.wrapper, disabled && styles.disabled, style]}
        >
            <LinearGradient
                colors={gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
            >
                {loading ? (
                    <ActivityIndicator color={colors.white} />
                ) : (
                    <>
                        {icon}
                        <Text style={[styles.text, textStyle]}>{title}</Text>
                    </>
                )}
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: colors.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    gradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 32,
        gap: 8,
    },
    text: {
        color: colors.white,
        ...typography.button,
    },
    disabled: {
        opacity: 0.5,
    },
});
