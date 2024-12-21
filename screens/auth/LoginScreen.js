import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { colors } from '../../constants/colors';
import StyledInput from '../../components/StyledInput';
import { auth } from '../../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import CustomButton from '../../components/CustomButton';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const db = getFirestore();

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

            if (userDoc.exists()) {
                // User data exists, navigate to HomeScreen
                navigation.navigate('MainTabs', { screen: 'Home' });
            } else {
                // User data does not exist, navigate to setup screens
                navigation.navigate('Goal');
            }
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Welcome Back!</Text>
                <Text style={styles.subtitle}>Sign in to continue</Text>
            </View>

            <View style={styles.formContainer}>
                <StyledInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <StyledInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <View style={styles.buttonContainer}>
                    <CustomButton
                        title="Sign In"
                        onPress={handleLogin}
                        type="primary"
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
    },
    headerContainer: {
        marginTop: 60,
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: colors.text,
    },
    formContainer: {
        flex: 1,
    },
    buttonContainer: {
        gap: 10,
        marginTop: 20,
    },
});

export default LoginScreen;
