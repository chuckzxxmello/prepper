import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RecipeScreen from '../screens/dashboard/RecipeScreen';
import HomeScreen from '../screens/dashboard/HomeScreen';
import GroceriesScreen from '../screens/dashboard/GroceriesScreen';
import globalStyle from '../constants/GlobalStyle'; // Import global styles

const Tab = createBottomTabNavigator();

const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false, // Disable the default header
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Recipes') {
                        iconName = focused ? 'book' : 'book-outline'; // Use book icons for Recipes
                    } else if (route.name === 'Groceries') {
                        iconName = focused ? 'cart' : 'cart-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },

                tabBarActiveTintColor: '#BB86FC', // Dark mode primary color
                tabBarInactiveTintColor: '#B0B0B0', // Light gray for inactive tabs
                tabBarStyle: {
                    backgroundColor: '#121212', // Dark background color
                    borderTopWidth: 0,
                    elevation: 5,
                },
                tabBarLabelStyle: {
                    ...globalStyle.textRegular, // Apply global font for labels
                    fontSize: 12, // Ensure the font size matches the design
                },
            })}
        >
            <Tab.Screen name="Recipes" component={RecipeScreen} />
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Groceries" component={GroceriesScreen} />
        </Tab.Navigator>
    );
};

export default MainTabs;
