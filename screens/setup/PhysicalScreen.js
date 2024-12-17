import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import NextButton from '../../components/NextButton';
import BackButton from '../../components/BackButton';

const PhysicalDetailsScreen = ({ navigation, route }) => {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [age, setAge] = useState('');

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <BackButton onPress={() => navigation.goBack()} />

            {/* Title */}
            <Text style={styles.title}>Enter Your Details</Text>
            <Text style={styles.subtitle}>Fill in your height, weight, and age</Text>

            {/* Height Input */}
            <TextInput
                style={styles.input}
                placeholder="Height (in cm)"
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
            />

            {/* Weight Input */}
            <TextInput
                style={styles.input}
                placeholder="Weight (in kg)"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
            />

            {/* Age Input */}
            <TextInput
                style={styles.input}
                placeholder="Age (in years)"
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
            />

            {/* Next Button */}
            <NextButton
                onPress={() => {
                    if (height && weight && age) {
                        navigation.navigate('MainTabs', {
                            ...route.params,
                            height: parseInt(height, 10),
                            weight: parseInt(weight, 10),
                            age: parseInt(age, 10),
                        });
                    }
                }}
                disabled={!height || !weight || !age} // Ensure all fields are filled
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#FFF',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: 'gray',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        fontSize: 18,
        textAlign: 'center',
    },
});

export default PhysicalDetailsScreen;
