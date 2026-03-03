import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    StatusBar,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { colors, typography } from '../theme';
import Card from '../components/Card';
import { processImage } from '../services/ocrStub';
import { interpretResults } from '../services/interpretationStub';

export default function ScanScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState('camera');
    const [processing, setProcessing] = useState(false);
    const [processingStep, setProcessingStep] = useState('');
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (processing) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [processing]);

    const handleProcess = async (source) => {
        setProcessing(true);
        try {
            setProcessingStep('Scanning document...');
            Animated.timing(progressAnim, { toValue: 0.3, duration: 800, useNativeDriver: false }).start();
            const ocrResult = await processImage(source);

            setProcessingStep('Extracting lab values...');
            Animated.timing(progressAnim, { toValue: 0.6, duration: 600, useNativeDriver: false }).start();
            await new Promise((r) => setTimeout(r, 800));

            setProcessingStep('Analysing results...');
            Animated.timing(progressAnim, { toValue: 0.9, duration: 600, useNativeDriver: false }).start();
            const interpretation = await interpretResults(ocrResult.extractedText);

            Animated.timing(progressAnim, { toValue: 1, duration: 300, useNativeDriver: false }).start();
            await new Promise((r) => setTimeout(r, 400));

            navigation.navigate('Results', { data: interpretation });
        } catch (err) {
            Alert.alert('Error', 'Failed to process document. Please try again.');
        } finally {
            setProcessing(false);
            progressAnim.setValue(0);
        }
    };

    const handleCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Camera permission is needed to scan documents.');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            quality: 0.8,
            base64: false,
        });
        if (!result.canceled && result.assets?.[0]) {
            handleProcess(result.assets[0].uri);
        }
    };

    const handleUpload = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'image/*'],
                copyToCacheDirectory: true,
            });
            if (!result.canceled && result.assets?.[0]) {
                handleProcess(result.assets[0].uri);
            }
        } catch (err) {
            Alert.alert('Error', 'Could not open document picker.');
        }
    };

    const handleGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Gallery access is needed to select images.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            quality: 0.8,
            base64: false,
        });
        if (!result.canceled && result.assets?.[0]) {
            handleProcess(result.assets[0].uri);
        }
    };

    if (processing) {
        return (
            <LinearGradient colors={[colors.primary, colors.primaryLight]} style={styles.container}>
                <StatusBar barStyle="light-content" />
                <View style={styles.processingContainer}>
                    <Animated.View style={[styles.processingIcon, { transform: [{ scale: pulseAnim }] }]}>
                        <LinearGradient
                            colors={colors.gradientPrimary}
                            style={styles.processingIconInner}
                        >
                            <Ionicons name="flask" size={48} color={colors.white} />
                        </LinearGradient>
                    </Animated.View>
                    <Text style={styles.processingTitle}>Processing</Text>
                    <Text style={styles.processingStep}>{processingStep}</Text>
                    <View style={styles.progressBarOuter}>
                        <Animated.View
                            style={[
                                styles.progressBarInner,
                                {
                                    width: progressAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0%', '100%'],
                                    }),
                                },
                            ]}
                        />
                    </View>
                </View>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient colors={[colors.primary, colors.primaryLight]} style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color={colors.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Scan Results</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'camera' && styles.tabActive]}
                    onPress={() => setActiveTab('camera')}
                >
                    <Ionicons
                        name="camera"
                        size={18}
                        color={activeTab === 'camera' ? colors.accent : colors.textMuted}
                    />
                    <Text style={[styles.tabText, activeTab === 'camera' && styles.tabTextActive]}>
                        Camera
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'upload' && styles.tabActive]}
                    onPress={() => setActiveTab('upload')}
                >
                    <Ionicons
                        name="cloud-upload"
                        size={18}
                        color={activeTab === 'upload' ? colors.accent : colors.textMuted}
                    />
                    <Text style={[styles.tabText, activeTab === 'upload' && styles.tabTextActive]}>
                        Upload
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {activeTab === 'camera' ? (
                    <View style={styles.cameraContent}>
                        <Card style={styles.viewfinderCard}>
                            <View style={styles.viewfinder}>
                                {/* Corner markers */}
                                <View style={[styles.corner, styles.cornerTL]} />
                                <View style={[styles.corner, styles.cornerTR]} />
                                <View style={[styles.corner, styles.cornerBL]} />
                                <View style={[styles.corner, styles.cornerBR]} />
                                <View style={styles.viewfinderCenter}>
                                    <Ionicons name="scan-outline" size={64} color={colors.accent} />
                                    <Text style={styles.viewfinderText}>
                                        Position your lab report within the frame
                                    </Text>
                                </View>
                            </View>
                        </Card>
                        <TouchableOpacity style={styles.captureBtn} onPress={handleCamera} activeOpacity={0.7}>
                            <LinearGradient
                                colors={colors.gradientPrimary}
                                style={styles.captureBtnInner}
                            >
                                <Ionicons name="camera" size={32} color={colors.white} />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.uploadContent}>
                        <TouchableOpacity activeOpacity={0.7} onPress={handleUpload}>
                            <Card style={styles.uploadCard}>
                                <View style={styles.uploadArea}>
                                    <View style={styles.uploadIconWrap}>
                                        <Ionicons name="cloud-upload-outline" size={48} color={colors.accent} />
                                    </View>
                                    <Text style={styles.uploadTitle}>Upload Document</Text>
                                    <Text style={styles.uploadSubtitle}>
                                        Tap to select a PDF or image file of your lab results
                                    </Text>
                                    <View style={styles.uploadFormats}>
                                        <View style={styles.formatTag}>
                                            <Text style={styles.formatText}>PDF</Text>
                                        </View>
                                        <View style={styles.formatTag}>
                                            <Text style={styles.formatText}>JPG</Text>
                                        </View>
                                        <View style={styles.formatTag}>
                                            <Text style={styles.formatText}>PNG</Text>
                                        </View>
                                    </View>
                                </View>
                            </Card>
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.7} onPress={handleGallery}>
                            <Card style={styles.galleryCard}>
                                <View style={styles.galleryRow}>
                                    <View style={styles.galleryIcon}>
                                        <Ionicons name="images-outline" size={24} color={colors.info} />
                                    </View>
                                    <View style={styles.galleryTextWrap}>
                                        <Text style={styles.galleryTitle}>Choose from Gallery</Text>
                                        <Text style={styles.gallerySubtitle}>Select a photo of your lab report</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                                </View>
                            </Card>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 12,
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
    // Tabs
    tabs: {
        flexDirection: 'row',
        marginHorizontal: 20,
        backgroundColor: colors.surfaceLight,
        borderRadius: 14,
        padding: 4,
        borderWidth: 1,
        borderColor: colors.border,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 11,
        gap: 6,
    },
    tabActive: {
        backgroundColor: colors.surface,
    },
    tabText: {
        ...typography.captionBold,
        color: colors.textMuted,
    },
    tabTextActive: {
        color: colors.accent,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    // Camera tab
    cameraContent: {
        flex: 1,
        alignItems: 'center',
    },
    viewfinderCard: {
        width: '100%',
        aspectRatio: 0.75,
    },
    viewfinder: {
        flex: 1,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 280,
    },
    corner: {
        position: 'absolute',
        width: 24,
        height: 24,
        borderColor: colors.accent,
    },
    cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
    cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
    cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 },
    cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 },
    viewfinderCenter: {
        alignItems: 'center',
        gap: 12,
    },
    viewfinderText: {
        ...typography.caption,
        color: colors.textSecondary,
        textAlign: 'center',
        maxWidth: 200,
    },
    captureBtn: {
        marginTop: 28,
        borderRadius: 40,
        padding: 4,
        borderWidth: 3,
        borderColor: 'rgba(0, 212, 170, 0.3)',
    },
    captureBtnInner: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Upload tab
    uploadContent: {
        gap: 16,
    },
    uploadCard: {},
    uploadArea: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    uploadIconWrap: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: colors.accentSoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    uploadTitle: {
        ...typography.h4,
        color: colors.white,
        marginBottom: 6,
    },
    uploadSubtitle: {
        ...typography.caption,
        color: colors.textSecondary,
        textAlign: 'center',
        maxWidth: 240,
        marginBottom: 16,
    },
    uploadFormats: {
        flexDirection: 'row',
        gap: 8,
    },
    formatTag: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: colors.surfaceLight,
        borderWidth: 1,
        borderColor: colors.border,
    },
    formatText: {
        ...typography.small,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    galleryCard: {},
    galleryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    galleryIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(0, 180, 216, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    galleryTextWrap: {
        flex: 1,
    },
    galleryTitle: {
        ...typography.bodyBold,
        color: colors.white,
    },
    gallerySubtitle: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    // Processing
    processingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    processingIcon: {
        marginBottom: 32,
    },
    processingIconInner: {
        width: 100,
        height: 100,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    processingTitle: {
        ...typography.h2,
        color: colors.white,
        marginBottom: 8,
    },
    processingStep: {
        ...typography.body,
        color: colors.textSecondary,
        marginBottom: 32,
    },
    progressBarOuter: {
        width: '100%',
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.surfaceLight,
        overflow: 'hidden',
    },
    progressBarInner: {
        height: '100%',
        borderRadius: 3,
        backgroundColor: colors.accent,
    },
});
