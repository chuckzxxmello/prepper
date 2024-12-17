import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import RecipeScreen from '../screens/dashboard/RecipeScreen';
import HomeScreen from '../screens/dashboard/HomeScreen';
import GroceriesScreen from '../screens/dashboard/GroceriesScreen';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Recipes') {
                        iconName = focused ? 'fast-food' : 'fast-food-outline';
                    } else if (route.name === 'Groceries') {
                        iconName = focused ? 'cart' : 'cart-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#6A0DAD',
                tabBarInactiveTintColor: '#B39DDB',
            })}
        >
            <Tab.Screen name="Recipes" component={RecipeScreen} />
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Groceries" component={GroceriesScreen} />
        </Tab.Navigator>
    );
};

export default MainTabs;