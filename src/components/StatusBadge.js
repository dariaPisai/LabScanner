import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';

const statusConfig = {
    normal: { bg: 'rgba(0, 212, 170, 0.15)', color: colors.normal, label: 'Normal' },
    warning: { bg: 'rgba(255, 179, 71, 0.15)', color: colors.warning, label: 'Elevated' },
    critical: { bg: 'rgba(255, 107, 107, 0.15)', color: colors.critical, label: 'Critical' },
    low: { bg: 'rgba(0, 212, 170, 0.15)', color: colors.normal, label: 'Low Risk' },
    moderate: { bg: 'rgba(255, 179, 71, 0.15)', color: colors.warning, label: 'Moderate' },
    high: { bg: 'rgba(255, 107, 107, 0.15)', color: colors.critical, label: 'High Risk' },
};

export default function StatusBadge({ status, label, small = false }) {
    const config = statusConfig[status] || statusConfig.normal;
    const displayLabel = label || config.label;

    return (
        <View style={[styles.badge, { backgroundColor: config.bg }, small && styles.badgeSmall]}>
            <View style={[styles.dot, { backgroundColor: config.color }]} />
            <Text style={[styles.label, { color: config.color }, small && styles.labelSmall]}>
                {displayLabel}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    badgeSmall: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    label: {
        ...typography.captionBold,
    },
    labelSmall: {
        ...typography.small,
    },
});
