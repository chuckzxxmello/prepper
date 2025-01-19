import React, { useState } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

const StyledInput = ({ placeholder, value, onChangeText, secureTextEntry, keyboardType = 'default' }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <TextInput
            style={[
                styles.input,
                isFocused && styles.inputFocused
            ]}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
        />
    );
};

const styles = StyleSheet.create({
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
        width: '100%'
    },
    inputFocused: {
        borderColor: colors.primary,
        borderWidth: 2,
    }
});

export default StyledInput;
