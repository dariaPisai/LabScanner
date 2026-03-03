import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    StatusBar,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '../theme';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { apiGetResults } from '../services/api';

const HistoryItem = ({ item, onPress }) => {
    const dateObj = new Date(item.date);
    const month = dateObj.toLocaleString('default', { month: 'short' });
    const day = dateObj.getDate();

    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
            <Card style={styles.historyCard}>
                <View style={styles.historyRow}>
                    <View style={styles.dateBox}>
                        <Text style={styles.dateMonth}>{month}</Text>
                        <Text style={styles.dateDay}>{day}</Text>
                    </View>
                    <View style={styles.historyInfo}>
                        <Text style={styles.historyTitle}>{item.title}</Text>
                        <View style={styles.historyMeta}>
                            <Text style={styles.historyTests}>{item.totalTests} tests</Text>
                            {item.flagCount > 0 && (
                                <Text style={styles.historyFlags}>
                                    • {item.flagCount} flagged
                                </Text>
                            )}
                        </View>
                    </View>
                    <View style={styles.historyRight}>
                        <StatusBadge status={item.overallStatus} small />
                        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );
};

export default function HistoryScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [refreshing, setRefreshing] = useState(false);
    const [results, setResults] = useState([]);

    const fetchHistory = useCallback(async () => {
        try {
            const data = await apiGetResults();
            setResults(data);
        } catch (err) {
            console.log('Failed to fetch history', err);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchHistory();
        setRefreshing(false);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={[colors.primary, colors.primaryLight]}
                style={[styles.header, { paddingTop: insets.top + 12 }]}
            >
                <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuBtn}>
                    <Ionicons name="menu" size={26} color={colors.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>History</Text>
                <TouchableOpacity style={styles.filterBtn}>
                    <Ionicons name="filter" size={20} color={colors.white} />
                </TouchableOpacity>
            </LinearGradient>

            <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <HistoryItem
                        item={item}
                        onPress={() => navigation.navigate('Results', { resultId: item.id })}
                    />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.accent}
                        colors={[colors.accent]}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="document-text-outline" size={56} color={colors.textMuted} />
                        <Text style={styles.emptyTitle}>No Results Yet</Text>
                        <Text style={styles.emptySubtitle}>
                            Scan or upload your lab results to see them here
                        </Text>
                    </View>
                }
            />
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
    menuBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        ...typography.h4,
        color: colors.white,
    },
    filterBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: colors.surfaceLight,
        borderWidth: 1,
        borderColor: colors.border,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 30,
    },
    // History Item
    historyCard: {
        marginBottom: 12,
    },
    historyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    dateBox: {
        width: 50,
        height: 54,
        borderRadius: 14,
        backgroundColor: colors.accentSoft,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dateMonth: {
        ...typography.small,
        color: colors.accent,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    dateDay: {
        ...typography.h4,
        color: colors.accent,
    },
    historyInfo: {
        flex: 1,
    },
    historyTitle: {
        ...typography.bodyBold,
        color: colors.white,
        marginBottom: 4,
    },
    historyMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    historyTests: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    historyFlags: {
        ...typography.caption,
        color: colors.warning,
    },
    historyRight: {
        alignItems: 'center',
        gap: 8,
    },
    // Empty state
    emptyContainer: {
        alignItems: 'center',
        paddingTop: 80,
        gap: 12,
    },
    emptyTitle: {
        ...typography.h3,
        color: colors.white,
    },
    emptySubtitle: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});
