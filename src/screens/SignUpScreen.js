import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    StatusBar,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme';
import GradientButton from '../components/GradientButton';
import { useAuth } from '../context/AuthContext';

export default function SignUpScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();

    const handleSignUp = async () => {
        if (password !== confirm) {
            const { Alert } = require('react-native');
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            await signUp({ name, email, password });
            navigation.replace('Main');
        } catch (err) {
            const { Alert } = require('react-native');
            Alert.alert('Sign Up Failed', err.message || 'Please try again.');
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
                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={24} color={colors.white} />
                    </TouchableOpacity>

                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>
                        Start analyzing your lab results with AI-powered insights
                    </Text>

                    <View style={styles.inputWrapper}>
                        <Ionicons name="person-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            placeholderTextColor={colors.textMuted}
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                        />
                    </View>

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

                    <View style={styles.inputWrapper}>
                        <Ionicons name="shield-checkmark-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            placeholderTextColor={colors.textMuted}
                            value={confirm}
                            onChangeText={setConfirm}
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

                    <GradientButton
                        title="Create Account"
                        onPress={handleSignUp}
                        loading={loading}
                        style={styles.signUpBtn}
                    />

                    <TouchableOpacity
                        style={styles.loginLink}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.loginLinkText}>
                            Already have an account?{' '}
                            <Text style={styles.loginLinkAccent}>Sign In</Text>
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
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
    },
    scroll: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 28,
        paddingVertical: 60,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: colors.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        borderWidth: 1,
        borderColor: colors.border,
    },
    title: {
        ...typography.h1,
        color: colors.white,
        marginBottom: 8,
    },
    subtitle: {
        ...typography.body,
        color: colors.textSecondary,
        marginBottom: 36,
    },
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
    signUpBtn: {
        marginTop: 10,
        marginBottom: 24,
    },
    loginLink: {
        alignItems: 'center',
    },
    loginLinkText: {
        ...typography.body,
        color: colors.textSecondary,
    },
    loginLinkAccent: {
        color: colors.accent,
        fontWeight: '700',
    },
});
