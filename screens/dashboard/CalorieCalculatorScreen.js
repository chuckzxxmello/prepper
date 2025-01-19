import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import globalStyle from '../../constants/GlobalStyle'; // Import global styles

const CalorieCalculatorScreen = () => {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [age, setAge] = useState('');
    const [activityLevel, setActivityLevel] = useState('');
    const [calories, setCalories] = useState(null);
    const navigation = useNavigation();

    const activityLevels = [
        { label: 'Sedentary or Lightly Active', value: 1.45 },
        { label: 'Active or Moderately Active', value: 1.75 },
        { label: 'Highly Active', value: 2.05 },
        { label: 'Very Highly Active', value: 2.45 },
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

            {/* Header with spacing */}
            <Text style={[globalStyle.textBold, styles.header]}>Calorie Calculator</Text>

            {/* Set Physical State Section */}
            <Text style={[globalStyle.textBold, styles.subHeader]}>Set Physical State</Text>

            {/* Input fields */}
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
            <Text style={[globalStyle.textBold, styles.subHeader]}>Activity Level</Text>
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
                        {level.label} (PAL {level.value})
                    </Text>
                </TouchableOpacity>
            ))}

            {/* Calculate Button */}
            <TouchableOpacity style={styles.calculateButton} onPress={calculateCalories}>
                <Text style={[globalStyle.textBold, styles.calculateButtonText]}>Calculate</Text>
            </TouchableOpacity>

            {/* Result */}
            {calories && (
                <Text style={[globalStyle.textBold, styles.result]}>
                    Daily Calorie Intake: {calories.toFixed(2)} Cal
                </Text>
            )}
        </View>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#1E1E1E', // Dark background
        marginTop: 40,
    },
    backButton: {
        position: 'absolute',
        top: 25,
        left: 16,
        zIndex: 1,
    },
    header: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 30,
        color: '#FFFFFF', // White text for header
    },
    subHeader: {
        marginVertical: 8,
        fontSize: 24,
        textAlign: 'left',
        color: '#ffffff',
    },
    subtitle: {
        fontSize: 16,
        color: colors.primary,
    },
    input: {
        height: 40,
        borderColor: '#4a148c',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 8,
        backgroundColor: '#2d2d2d',
        color: '#fff',
        borderRadius: 8,
    },
    activityLevelButton: {
        backgroundColor: '#4a148c',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
    },
    selectedActivityLevelButton: {
        backgroundColor: '#9D4EDD', // Purple background for selected activity level
    },
    activityLevelText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    selectedActivityLevelText: {
        color: '#fff', // White text for selected activity level
    },
    calculateButton: {
        backgroundColor: '#6a1b9a', // Purple background for calculate button
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 16,
    },
    calculateButtonText: {
        color: '#fff', // White text for calculate button
        fontWeight: 'bold',
        fontSize: 16,
    },
    result: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 16,
        color: '#fff',
    },
});

export default CalorieCalculatorScreen;
