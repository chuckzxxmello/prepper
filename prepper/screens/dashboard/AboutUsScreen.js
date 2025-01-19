import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import globalStyle from '../../constants/GlobalStyle'; // Import global styles

const AboutUsScreen = () => {
    const [pressCount, setPressCount] = useState(0);
    const navigation = useNavigation();

    useEffect(() => {
        if (pressCount === 3) {
            navigation.navigate('Secret'); // Navigate to the secret screen
        }
    }, [pressCount, navigation]);

    const handlePress = () => {
        setPressCount((prevCount) => prevCount + 1);
    };

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
            <Text style={[globalStyle.textSemiBold, styles.header]}>About Us</Text>
            <Text style={[globalStyle.textRegular, styles.description]}>
                We are a team of passionate developers working to create fun and useful applications. Our meal planning app helps you plan your weekly meals and generate grocery lists based on your meal plans. 
                Say goodbye to food waste and forgotten ingredients!
            </Text>

            <Text style={[globalStyle.textSemiBold, styles.header]}>How It Works</Text>
            <Text style={[globalStyle.textRegular, styles.description]}>
                1. Plan your meals for the week.
                {"\n"}2. Generate a grocery list based on your meal plan.
                {"\n"}3. Shop efficiently, saving time and reducing waste!
            </Text>

            <Text style={[globalStyle.textSemiBold, styles.header]}>Why Choose Us?</Text>
            <Text style={[globalStyle.textRegular, styles.description]}>
                Our app is designed for busy individuals and families who want a simple, effective tool to organize their meals and make sure they have everything they need for the week. Say hello to stress-free shopping and cooking!
            </Text>

            <Text style={[globalStyle.textSemiBold, styles.header]}>Created and Developed by:</Text>
            <Text style={[globalStyle.textRegular, styles.description]}>
                Chuckie Espanola{"\n"}
                Mark Daniel Iguban{"\n"}
                Ron Amielle Umandap{"\n"}
                Eman Gollemas
            </Text>

            <TouchableOpacity style={styles.button} onPress={handlePress}>
                <Text style={[globalStyle.textSemiBold, styles.buttonText]}>{buttonText}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212', // Dark background for a sleek look
        padding: 20,
        borderRadius: 12, // Soft rounded corners for the container
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.25, 
        shadowRadius: 4, 
        elevation: 5, // Adding shadow for a floating effect
    },
    header: {
        fontSize: 26, // Larger font size for headers
        color: '#9D4EDD', // Purple header text
        marginBottom: 12, // Slightly reduced space between sections
        letterSpacing: 1, // Spacing out the letters for a more elegant feel
    },
    description: {
        fontSize: 18, // Larger text for descriptions
        color: '#E0E0E0', // Lighter gray for better readability
        textAlign: 'justify',
        marginBottom: 32, // More breathing room after paragraphs
        lineHeight: 24, // Adding line height for better readability
    },
    button: {
        backgroundColor: '#9D4EDD', // Purple background for button
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        marginBottom: 16,
    },
    buttonText: {
        fontSize: 20, // Larger font for better readability
        color: '#FFFFFF', // White text for contrast
        textTransform: 'uppercase', // Uppercase for a more assertive look
        textAlign: 'center', // Center align text within the button
    },
});


export default AboutUsScreen;
