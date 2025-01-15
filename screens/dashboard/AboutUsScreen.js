import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Ensure Ionicons is imported for the icon

const AboutUsScreen = () => {
    const [pressCount, setPressCount] = useState(0);
    const navigation = useNavigation();

    useEffect(() => {
        if (pressCount === 3) {
            navigation.navigate('Secret'); // secret!
        }
    }, [pressCount, navigation]);

    const handlePress = () => {
        setPressCount(prevCount => prevCount + 1);
    };

    // Text to display based on button presses
    let buttonText = "HIT ME!";
    if (pressCount === 1) {
        buttonText = "PRESS AGAIN!";
    } else if (pressCount === 2) {
        buttonText = "I SAID, PRESS AGAIN!";
    } else if (pressCount >= 3) {
        buttonText = "WO WEE!";
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>About Us</Text>
            <Text style={styles.description}>
                We are a team of passionate developers working to create fun and useful applications. Our meal planning app helps you plan your weekly meals and generate grocery lists based on your meal plans. 
                Say goodbye to food waste and forgotten ingredients! 🥑🍅
            </Text>

            <Text style={styles.header}>How It Works</Text>
            <Text style={styles.description}>
                1. Plan your meals for the week. 🍴
                {"\n"}2. Generate a grocery list based on your meal plan. 🛒
                {"\n"}3. Shop efficiently, saving time and reducing waste! 🌱
            </Text>

            <Text style={styles.header}>Why Choose Us?</Text>
            <Text style={styles.description}>
                Our app is designed for busy individuals and families who want a simple, effective tool to organize their meals and make sure they have everything they need for the week. Say hello to stress-free shopping and cooking! 👨‍🍳
            </Text>

            <Text style={styles.header}>Created and Developed by:</Text>
            <Text style={styles.description}>
                Chuckie Espanola{"\n"}
                Mark Daniel Iguban{"\n"}
                Ron Amielle Umandap{"\n"}
                Eman Gollemas
            </Text>

            {/* Fun button */}
            <TouchableOpacity style={styles.button} onPress={handlePress}>
                <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E1E1E', // Dark background
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#9D4EDD', // Purple header text
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        color: '#B0B0B0', // Light gray description text
        textAlign: 'center',
        marginBottom: 24,
    },
    button: {
        backgroundColor: '#9D4EDD', // Purple background for button
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        marginBottom: 16,
    },
    buttonText: {
        color: '#FFFFFF', // White text for button
        fontSize: 18,
        fontWeight: 'bold',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2E0441', // Dark purple background for secondary button
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        marginTop: 16,
    },
    optionText: {
        color: '#FFFFFF', // White text for option button
        fontSize: 18,
        fontWeight: 'bold',
    },
    optionDetails: {
        marginLeft: 8,
    },
    optionIcon: {
        marginLeft: 4,
    },
});

export default AboutUsScreen;
