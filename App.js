import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import screens
import GoalScreen from './screens/GoalScreen';
import GenderScreen from './screens/GenderScreen';
import MealPlanScreen from './screens/MealPlanScreen';
import RecipeLibraryScreen from './screens/RecipeLibraryScreen';
import ScheduleScreen from './screens/ScheduleScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Meal Plan') {
            iconName = focused ? 'fast-food' : 'fast-food-outline';
          } else if (route.name === 'Recipe Library') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Schedule') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6A0DAD',
        tabBarInactiveTintColor: '#B39DDB',
      })}
    >
      <Tab.Screen name="Meal Plan" component={MealPlanScreen} />
      <Tab.Screen name="Recipe Library" component={RecipeLibraryScreen} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
    </Tab.Navigator>
  );
}

// Main App Navigation
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Goal">
        <Stack.Screen name="Goal" component={GoalScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Gender" component={GenderScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
