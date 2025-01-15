import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Setup Screens
import GoalScreen from '../screens/setup/GoalScreen';
import GenderScreen from '../screens/setup/GenderScreen';
import ActivityScreen from '../screens/setup/ActivityScreen';
import PhysicalScreen from '../screens/setup/PhysicalScreen';
import MacroResultScreen from '../screens/setup/MacroResultScreen';
import RecipeDetailScreen from '../screens/dashboard/RecipeDetailScreen';

// Auth Screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';

// Profile, Me, and Calorie Calculator Screens
import ProfileScreen from '../screens/dashboard/ProfileScreen';
import MeScreen from '../screens/dashboard/MeScreen';
import CalorieCalculatorScreen from '../screens/dashboard/CalorieCalculatorScreen';

// Meal Plan Screens
import MealPlanScreen from '../screens/dashboard/MealPlanScreen';
import GroceriesScreen from '../screens/dashboard/GroceriesScreen';
import RecipeScreen from '../screens/dashboard/RecipeScreen';

// Calorie Intake Screen
import NutrientsIndicatorScreen from '../screens/dashboard/NutrientsIndicatorScreen';

// Custom Meal Plan Screen
import CustomMealPlanScreen from '../screens/dashboard/CustomMealPlanScreen';

// Edit Meal Plan Screen
import EditMealPlanScreen from '../screens/dashboard/EditMealPlanScreen';

// New Water Intake Screen
import WaterIntakeScreen from '../screens/dashboard/WaterIntakeScreen';

// MainTabs
import MainTabs from './MainTabs';

// About Us
import AboutUsScreen from '../screens/dashboard/AboutUsScreen'; 

// Secret!
import Fun from '../screens/dashboard/Fun';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ headerShown: false }} />

      <Stack.Screen name="Goal" component={GoalScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Gender" component={GenderScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Activity" component={ActivityScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Physical" component={PhysicalScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MacroResult" component={MacroResultScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} options={{ headerShown: false }} />

      <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MeScreen" component={MeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CalorieCalculatorScreen" component={CalorieCalculatorScreen} options={{ headerShown: false }} />

      <Stack.Screen name="MealPlanScreen" component={MealPlanScreen} options={{ headerShown: false }} />
      <Stack.Screen name="GroceriesScreen" component={GroceriesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RecipeScreen" component={RecipeScreen} options={{ headerShown: false }} />

      <Stack.Screen name="NutrientsIndicator" component={NutrientsIndicatorScreen} options={{ headerShown: false }} />

      <Stack.Screen name="WaterIntakeScreen" component={WaterIntakeScreen} options={{ headerShown: false }} />

      <Stack.Screen name="CustomMealPlanScreen" component={CustomMealPlanScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EditMealPlanScreen" component={EditMealPlanScreen} options={{ headerShown: false }} />

      <Stack.Screen name="AboutUs" component={AboutUsScreen} options={{ headerShown: false }} /> 
      <Stack.Screen name="Secret" component={Fun} options={{ headerShown: false }} />

      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
