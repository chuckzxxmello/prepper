import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import CustomButton from '../../components/CustomButton';
import { colors } from '../../constants/colors';
import globalStyle from '../../constants/GlobalStyle'; // Import GlobalStyles

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
        <Text style={[globalStyle.textBold, styles.title]}>Welcome to Prepper</Text>
        <Text style={[globalStyle.textRegular, styles.subtitle]}>Let him cook!</Text>
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Let him cook!"
          onPress={() => navigation.navigate('Login')}
          type="primary"
        />
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
    color: colors.primary, // Title color from colors.js
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight, // Subtitle color from colors.js
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
