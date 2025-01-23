import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import globalStyle from '../../constants/GlobalStyle'; // Import global styles

const CalorieCalculatorScreen = () => {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [age, setAge] = useState('');
    const [activityLevel, setActivityLevel] = useState('');
    const [calories, setCalories] = useState(null);
    const navigation = useNavigation();

    const activityLevels = [
        { label: 'Sedentary', value: 1.45 },
        { label: 'Active', value: 1.75 },
        { label: 'Highly Active', value: 2.05 },
        { label: 'Very Active', value: 2.45 },
    ];

    const calculateCalories = () => {
        // Sample calorie calculation formula
        const calculatedCalories = (Number(weight) * 10 + Number(height) * 6.25 - Number(age) * 5) * Number(activityLevel);
        setCalories(calculatedCalories);
    };

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Header */}
            <Text style={[globalStyle.textSemiBold, styles.header]}>Calorie Calculator</Text>

            {/* Result Section */}
            {calories !== null && (
                <View style={styles.resultContainer}>
                    <Text style={[globalStyle.textBold, styles.resultText]}>
                        Daily Calorie Intake: {calories.toFixed(2)} Cal
                    </Text>
                </View>
            )}

            {/* Set Physical State Section */}
            <Text style={[globalStyle.textSemiBold, styles.subHeader]}>Set Physical State</Text>

            {/* Input Fields */}
            <TextInput
                style={styles.input}
                placeholder="Weight (kg)"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholderTextColor="#B0B0B0"
            />
            <TextInput
                style={styles.input}
                placeholder="Height (cm)"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                placeholderTextColor="#B0B0B0"
            />
            <TextInput
                style={styles.input}
                placeholder="Age"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                placeholderTextColor="#B0B0B0"
            />

            {/* Activity Level Section */}
            <Text style={[globalStyle.textSemiBold, styles.subHeader]}>Activity Level</Text>
            {activityLevels.map((level) => (
                <TouchableOpacity
                    key={level.value}
                    style={[
                        styles.activityLevelButton,
                        activityLevel === level.value && styles.selectedActivityLevelButton,
                    ]}
                    onPress={() => setActivityLevel(level.value)}
                >
                    <Text
                        style={[
                            globalStyle.textRegular,
                            styles.activityLevelText,
                            activityLevel === level.value && styles.selectedActivityLevelText,
                        ]}
                    >
                        {level.label}
                    </Text>
                </TouchableOpacity>
            ))}

            {/* Calculate Button */}
            <TouchableOpacity style={styles.calculateButton} onPress={calculateCalories}>
                <Text style={[globalStyle.textSemiBold, styles.calculateButtonText]}>Calculate</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#1E1E1E', // Dark background
    },
    backButton: {
        marginTop: 40,
        position: 'absolute',
        top: 25,
        left: 16,
        zIndex: 1,
    },
    header: {
        marginTop: 40,
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 20,
        color: '#FFFFFF',
    },
    resultContainer: {
        backgroundColor: '#2D2D2D',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    resultText: {
        fontSize: 20,
        color: '#fff',
        textAlign: 'center',
    },
    subHeader: {
        marginVertical: 10,
        fontSize: 18,
        color: '#ffffff',
    },
    input: {
        height: 50,
        borderColor: '#4a148c',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 12,
        backgroundColor: '#2d2d2d',
        color: '#fff',
        borderRadius: 8,
    },
    activityLevelButton: {
        backgroundColor: '#4a148c',
        padding: 14,
        borderRadius: 8,
        marginBottom: 12,
    },
    selectedActivityLevelButton: {
        backgroundColor: '#9D4EDD', // Highlight selected button
    },
    activityLevelText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    selectedActivityLevelText: {
        color: '#fff', // Keep text white for selected button
    },
    calculateButton: {
        backgroundColor: '#6a1b9a',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 20,
    },
    calculateButtonText: {
        fontSize: 16,
        color: '#fff',
    },
});

export default CalorieCalculatorScreen;
