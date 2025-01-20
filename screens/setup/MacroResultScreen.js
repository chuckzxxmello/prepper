import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import CustomButton from '../../components/CustomButton';
import { auth } from '../../config/firebase';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { calculateBMR, calculateTDEE, adjustCaloriesForGoal, calculateMacros } from '../../utils/calculations';

const db = getFirestore();

const MacroResultScreen = ({ navigation, route }) => {
    const { weight, height, age, gender, activityLevel, goal } = route.params;
    const [results, setResults] = useState(null);

    useEffect(() => {
        calculateAndSetResults();
    }, []);

    const calculateAndSetResults = async () => {
        const bmr = calculateBMR(weight, height, age, gender);
        const tdee = calculateTDEE(bmr, activityLevel);
        const targetCalories = adjustCaloriesForGoal(tdee, goal);
        const { protein, fat, carbs } = calculateMacros(targetCalories, weight, goal);

        const proteinPercentage = Math.round((protein * 4 / targetCalories) * 100);
        const fatPercentage = Math.round((fat * 9 / targetCalories) * 100);
        const carbPercentage = Math.round((carbs * 4 / targetCalories) * 100);

        const results = {
            tdee: targetCalories,
            proteinTarget: protein,
            fatTarget: fat,
            carbTarget: carbs,
            proteinRatio: proteinPercentage,
            fatRatio: fatPercentage,
            carbRatio: carbPercentage
        };

        setResults(results);

        // Update user data in Firestore
        try {
            const userRef = doc(db, 'userInfo', auth.currentUser.uid);
            await updateDoc(userRef, {
                ...results,
                weight,
                height,
                age,
                gender,
                activityLevel,
                goal
            });
        } catch (error) {
            console.log('Error updating user data:', error);
        }
    };

    if (!results) return null;

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Your Daily Targets</Text>
                <Text style={styles.subtitle}>Recommended macronutrient breakdown</Text>
            </View>

            <View style={styles.resultContainer}>
                <View style={styles.macroCard}>
                    <Text style={styles.macroTitle}>Calories</Text>
                    <Text style={styles.macroValue}>{results.tdee} kcal</Text>
                </View>

                <View style={styles.macroCard}>
                    <Text style={styles.macroTitle}>Protein</Text>
                    <Text style={styles.macroValue}>{results.proteinTarget}g</Text>
                    <Text style={styles.macroPercentage}>{results.proteinRatio}%</Text>
                </View>

                <View style={styles.macroCard}>
                    <Text style={styles.macroTitle}>Fat</Text>
                    <Text style={styles.macroValue}>{results.fatTarget}g</Text>
                    <Text style={styles.macroPercentage}>{results.fatRatio}%</Text>
                </View>

                <View style={styles.macroCard}>
                    <Text style={styles.macroTitle}>Carbs</Text>
                    <Text style={styles.macroValue}>{results.carbTarget}g</Text>
                    <Text style={styles.macroPercentage}>{results.carbRatio}%</Text>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <CustomButton
                    title="Continue to Dashboard"
                    onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
                    type="primary"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
    },
    headerContainer: {
        marginTop: 60,
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: colors.text,
    },
    resultContainer: {
        flex: 1,
        gap: 20,
    },
    macroCard: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 20,
        elevation: 2,
    },
    macroTitle: {
        fontSize: 18,
        color: colors.text,
        marginBottom: 8,
    },
    macroValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
    },
    macroPercentage: {
        fontSize: 16,
        color: colors.textLight,
        marginTop: 4,
    },
    buttonContainer: {
        marginTop: 20,
    },
});

export default MacroResultScreen;
