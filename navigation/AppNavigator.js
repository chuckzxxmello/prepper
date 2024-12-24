import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Setup Screens
import GoalScreen from '../screens/setup/GoalScreen';
import GenderScreen from '../screens/setup/GenderScreen';
import ActivityScreen from '../screens/setup/ActivityScreen';
import PhysicalScreen from '../screens/setup/PhysicalScreen';
import MacroResultScreen from '../screens/setup/MacroResultScreen';
import MainTabs from './MainTabs';
import RecipeDetailScreen from '../screens/dashboard/RecipeDetailScreen';

// Auth Screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen'; 

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
    <Stack.Navigator initialRouteName="Welcome">
        {/* Auth Stack */} 
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ headerShown: false }} />    

        {/* Setup Stack */}
        <Stack.Screen name="Goal" component={GoalScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Gender" component={GenderScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Activity" component={ActivityScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Physical" component={PhysicalScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MacroResult" component={MacroResultScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
    );
};

export default AppNavigator;
