import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import CustomButton from '../../components/CustomButton';
import { colors } from '../../constants/colors';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/logo.svg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Welcome to Prepper</Text>
        <Text style={styles.subtitle}>Let him cook!</Text>
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Sign In"
          onPress={() => navigation.navigate('Login')}
          type="primary"
        />
        <CustomButton
          title="Create Account"
          onPress={() => navigation.navigate('Signup')}
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
  logoContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20,
    gap: 10,
  },
});

export default WelcomeScreen;
