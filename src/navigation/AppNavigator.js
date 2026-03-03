import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
} from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '../theme';

// Screens
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import ScanScreen from '../screens/ScanScreen';
import ResultsScreen from '../screens/ResultsScreen';
import RecommendationsScreen from '../screens/RecommendationsScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useAuth } from '../context/AuthContext';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// ─── Bottom Tabs ─────────────────────────────────────────────

function BottomTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.primaryLight,
                    borderTopColor: colors.border,
                    borderTopWidth: 1,
                    height: 85,
                    paddingBottom: 28,
                    paddingTop: 10,
                },
                tabBarActiveTintColor: colors.accent,
                tabBarInactiveTintColor: colors.textMuted,
                tabBarLabelStyle: {
                    ...typography.small,
                    fontWeight: '600',
                    marginTop: 2,
                },
                tabBarIcon: ({ color, size, focused }) => {
                    let iconName;
                    if (route.name === 'HomeTab') iconName = focused ? 'home' : 'home-outline';
                    else if (route.name === 'ScanTab') iconName = focused ? 'scan' : 'scan-outline';
                    else if (route.name === 'HistoryTab') iconName = focused ? 'time' : 'time-outline';
                    return <Ionicons name={iconName} size={22} color={color} />;
                },
            })}
        >
            <Tab.Screen name="HomeTab" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
            <Tab.Screen name="ScanTab" component={ScanScreen} options={{ tabBarLabel: 'Scan' }} />
            <Tab.Screen name="HistoryTab" component={HistoryScreen} options={{ tabBarLabel: 'History' }} />
        </Tab.Navigator>
    );
}

// ─── Custom Drawer Content ───────────────────────────────────

function CustomDrawerContent(props) {
    const insets = useSafeAreaInsets();
    const { user, signOut } = useAuth();

    const initials = (user?.name || 'U')
        .split(' ')
        .map((n) => n[0])
        .join('');

    const drawerItems = [
        { icon: 'home-outline', label: 'Home', route: 'HomeTabs', params: { screen: 'HomeTab' } },
        { icon: 'time-outline', label: 'History', route: 'HomeTabs', params: { screen: 'HistoryTab' } },
        { icon: 'person-outline', label: 'Profile', route: 'Profile' },
        { icon: 'settings-outline', label: 'Settings', route: null },
    ];

    return (
        <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.drawerContainer}>
            <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
                {/* User section */}
                <View style={[styles.drawerHeader, { paddingTop: insets.top + 8 }]}>
                    <LinearGradient colors={colors.gradientPrimary} style={styles.drawerAvatar}>
                        <View style={styles.drawerAvatarInner}>
                            <Text style={styles.drawerAvatarText}>
                                {initials}
                            </Text>
                        </View>
                    </LinearGradient>
                    <Text style={styles.drawerName}>{user?.name || 'User'}</Text>
                    <Text style={styles.drawerEmail}>{user?.email || ''}</Text>
                </View>

                <View style={styles.drawerDivider} />

                {/* Menu items */}
                <View style={styles.drawerMenu}>
                    {drawerItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.drawerItem}
                            activeOpacity={0.7}
                            onPress={() => {
                                if (item.route) {
                                    props.navigation.navigate(item.route, item.params || {});
                                }
                                props.navigation.closeDrawer();
                            }}
                        >
                            <Ionicons name={item.icon} size={22} color={colors.textSecondary} />
                            <Text style={styles.drawerItemLabel}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Logout */}
                <View style={{ flex: 1 }} />
                <TouchableOpacity
                    style={styles.drawerLogout}
                    onPress={() => {
                        signOut();
                        props.navigation.closeDrawer();
                        props.navigation.getParent()?.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    }}
                >
                    <Ionicons name="log-out-outline" size={22} color={colors.critical} />
                    <Text style={[styles.drawerItemLabel, { color: colors.critical }]}>Logout</Text>
                </TouchableOpacity>

                <View style={{ height: insets.bottom + 20 }} />
            </DrawerContentScrollView>
        </LinearGradient>
    );
}

// ─── Drawer Navigator ────────────────────────────────────────

function DrawerNavigator() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerType: 'front',
                drawerStyle: {
                    width: 280,
                    backgroundColor: colors.primary,
                },
                overlayColor: 'rgba(0, 0, 0, 0.6)',
            }}
        >
            <Drawer.Screen name="HomeTabs" component={BottomTabs} />
            <Drawer.Screen name="Profile" component={ProfileScreen} />
        </Drawer.Navigator>
    );
}

// ─── Root Stack ──────────────────────────────────────────────

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {/* Auth screens */}
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />

                {/* Main app */}
                <Stack.Screen name="Main" component={DrawerNavigator} />

                {/* Global stack screens (on top of everything) */}
                <Stack.Screen name="Results" component={ResultsScreen} />
                <Stack.Screen name="Recommendations" component={RecommendationsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

// ─── Drawer Styles ───────────────────────────────────────────

const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1,
    },
    drawerHeader: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    drawerAvatar: {
        width: 60,
        height: 60,
        borderRadius: 20,
        padding: 2,
        marginBottom: 12,
    },
    drawerAvatarInner: {
        flex: 1,
        borderRadius: 18,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    drawerAvatarText: {
        ...typography.h4,
        color: colors.accent,
    },
    drawerName: {
        ...typography.h4,
        color: colors.white,
        marginBottom: 2,
    },
    drawerEmail: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    drawerDivider: {
        height: 1,
        backgroundColor: colors.border,
        marginHorizontal: 20,
        marginBottom: 12,
    },
    drawerMenu: {
        paddingHorizontal: 12,
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 12,
    },
    drawerItemLabel: {
        ...typography.body,
        color: colors.textSecondary,
    },
    drawerLogout: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingVertical: 14,
        paddingHorizontal: 24,
        marginHorizontal: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 107, 107, 0.08)',
    },
});
