import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '../theme';

export default function Header({ title, navigation, showBack = false, showMenu = true, rightAction }) {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
            <View style={styles.row}>
                {showBack ? (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                        <Ionicons name="chevron-back" size={24} color={colors.white} />
                    </TouchableOpacity>
                ) : showMenu ? (
                    <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.iconBtn}>
                        <Ionicons name="menu" size={26} color={colors.white} />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.iconBtn} />
                )}

                <Text style={styles.title} numberOfLines={1}>
                    {title}
                </Text>

                {rightAction ? (
                    rightAction
                ) : (
                    <View style={styles.iconBtn} />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primary,
        paddingBottom: 12,
        paddingHorizontal: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        flex: 1,
        textAlign: 'center',
        color: colors.textPrimary,
        ...typography.h4,
    },
});
