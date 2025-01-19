import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import globalStyle from '../constants/GlobalStyle'; // Import GlobalStyle

const CustomButton = ({ title, onPress, type = 'primary', buttonStyle, textStyle }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        type === 'primary' ? styles.primaryButton : styles.secondaryButton,
        buttonStyle 
      ]} 
      onPress={onPress}
    >
      <Text style={[
        globalStyle.textSemiBold, 
        styles.buttonText, 
        type === 'primary' ? styles.primaryText : styles.secondaryText,
        textStyle 
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  buttonText: {
    fontSize: 16,
  },
  primaryText: {
    color: 'white',
  },
  secondaryText: {
    color: colors.primary,
  },
});

export default CustomButton;
