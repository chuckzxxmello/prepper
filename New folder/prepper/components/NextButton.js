import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

const NextButton = ({ onPress, disabled }) => {
    return (
        <TouchableOpacity
            style={[styles.nextButton, { opacity: disabled ? 0.5 : 1 }]}
            onPress={onPress}
            disabled={disabled}
        >
            <Image
                source={require('../assets/nextbutton.png')}
                style={styles.buttonImage}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    nextButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
    },
    buttonImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
});

export default NextButton;
