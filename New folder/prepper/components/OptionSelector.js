import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const OptionSelector = ({ options, selectedOption, onSelect }) => {
    return (
        <View style={styles.optionsContainer}>
            {options.map((option) => (
                <TouchableOpacity
                    key={option}
                    style={[
                        styles.option,
                        selectedOption === option && styles.selected, 
                    ]}
                    onPress={() => onSelect(option)}
                >
                    <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    optionsContainer: {
        flex: 0.8,
        justifyContent: 'center',
    },
    option: {
        padding: 15,
        backgroundColor: '#f5f5f5',
        marginVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    selected: {
        borderColor: '#6A0DAD', 
        backgroundColor: '#EDE7F6', 
    },
    optionText: {
        fontSize: 18,
        textAlign: 'center',
    },
});

export default OptionSelector;
