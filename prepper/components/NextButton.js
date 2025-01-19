import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const NextButton = ({ onPress, disabled }) => {
    return (
        <TouchableOpacity
            style={[styles.nextButton, { opacity: disabled ? 0.5 : 1 }]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={[styles.buttonText, disabled && styles.disabledText]}>
                Next
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    nextButton: {
        position: 'absolute',
        bottom: 40, // Adjusted to position like your BackButton
        right: 40,  // Positioned on the right side
    },
    buttonText: {
        fontSize: 18,
        color: '#9D4EDD', // Default color
        fontWeight: 'bold',
    },
    disabledText: {
        color: '#B0B0B0',  // Light gray text for the disabled state
    },
});

export default NextButton;
