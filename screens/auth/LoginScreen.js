import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase'; // Adjust import paths as needed
import { colors } from '../../constants/colors';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Check if user is verified
            if (!user.emailVerified) {
                Alert.alert(
                    "Email Not Verified",
                    "Please verify your email before logging in",
                    [{ text: "OK" }]
                );
                return;
            }

            // Check if user data exists in Firestore
            const userRef = doc(db, 'userInfo', user.uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                // If user info doc doesn't exist
                navigation.navigate('Goal');
                return;
            }

            // If user info doc exists, check if 'goal' field is set
            const userData = userDoc.data();
            if (!userData.goal) {
                navigation.navigate('Goal');
            } else {
                // User already has a goal set, navigate to HomeScreen
                navigation.navigate('MainTabs', { screen: 'Home' });
            }
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                {/* You can add your logo here if needed */}
                <Image 
                    source={require('../../assets/prepper.png')}  // Import the .png image
                    style={styles.logo}  // Apply styling to the image
                    resizeMode="contain"
                />
            </View>

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#B0B0B0"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#B0B0B0"
                    secureTextEntry={!passwordVisible}  // Toggle visibility based on passwordVisible state
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                    <Text style={styles.eyeIconText}>{passwordVisible ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.link}>Don't have an account? Sign up</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212', // Dark background
        padding: 20,
        justifyContent: 'center',
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        marginTop: -200,
        width: 200,  // Adjust the width as needed
        height: 200, // Adjust the height as needed
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#444', // Darker border colorhow
        backgroundColor: '#1E1E1E', // Input background
        borderRadius: 8,
        paddingHorizontal: 10,
        marginVertical: 8,
        color: '#E0E0E0', // Input text color
    },
    passwordContainer: {
        position: 'relative',  // To position the eye icon inside the input field
    },
    eyeIcon: {
        position: 'absolute',
        right: 16,
        top: 16,
    },
    eyeIconText: {
        color: '#BB86FC',  // Accent color for "Show/Hide" text
        fontSize: 16,
    },
    button: {
        backgroundColor: '#BB86FC', // Accent button color
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 8,
    },
    buttonText: {
        color: '#121212', // Dark text on button for contrast
        fontWeight: 'bold',
    },
    link: {
        marginTop: 16,
        color: '#FFFFFF', // Secondary accent color
        textAlign: 'center',
    },
});

export default LoginScreen;
