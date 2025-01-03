import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const BackButton = ({ onPress }) => {
    return (
        <TouchableOpacity style={styles.backButton} onPress={onPress}>
            <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        paddingVertical: 5,
        paddingHorizontal: 15,
    },
    buttonText: {
        fontSize: 18,
        color: '#6E7179', 
        fontWeight: 'bold',
    },
});

export default BackButton;
