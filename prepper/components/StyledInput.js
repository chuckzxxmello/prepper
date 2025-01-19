import React, { useState } from 'react';
import { TextInput, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { colors } from '../constants/colors'; // Import colors

const StyledInput = ({
    placeholder,
    value,
    onChangeText,
    secureTextEntry,
    keyboardType = 'default',
    placeholderTextColor = colors.textLight, // Default placeholder text color
    isPassword = false,  // To check if it's a password field
    showPasswordToggle = false, // If the "show" toggle should be displayed
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Password visibility state

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={[styles.input, isPasswordVisible && styles.inputFocused]}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={isPassword && !isPasswordVisible} // Toggle password visibility
                keyboardType={keyboardType}
                placeholderTextColor={placeholderTextColor}
            />
            
            {isPassword && showPasswordToggle && (
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.showHideContainer}>
                    <Text style={styles.showText}>
                        {isPasswordVisible ? 'Hide' : 'Show'}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        position: 'relative', // For positioning the "Show/Hide" text
    },
    input: {
        height: 48,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.textLight,
        overflow: 'hidden',
        backgroundColor: colors.white,
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 16,
        width: '100%',
        color: colors.text, // Set text color to white
    },
    inputFocused: {
        borderColor: colors.primary,
        borderWidth: 2,
    },
    showHideContainer: {
        position: 'absolute',
        right: 18,
        top: 22,
    },
    showText: {
        color: colors.primary, // Purple color for "Show/Hide" text
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default StyledInput;
