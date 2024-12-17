import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import GoalScreen from '../screens/setup/GoalScreen';
import GenderScreen from '../screens/setup/GenderScreen';
import ActivityScreen from '../screens/setup/ActivityScreen';
import PhysicalScreen from '../screens/setup/PhysicalScreen';
import MainTabs from './MainTabs';


const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Goal">
            <Stack.Screen name="Goal" component={GoalScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Gender" component={GenderScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Activity" component={ActivityScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Physical" component={PhysicalScreen} options={{ headerShown: false }} />
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default AppNavigator;
