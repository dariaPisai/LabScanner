import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '../theme';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import GradientButton from '../components/GradientButton';
import { apiGetResult } from '../services/api';

const RiskGauge = ({ disease, risk, level }) => {
    const percentage = Math.round(risk * 100);
    const barColor =
        level === 'high' ? colors.critical : level === 'moderate' ? colors.warning : colors.normal;

    return (
        <View style={styles.riskRow}>
            <View style={styles.riskHeader}>
                <Text style={styles.riskDisease}>{disease}</Text>
                <StatusBadge status={level} small />
            </View>
            <View style={styles.riskBarOuter}>
                <View style={[styles.riskBarInner, { width: `${percentage}%`, backgroundColor: barColor }]} />
            </View>
            <Text style={[styles.riskPercent, { color: barColor }]}>{percentage}%</Text>
        </View>
    );
};

export default function ResultsScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const [data, setData] = useState(route?.params?.data || null);
    const [loading, setLoading] = useState(!data);

    useEffect(() => {
        const resultId = route?.params?.resultId;
        if (resultId && !data) {
            apiGetResult(resultId)
                .then(setData)
                .catch(err => console.log('Failed to fetch result', err))
                .finally(() => setLoading(false));
        }
    }, [route?.params?.resultId]);

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    const labValues = data?.values || [];
    const riskScores = data?.riskScores || [];
    const flaggedCount = labValues.filter((v) => v.status !== 'normal').length;
    const resultId = route?.params?.resultId || data?.id;

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
                <Text style={styles.headerTitle}>Results</Text>
                <TouchableOpacity style={styles.shareBtn}>
                    <Ionicons name="share-outline" size={22} color={colors.white} />
                </TouchableOpacity>
            </LinearGradient>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Summary Card */}
                <Card style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                        <View>
                            <Text style={styles.summaryLabel}>Lab Values</Text>
                            <Text style={styles.summaryCount}>{labValues.length} tests</Text>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View>
                            <Text style={styles.summaryLabel}>Flagged</Text>
                            <Text style={[styles.summaryCount, flaggedCount > 0 && { color: colors.warning }]}>
                                {flaggedCount} values
                            </Text>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View>
                            <Text style={styles.summaryLabel}>Status</Text>
                            <StatusBadge status={flaggedCount > 2 ? 'warning' : 'normal'} small />
                        </View>
                    </View>
                </Card>

                {/* Lab Values */}
                <Text style={styles.sectionTitle}>Lab Values</Text>
                <Card style={styles.valuesCard}>
                    {labValues.map((item, index) => (
                        <View
                            key={index}
                            style={[styles.valueRow, index < labValues.length - 1 && styles.valueRowBorder]}
                        >
                            <View style={styles.valueInfo}>
                                <Text style={styles.valueName}>{item.name}</Text>
                                <Text style={styles.valueRef}>Ref: {item.refRange}</Text>
                            </View>
                            <View style={styles.valueRight}>
                                <Text
                                    style={[
                                        styles.valueNum,
                                        item.status === 'warning' && { color: colors.warning },
                                        item.status === 'critical' && { color: colors.critical },
                                    ]}
                                >
                                    {item.value}
                                    <Text style={styles.valueUnit}> {item.unit}</Text>
                                </Text>
                                <StatusBadge status={item.status} small />
                            </View>
                        </View>
                    ))}
                </Card>

                {/* Risk Assessment */}
                {riskScores.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Risk Assessment</Text>
                        <Card style={styles.riskCard}>
                            {riskScores.map((score, index) => (
                                <RiskGauge key={index} {...score} />
                            ))}
                        </Card>
                    </>
                )}

                {/* CTA */}
                <GradientButton
                    title="View Recommendations"
                    onPress={() =>
                        navigation.navigate('Recommendations', {
                            resultId: resultId,
                        })
                    }
                    icon={<Ionicons name="shield-checkmark" size={20} color={colors.white} />}
                    style={styles.ctaBtn}
                />

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
    shareBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 8,
    },
    // Summary
    summaryCard: {
        marginBottom: 24,
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    summaryLabel: {
        ...typography.caption,
        color: colors.textMuted,
        marginBottom: 4,
    },
    summaryCount: {
        ...typography.h4,
        color: colors.white,
    },
    summaryDivider: {
        width: 1,
        height: 36,
        backgroundColor: colors.border,
    },
    // Section
    sectionTitle: {
        ...typography.h4,
        color: colors.white,
        marginBottom: 12,
    },
    // Values
    valuesCard: {
        marginBottom: 24,
    },
    valueRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
    },
    valueRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    valueInfo: {
        flex: 1,
    },
    valueName: {
        ...typography.bodyBold,
        color: colors.white,
        marginBottom: 2,
    },
    valueRef: {
        ...typography.small,
        color: colors.textMuted,
    },
    valueRight: {
        alignItems: 'flex-end',
        gap: 4,
    },
    valueNum: {
        ...typography.bodyBold,
        color: colors.normal,
    },
    valueUnit: {
        ...typography.caption,
        fontWeight: '400',
    },
    // Risk
    riskCard: {
        marginBottom: 24,
        gap: 18,
    },
    riskRow: {
        gap: 6,
    },
    riskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    riskDisease: {
        ...typography.bodyBold,
        color: colors.white,
    },
    riskBarOuter: {
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.surfaceLight,
        overflow: 'hidden',
    },
    riskBarInner: {
        height: '100%',
        borderRadius: 3,
    },
    riskPercent: {
        ...typography.small,
        fontWeight: '600',
        alignSelf: 'flex-end',
    },
    // CTA
    ctaBtn: {
        marginTop: 4,
    },
});
