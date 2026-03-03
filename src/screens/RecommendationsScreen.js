import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '../theme';
import Card from '../components/Card';
import GradientButton from '../components/GradientButton';
import { apiGetRecommendations } from '../services/api';

const urgencyColors = {
    high: colors.critical,
    moderate: colors.warning,
    low: colors.normal,
};

const lifestyleIcons = {
    walk: 'walk',
    restaurant: 'restaurant',
    water: 'water',
    bed: 'bed',
};

export default function RecommendationsScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        const resultId = route?.params?.resultId;
        if (resultId) {
            apiGetRecommendations(resultId)
                .then(setRecommendations)
                .catch(err => console.log('Failed to fetch recommendations', err))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [route?.params?.resultId]);

    const doctorRecs = recommendations.filter((r) => r.type === 'doctor');
    const lifestyleRecs = recommendations.filter((r) => r.type === 'lifestyle');

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

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
                <Text style={styles.headerTitle}>Recommendations</Text>
                <View style={{ width: 40 }} />
            </LinearGradient>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {loading ? (
                    <View style={{ paddingTop: 60, alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={colors.accent} />
                    </View>
                ) : (
                    <>
                        {/* Doctors Section */}
                        <View style={styles.sectionHeader}>
                            <Ionicons name="medical" size={20} color={colors.accent} />
                            <Text style={styles.sectionTitle}>Consult a Specialist</Text>
                        </View>
                        {doctorRecs.map((rec) => (
                            <Card key={rec.id} style={styles.doctorCard}>
                                <View style={styles.doctorHeader}>
                                    <View
                                        style={[
                                            styles.doctorIcon,
                                            { backgroundColor: `${urgencyColors[rec.urgency]}20` },
                                        ]}
                                    >
                                        <Ionicons
                                            name={rec.icon}
                                            size={24}
                                            color={urgencyColors[rec.urgency]}
                                        />
                                    </View>
                                    <View style={styles.doctorInfo}>
                                        <Text style={styles.doctorSpecialty}>{rec.specialty}</Text>
                                        <View style={styles.urgencyRow}>
                                            <View
                                                style={[
                                                    styles.urgencyDot,
                                                    { backgroundColor: urgencyColors[rec.urgency] },
                                                ]}
                                            />
                                            <Text
                                                style={[
                                                    styles.urgencyText,
                                                    { color: urgencyColors[rec.urgency] },
                                                ]}
                                            >
                                                {rec.urgency === 'high'
                                                    ? 'High Priority'
                                                    : rec.urgency === 'moderate'
                                                        ? 'Recommended'
                                                        : 'Optional'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <Text style={styles.doctorReason}>{rec.reason}</Text>
                                <TouchableOpacity
                                    style={styles.bookBtn}
                                    onPress={() => Alert.alert('Coming Soon', 'Appointment booking will be available in a future update.')}
                                >
                                    <LinearGradient
                                        colors={colors.gradientPrimary}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.bookBtnGradient}
                                    >
                                        <Ionicons name="calendar-outline" size={16} color={colors.white} />
                                        <Text style={styles.bookBtnText}>Book Appointment</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </Card>
                        ))}

                        {/* Lifestyle Section */}
                        <View style={[styles.sectionHeader, { marginTop: 8 }]}>
                            <Ionicons name="leaf" size={20} color={colors.accent} />
                            <Text style={styles.sectionTitle}>Lifestyle Adjustments</Text>
                        </View>
                        {lifestyleRecs.map((rec) => {
                            const isExpanded = expandedId === rec.id;
                            return (
                                <TouchableOpacity
                                    key={rec.id}
                                    activeOpacity={0.8}
                                    onPress={() => toggleExpand(rec.id)}
                                >
                                    <Card style={styles.lifestyleCard}>
                                        <View style={styles.lifestyleRow}>
                                            <View style={styles.lifestyleIcon}>
                                                <Ionicons
                                                    name={lifestyleIcons[rec.icon] || 'fitness'}
                                                    size={22}
                                                    color={colors.accent}
                                                />
                                            </View>
                                            <Text style={styles.lifestyleTitle}>{rec.title}</Text>
                                            <Ionicons
                                                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                                size={18}
                                                color={colors.textMuted}
                                            />
                                        </View>
                                        {isExpanded && (
                                            <Text style={styles.lifestyleDesc}>{rec.description}</Text>
                                        )}
                                    </Card>
                                </TouchableOpacity>
                            );
                        })}

                        {/* Disclaimer */}
                        <Card
                            style={styles.disclaimerCard}
                            gradient={['rgba(255, 179, 71, 0.08)', 'rgba(255, 107, 107, 0.05)']}
                        >
                            <View style={styles.disclaimerRow}>
                                <Ionicons name="warning" size={20} color={colors.warning} />
                                <Text style={styles.disclaimerText}>
                                    These recommendations are AI-generated and should not replace professional medical
                                    advice. Always consult with a healthcare provider for diagnosis and treatment.
                                </Text>
                            </View>
                        </Card>

                        <View style={{ height: 40 }} />
                    </>
                )}
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
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 8,
    },
    // Section
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    sectionTitle: {
        ...typography.h4,
        color: colors.white,
    },
    // Doctor Cards
    doctorCard: {
        marginBottom: 14,
    },
    doctorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 12,
    },
    doctorIcon: {
        width: 50,
        height: 50,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    doctorInfo: {
        flex: 1,
    },
    doctorSpecialty: {
        ...typography.h4,
        color: colors.white,
        marginBottom: 4,
    },
    urgencyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    urgencyDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    urgencyText: {
        ...typography.small,
        fontWeight: '600',
    },
    doctorReason: {
        ...typography.caption,
        color: colors.textSecondary,
        lineHeight: 20,
        marginBottom: 16,
    },
    bookBtn: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    bookBtnGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        gap: 8,
        borderRadius: 12,
    },
    bookBtnText: {
        ...typography.captionBold,
        color: colors.white,
    },
    // Lifestyle
    lifestyleCard: {
        marginBottom: 10,
    },
    lifestyleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    lifestyleIcon: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: colors.accentSoft,
        alignItems: 'center',
        justifyContent: 'center',
    },
    lifestyleTitle: {
        ...typography.bodyBold,
        color: colors.white,
        flex: 1,
    },
    lifestyleDesc: {
        ...typography.caption,
        color: colors.textSecondary,
        lineHeight: 20,
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: colors.borderLight,
    },
    // Disclaimer
    disclaimerCard: {
        marginTop: 12,
    },
    disclaimerRow: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
    },
    disclaimerText: {
        ...typography.small,
        color: colors.textSecondary,
        flex: 1,
        lineHeight: 18,
    },
});
