import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../constants/colors'; // Import colors from your theme
import globalStyle from '../constants/GlobalStyle'; // Import global font styles

const OptionSelector = ({ options, selectedOption, onSelect }) => {
    return (
        <View style={styles.optionsContainer}>
            {options.map((option) => (
                <TouchableOpacity
                    key={option}
                    style={[
                        styles.option,
                        selectedOption === option && styles.selectedOption,
                    ]}
                    onPress={() => onSelect(option)}
                >
                    <Text
                        style={[
                            globalStyle.textRegular, // Apply regular font style
                            selectedOption === option && globalStyle.textBold, // Bold for selected option
                            selectedOption === option && styles.selectedText,
                        ]}
                    >
                        {option}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    optionsContainer: {
        flex: 1,
        marginTop: 40,
    },
    option: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: colors.white, // Default light background for options
        marginVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.secondary, // Light gray border for unselected options
        alignItems: 'center',
    },
    selectedOption: {
        backgroundColor: colors.primary, // Purple background for selected option
        borderColor: colors.primary, // Purple border for selected option
    },
    selectedText: {
        color: '#fff', // White text for selected option
    },
});

export default OptionSelector;
