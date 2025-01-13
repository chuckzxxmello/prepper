import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { colors } from '../../constants/colors';
import StyledInput from '../../components/StyledInput';
import { auth } from '../../config/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import CustomButton from '../../components/CustomButton';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');

    const handleResetPassword = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert(
                "Reset Link Sent",
                "Check your email for password reset instructions",
                [{ 
                    text: "OK", 
                    onPress: () => navigation.navigate('Login')
                }]
            );
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Reset Password</Text>
                <Text style={styles.subtitle}>
                    Enter your email address to reset your password
                </Text>

                <StyledInput
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />

                <View style={styles.buttonContainer}>
                    <CustomButton
                        title="Reset Password"
                        onPress={handleResetPassword}
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
    },
    innerContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: colors.text,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textLight,
        textAlign: 'center',
        marginBottom: 30,
    },
    buttonContainer: {
        marginTop: 20,
    },
});

export default ForgotPasswordScreen;
