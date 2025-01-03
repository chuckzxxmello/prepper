import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase'; // Adjust import paths as needed
import { colors } from '../../constants/colors';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
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
        backgroundColor: '#fff',
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginVertical: 8,
    },
    button: {
        backgroundColor: colors.primary,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    link: {
        marginTop: 16,
        color: colors.secondary,
        textAlign: 'center',
    },
});

export default LoginScreen;