import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import GoalScreen from '../screens/setup/GoalScreen';
import GenderScreen from '../screens/setup/GenderScreen';
import ActivityScreen from '../screens/setup/ActivityScreen';
import PhysicalScreen from '../screens/setup/PhysicalScreen';
import MainTabs from './MainTabs';

// Auth Screens (correcting the folder path)
import LoginScreen from '../screens/login/LoginScreen';
import SignupScreen from '../screens/login/SignupScreen';
import ForgotPasswordScreen from '../screens/login/ForgotPasswordScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Login">
            {/* Authentication Screens */}
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />

            {/* Setup Screens */}
            <Stack.Screen name="Goal" component={GoalScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Gender" component={GenderScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Activity" component={ActivityScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Physical" component={PhysicalScreen} options={{ headerShown: false }} />

            {/* Main App Tabs */}
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default AppNavigator;
