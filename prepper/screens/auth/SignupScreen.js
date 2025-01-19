import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { colors } from '../../constants/colors';  // Import colors
import StyledInput from '../../components/StyledInput';
import { auth } from '../../config/firebase';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import CustomButton from '../../components/CustomButton';
import globalStyle from '../../constants/GlobalStyle'; // Import GlobalStyles

const db = getFirestore();

const SignupScreen = ({ navigation }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Send email verification
            await sendEmailVerification(user, {
                handleCodeInApp: true,
                url: 'https://prepper-a7da8.firebaseapp.com',
            });

            // Save user data in Firestore
            await setDoc(doc(db, 'userInfo', user.uid), {
                fullName: fullName,
                email: email,
                emailVerified: false,
                createdAt: new Date().toISOString(),
            });

            Alert.alert(
                'Verify Email',
                'Please check your email to verify your account before logging in',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Login'),
                    },
                ]
            );
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={[globalStyle.textBold, styles.title]}>Create Account</Text>
                <Text style={[globalStyle.textRegular, styles.subtitle]}>Sign up to get started</Text>
            </View>

            <View style={styles.formContainer}>
<StyledInput
    placeholder="Full Name"
    value={fullName}
    onChangeText={setFullName}
    placeholderTextColor={colors.textLight}
    style={{ color: colors.text }}  // Set text color to white
/>
<StyledInput
    placeholder="Email"
    value={email}
    onChangeText={setEmail}
    keyboardType="email-address"
    placeholderTextColor={colors.textLight}
    style={{ color: colors.text }}  // Set text color to white
/>
<StyledInput
    placeholder="Password"
    value={password}
    onChangeText={setPassword}
    isPassword={true}
    showPasswordToggle={true}
    placeholderTextColor={colors.textLight}
/>




                <View style={styles.buttonContainer}>
                    <CustomButton
                        title="Create Account"
                        onPress={handleSignup}
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
        backgroundColor: colors.background, // Use background color from colors.js
        padding: 20,
    },
    headerContainer: {
        marginTop: 60,
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.textLight,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
		color: colors.primary,
	},
    formContainer: {
        flex: 1,
    },
    buttonContainer: {
        gap: 10,
        marginTop: 20,
    },
});

export default SignupScreen;
