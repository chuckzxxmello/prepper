import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';

// Screens
import RecipeScreen from '../screens/dashboard/RecipeScreen';
import HomeScreen from '../screens/dashboard/HomeScreen';
import GroceriesScreen from '../screens/dashboard/GroceriesScreen';

// Paths to your custom icons
const homeIcon = require('../assets/images/home.png');
const recipesIcon = require('../assets/images/recipes.png');
const groceriesIcon = require('../assets/images/groceries.png');

const Tab = createBottomTabNavigator();

const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused }) => {
                    let iconSource;

                    if (route.name === 'Home') {
                        iconSource = homeIcon;
                    } else if (route.name === 'Recipes') {
                        iconSource = recipesIcon;
                    } else if (route.name === 'Groceries') {
                        iconSource = groceriesIcon;
                    }

                    return (
                        <Image
                            source={iconSource}
                            style={{
                                width: 24,
                                height: 24,
                                tintColor: focused ? '#6A0DAD' : '#B39DDB',
                            }}
                        />
                    );
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
