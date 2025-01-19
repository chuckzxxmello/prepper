import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import CustomButton from '../../components/CustomButton';
import { colors } from '../../constants/colors';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    // Password reset logic here
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you instructions to reset your password
        </Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Send Reset Link"
          onPress={handleResetPassword}
          type="primary"
        />
        <CustomButton
          title="Back to Login"
          onPress={() => navigation.goBack()}
          type="secondary"
        />
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
    lineHeight: 24,
  },
  formContainer: {
    flex: 1,
  },
  input: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonContainer: {
    gap: 10,
    marginBottom: 20,
  },
});

export default ForgotPasswordScreen;
