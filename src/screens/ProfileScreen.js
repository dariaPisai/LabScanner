import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    StatusBar,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '../theme';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';

const menuItems = [
    { icon: 'person-outline', label: 'Edit Profile', color: colors.accent },
    { icon: 'notifications-outline', label: 'Notifications', color: colors.info },
    { icon: 'shield-checkmark-outline', label: 'Privacy & Security', color: colors.warning },
    { icon: 'help-circle-outline', label: 'Help & Support', color: colors.textSecondary },
    { icon: 'information-circle-outline', label: 'About LabScanner', color: colors.textSecondary },
];

export default function ProfileScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const { user } = useAuth();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={[colors.primary, colors.primaryLight]}
                style={[styles.header, { paddingTop: insets.top + 12 }]}
            >
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color={colors.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <View style={{ width: 40 }} />
            </LinearGradient>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Avatar & Info */}
                <View style={styles.avatarSection}>
                    <LinearGradient
                        colors={colors.gradientPrimary}
                        style={styles.avatarGradient}
                    >
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {(user?.name || 'U')
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                            </Text>
                        </View>
                    </LinearGradient>
                    <Text style={styles.userName}>{user?.name || 'User'}</Text>
                    <Text style={styles.userEmail}>{user?.email || ''}</Text>
                    <Text style={styles.memberSince}>
                        Member since {new Date(user?.memberSince || Date.now()).toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                    </Text>
                </View>

                {/* Stats */}
                <Card style={styles.statsCard}>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNum}>5</Text>
                            <Text style={styles.statLabel}>Scans</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNum}>33</Text>
                            <Text style={styles.statLabel}>Tests</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNum}>9</Text>
                            <Text style={styles.statLabel}>Months</Text>
                        </View>
                    </View>
                </Card>

                {/* Menu Items */}
                <Card style={styles.menuCard}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.menuItem,
                                index < menuItems.length - 1 && styles.menuItemBorder,
                            ]}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
                                <Ionicons name={item.icon} size={20} color={item.color} />
                            </View>
                            <Text style={styles.menuLabel}>{item.label}</Text>
                            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                        </TouchableOpacity>
                    ))}
                </Card>

                {/* Version */}
                <Text style={styles.version}>LabScanner v1.0.0</Text>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    backBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        ...typography.h4,
        color: colors.white,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    // Avatar
    avatarSection: {
        alignItems: 'center',
        marginBottom: 28,
    },
    avatarGradient: {
        width: 96,
        height: 96,
        borderRadius: 32,
        padding: 3,
        marginBottom: 16,
    },
    avatar: {
        flex: 1,
        borderRadius: 30,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        ...typography.h2,
        color: colors.accent,
    },
    userName: {
        ...typography.h3,
        color: colors.white,
        marginBottom: 4,
    },
    userEmail: {
        ...typography.body,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    memberSince: {
        ...typography.caption,
        color: colors.textMuted,
    },
    // Stats
    statsCard: {
        marginBottom: 20,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statNum: {
        ...typography.h2,
        color: colors.accent,
        marginBottom: 2,
    },
    statLabel: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    statDivider: {
        width: 1,
        height: 36,
        backgroundColor: colors.border,
    },
    // Menu
    menuCard: {
        marginBottom: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        gap: 14,
    },
    menuItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    menuIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuLabel: {
        ...typography.body,
        color: colors.white,
        flex: 1,
    },
    version: {
        ...typography.caption,
        color: colors.textMuted,
        textAlign: 'center',
    },
});
