import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import CustomButton from '../../components/CustomButton';
import { colors } from '../../constants/colors';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {/* Image above the title */}
        <Image 
          source={require('../../assets/papaMark.png')}  // Import the .png image
          style={styles.logo}  // Apply styling to the image
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.contentContainer}>
	  
	  
        <Text style={styles.title}>Welcome to Prepper</Text>
        <Text style={styles.subtitle}>Let him cook!</Text>
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Log In"
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
    backgroundColor: '#121212', // Dark background color
    padding: 20,
  },
  logoContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
	marginTop: 300,
    width: 250,  // Adjust the width as needed
    height: 250, // Adjust the height as needed
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#BB86FC', // Accent color for title
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E0E0', // Lighter text color for better contrast
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
