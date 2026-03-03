import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Dimensions,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme';
import GradientButton from '../components/GradientButton';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();

    const logoAnim = useRef(new Animated.Value(0)).current;
    const formAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(logoAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(formAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleLogin = async () => {
        setLoading(true);
        try {
            await signIn(email, password);
            navigation.replace('Main');
        } catch (err) {
            const { Alert } = require('react-native');
            Alert.alert('Login Failed', err.message || 'Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient colors={[colors.primary, '#0D1F3C', colors.secondary]} style={styles.container}>
            <StatusBar barStyle="light-content" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                {/* Decorative circles */}
                <View style={styles.circle1} />
                <View style={styles.circle2} />
                <View style={styles.circle3} />

                {/* Logo */}
                <Animated.View
                    style={[
                        styles.logoContainer,
                        {
                            opacity: logoAnim,
                            transform: [
                                { translateY: logoAnim.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }) },
                            ],
                        },
                    ]}
                >
                    <View style={styles.logoIcon}>
                        <Ionicons name="scan" size={40} color={colors.accent} />
                    </View>
                    <Text style={styles.logoText}>LabScanner</Text>
                    <Text style={styles.tagline}>Smart Lab Results Analysis</Text>
                </Animated.View>

                {/* Form */}
                <Animated.View
                    style={[
                        styles.formContainer,
                        {
                            opacity: formAnim,
                            transform: [
                                { translateY: formAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) },
                            ],
                        },
                    ]}
                >
                    <View style={styles.inputWrapper}>
                        <Ionicons name="mail-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email address"
                            placeholderTextColor={colors.textMuted}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor={colors.textMuted}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons
                                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                color={colors.textMuted}
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.forgotBtn}>
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <GradientButton title="Sign In" onPress={handleLogin} loading={loading} style={styles.signInBtn} />

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>or</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <TouchableOpacity
                        style={styles.createAccountBtn}
                        onPress={() => navigation.navigate('SignUp')}
                    >
                        <Text style={styles.createAccountText}>
                            Don't have an account?{' '}
                            <Text style={styles.createAccountAccent}>Sign Up</Text>
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 28,
    },
    // Decorative floating circles
    circle1: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(0, 212, 170, 0.06)',
        top: -40,
        right: -60,
    },
    circle2: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(0, 180, 216, 0.05)',
        bottom: 80,
        left: -50,
    },
    circle3: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(168, 85, 247, 0.05)',
        top: height * 0.35,
        right: 20,
    },
    // Logo
    logoContainer: {
        alignItems: 'center',
        marginBottom: 48,
    },
    logoIcon: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: colors.accentSoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(0, 212, 170, 0.3)',
    },
    logoText: {
        ...typography.h1,
        color: colors.white,
        marginBottom: 6,
    },
    tagline: {
        ...typography.body,
        color: colors.textSecondary,
    },
    // Form
    formContainer: {},
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surfaceLight,
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: Platform.OS === 'ios' ? 16 : 4,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: colors.border,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: colors.textPrimary,
        ...typography.body,
    },
    forgotBtn: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotText: {
        ...typography.caption,
        color: colors.accent,
    },
    signInBtn: {
        marginBottom: 24,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border,
    },
    dividerText: {
        ...typography.caption,
        color: colors.textMuted,
        marginHorizontal: 16,
    },
    createAccountBtn: {
        alignItems: 'center',
    },
    createAccountText: {
        ...typography.body,
        color: colors.textSecondary,
    },
    createAccountAccent: {
        color: colors.accent,
        fontWeight: '700',
    },
});
