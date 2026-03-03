import React, { useRef, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Dimensions,
    StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '../theme';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { apiGetResults } from '../services/api';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const quickActions = [
    { icon: 'scan', label: 'Scan\nResults', gradient: colors.gradientPrimary, screen: 'ScanTab' },
    { icon: 'document-text', label: 'Upload\nPDF', gradient: colors.gradientPurple, screen: 'ScanTab' },
    { icon: 'time', label: 'View\nHistory', gradient: ['#FF6B6B', '#FF8E53'], screen: 'HistoryTab' },
];

const healthTips = [
    { icon: 'water', tip: 'Stay hydrated — drink at least 8 glasses of water daily for optimal kidney function.', color: colors.info },
    { icon: 'fitness', tip: 'Regular exercise can lower cholesterol by up to 10% and improve insulin sensitivity.', color: colors.accent },
    { icon: 'moon', tip: 'Quality sleep (7–9 hours) helps regulate blood sugar and reduces inflammation markers.', color: colors.warning },
];

export default function HomeScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const { user } = useAuth();
    const [recentResults, setRecentResults] = useState([]);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
        ]).start();

        // Fetch recent results
        apiGetResults()
            .then(results => setRecentResults(results.slice(0, 3)))
            .catch(() => setRecentResults([]));
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            {/* Header */}
            <LinearGradient
                colors={[colors.primary, colors.primaryLight]}
                style={[styles.header, { paddingTop: insets.top + 12 }]}
            >
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuBtn}>
                        <Ionicons name="menu" size={26} color={colors.white} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.notifBtn}>
                        <Ionicons name="notifications-outline" size={22} color={colors.white} />
                        <View style={styles.notifDot} />
                    </TouchableOpacity>
                </View>
                <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                    <Text style={styles.greeting}>{getGreeting()},</Text>
                    <Text style={styles.userName}>{user?.name || 'User'} 👋</Text>
                </Animated.View>
            </LinearGradient>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsRow}>
                    {quickActions.map((action, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.actionCard}
                            activeOpacity={0.7}
                            onPress={() => navigation.navigate(action.screen)}
                        >
                            <LinearGradient
                                colors={action.gradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.actionGradient}
                            >
                                <Ionicons name={action.icon} size={28} color={colors.white} />
                                <Text style={styles.actionLabel}>{action.label}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Recent Results */}
                {recentResults.length > 0 ? (
                    <>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Recent Results</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('HistoryTab')}>
                                <Text style={styles.seeAll}>See All</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentScroll}>
                            {recentResults.map((item, index) => (
                                <TouchableOpacity
                                    key={item.id}
                                    activeOpacity={0.8}
                                    onPress={() => navigation.navigate('Results', { resultId: item.id })}
                                >
                                    <Card style={[styles.recentCard, index === 0 && { marginLeft: 0 }]}>
                                        <Text style={styles.recentDate}>{item.date}</Text>
                                        <Text style={styles.recentTitle} numberOfLines={1}>{item.title}</Text>
                                        <View style={styles.recentStats}>
                                            <Text style={styles.recentStat}>
                                                {item.totalTests} tests
                                            </Text>
                                            {item.flagCount > 0 && (
                                                <StatusBadge status={item.overallStatus} label={`${item.flagCount} flagged`} small />
                                            )}
                                        </View>
                                    </Card>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </>
                ) : (
                    <>
                        <Text style={styles.sectionTitle}>Recent Results</Text>
                        <Card style={{ marginBottom: 28, alignItems: 'center', paddingVertical: 30 }}>
                            <Ionicons name="document-text-outline" size={40} color={colors.textMuted} />
                            <Text style={{ ...typography.body, color: colors.textSecondary, marginTop: 12 }}>
                                No results yet
                            </Text>
                            <Text style={{ ...typography.caption, color: colors.textMuted, marginTop: 4 }}>
                                Scan or upload your first lab report to get started
                            </Text>
                        </Card>
                    </>
                )}

                {/* Health Tips */}
                <Text style={styles.sectionTitle}>Health Tips</Text>
                {healthTips.map((tip, index) => (
                    <Card key={index} style={styles.tipCard}>
                        <View style={styles.tipRow}>
                            <View style={[styles.tipIconWrap, { backgroundColor: `${tip.color}20` }]}>
                                <Ionicons name={tip.icon} size={22} color={tip.color} />
                            </View>
                            <Text style={styles.tipText}>{tip.tip}</Text>
                        </View>
                    </Card>
                ))}

                <View style={{ height: 30 }} />
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
        paddingHorizontal: 20,
        paddingBottom: 24,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    menuBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notifBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notifDot: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.critical,
    },
    greeting: {
        ...typography.body,
        color: colors.textSecondary,
    },
    userName: {
        ...typography.h2,
        color: colors.white,
        marginTop: 2,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        ...typography.h4,
        color: colors.white,
        marginBottom: 16,
    },
    seeAll: {
        ...typography.captionBold,
        color: colors.accent,
        marginBottom: 16,
    },
    // Quick Actions
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 28,
        gap: 12,
    },
    actionCard: {
        flex: 1,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    actionGradient: {
        paddingVertical: 22,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        gap: 10,
    },
    actionLabel: {
        ...typography.captionBold,
        color: colors.white,
        textAlign: 'center',
    },
    // Recent Results
    recentScroll: {
        marginBottom: 28,
        marginHorizontal: -4,
    },
    recentCard: {
        width: width * 0.55,
        marginLeft: 8,
    },
    recentDate: {
        ...typography.caption,
        color: colors.textMuted,
        marginBottom: 4,
    },
    recentTitle: {
        ...typography.bodyBold,
        color: colors.white,
        marginBottom: 12,
    },
    recentStats: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    recentStat: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    // Tips
    tipCard: {
        marginBottom: 12,
    },
    tipRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    tipIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tipText: {
        ...typography.caption,
        color: colors.textSecondary,
        flex: 1,
        lineHeight: 18,
    },
});
