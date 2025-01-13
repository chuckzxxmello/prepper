import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ProgressBarAndroid } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../config/firebase'; // Adjust the path if needed
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

const NutrientsIndicatorScreen = () => {
    const [nutrientsData, setNutrientsData] = useState({
        calories: 0,
        proteins: 0,
        fats: 0,
        carbs: 0,
    });

    const [weeklyGoal, setWeeklyGoal] = useState({
        calories: 2000,
        proteins: 150,
        fats: 70,
        carbs: 250,
    });

    const [mealData, setMealData] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchMealData = async () => {
            if (auth.currentUser) {
                try {
                    const userDocRef = doc(db, 'userInfo', auth.currentUser.uid);
                    const snapshot = await getDoc(userDocRef);
                    if (snapshot.exists()) {
                        const data = snapshot.data();
                        const mealPlan = data?.mealPlan || [];

                        // Process meal data and calculate totals for each day and mealType
                        const aggregatedData = {};

                        mealPlan.forEach((meal) => {
                            const { mealDay, mealType, macronutrients } = meal;
                            if (!aggregatedData[mealDay]) {
                                aggregatedData[mealDay] = {
                                    breakfast: { calories: 0, carbs: 0, fats: 0, proteins: 0 },
                                    lunch: { calories: 0, carbs: 0, fats: 0, proteins: 0 },
                                    dinner: { calories: 0, carbs: 0, fats: 0, proteins: 0 },
                                    snacks: { calories: 0, carbs: 0, fats: 0, proteins: 0 },
                                };
                            }

                            const mealTypeData = aggregatedData[mealDay][mealType];
                            if (macronutrients) {
                                mealTypeData.calories += macronutrients.calories || 0;
                                mealTypeData.carbs += macronutrients.carbs || 0;
                                mealTypeData.fats += macronutrients.fats || 0;
                                mealTypeData.proteins += macronutrients.proteins || 0;
                            }
                        });

                        // Calculate totals and apply max limit of 10000
                        let totalCalories = 0;
                        let totalCarbs = 0;
                        let totalFats = 0;
                        let totalProteins = 0;

                        Object.keys(aggregatedData).forEach((day) => {
                            Object.keys(aggregatedData[day]).forEach((mealType) => {
                                totalCalories += aggregatedData[day][mealType].calories;
                                totalCarbs += aggregatedData[day][mealType].carbs;
                                totalFats += aggregatedData[day][mealType].fats;
                                totalProteins += aggregatedData[day][mealType].proteins;
                            });
                        });

                        // Apply maximum limit of 10000 for each nutrient
                        totalCalories = Math.min(totalCalories, 10000);
                        totalCarbs = Math.min(totalCarbs, 10000);
                        totalFats = Math.min(totalFats, 10000);
                        totalProteins = Math.min(totalProteins, 10000);

                        setNutrientsData({
                            calories: totalCalories,
                            carbs: totalCarbs,
                            fats: totalFats,
                            proteins: totalProteins,
                        });

                        setMealData(aggregatedData); // Optional: Save the aggregated meal data for display
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };
        fetchMealData();
    }, []);

    const handleSave = async () => {
        if (auth.currentUser) {
            try {
                const updatedData = {
                    calories: parseFloat(nutrientsData.calories),
                    proteins: parseFloat(nutrientsData.proteins),
                    fats: parseFloat(nutrientsData.fats),
                    carbs: parseFloat(nutrientsData.carbs),
                };

                await setDoc(doc(db, 'userNutrients', auth.currentUser.uid), updatedData);
                setIsEditing(false);
            } catch (error) {
                console.error('Error saving nutrients data:', error);
            }
        }
    };

    const handleInputChange = (field, value) => {
        setNutrientsData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const renderProgressBar = (value, goal) => {
        const progress = Math.min(value / goal, 1); // Cap at 100% progress
        return (
            <View style={styles.progressBarContainer}>
                <ProgressBarAndroid
                    styleAttr="Horizontal"
                    indeterminate={false}
                    progress={progress}
                    color="#9D4EDD"
                    style={styles.progressBar}
                />
                <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
            </View>
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Nutrients Indicator</Text>

            {/* My Weekly Goal Title */}
            <Text style={styles.weeklyGoalTitle}>My Weekly Goal</Text>

            {isEditing ? (
                <View style={styles.editContainer}>
                    {['calories', 'proteins', 'fats', 'carbs'].map((field) => (
                        <View key={field} style={styles.inputContainer}>
                            <Text style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                            <TextInput
                                style={styles.input}
                                value={nutrientsData[field].toString()}
                                onChangeText={(value) => handleInputChange(field, value)}
                                keyboardType="numeric"
                                placeholder={`Enter your ${field}`}
                            />
                            <Text style={styles.recommended}>Recommended: {field === 'calories' ? '2000 kcal' : 'Default'}</Text>
                        </View>
                    ))}
                    <TouchableOpacity style={styles.button} onPress={handleSave}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.statsContainer}>
                    {['calories', 'proteins', 'fats', 'carbs'].map((field) => (
                        <View key={field} style={styles.row}>
                            <Text style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                            <Text style={styles.value}>
                                {nutrientsData[field]} {field === 'calories' ? 'kcal' : 'g'}
                            </Text>
                        </View>
                    ))}
                    <TouchableOpacity style={styles.button} onPress={() => setIsEditing(true)}>
                        <Text style={styles.buttonText}>Edit Weekly Goal</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Progress Bars for Each Macronutrient */}
            <View style={styles.progressContainer}>
                {['calories', 'proteins', 'fats', 'carbs'].map((field) => (
                    <View key={field} style={styles.progressRow}>
                        <Text style={styles.progressLabel}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                        {renderProgressBar(nutrientsData[field], weeklyGoal[field])}
                    </View>
                ))}
            </View>

            {/* Optional: Display meal data for each day and mealType */}
            <View style={styles.mealSummaryContainer}>
                {Object.keys(mealData).map((day) => (
                    <View key={day} style={styles.dayContainer}>
                        <Text style={styles.dayHeader}>{day}</Text>
                        {Object.keys(mealData[day]).map((mealType) => (
                            <View key={mealType} style={styles.mealRow}>
                                <Text style={styles.mealLabel}>{mealType}</Text>
                                <Text style={styles.mealValue}>
                                    Calories: {mealData[day][mealType].calories} kcal, Carbs: {mealData[day][mealType].carbs} g, Fats: {mealData[day][mealType].fats} g, Proteins: {mealData[day][mealType].proteins} g
                                </Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 48,
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#1E1E1E',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#9D4EDD',
        marginBottom: 24,
        textAlign: 'center',
    },
    weeklyGoalTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 16,
		marginTop: 16,
        textAlign: 'left',
    },
    statsContainer: {
        backgroundColor: '#2E2E2E',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    label: {
        fontSize: 18,
        color: '#fff',
    },
    value: {
        fontSize: 18,
        fontWeight: '600',
        color: '#9D4EDD',
    },
    editContainer: {
        alignItems: 'center',
        backgroundColor: '#2E2E2E',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    inputContainer: {
        marginBottom: 16,
        width: '80%',
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#9D4EDD',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 18,
        color: '#fff',
    },
    recommended: {
        fontSize: 14,
        color: '#B0B0B0',
        marginTop: 8,
    },
    button: {
        backgroundColor: '#9D4EDD',
        paddingVertical: 10,
        paddingHorizontal: 36,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    progressContainer: {
        marginTop: 24,
    },
    progressRow: {
        marginBottom: 16,
    },
    progressLabel: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 8,
    },
    progressBarContainer: {
        width: '100%',
        alignItems: 'center',
    },
    progressBar: {
        width: '90%',
        height: 12,
        borderRadius: 6,
        marginBottom: 4,
    },
    progressText: {
        fontSize: 14,
        color: '#9D4EDD',
    },
    mealSummaryContainer: {
        marginTop: 24,
    },
    dayContainer: {
        marginBottom: 16,
    },
    dayHeader: {
        fontSize: 20,
        fontWeight: '600',
        color: '#9D4EDD',
        marginBottom: 8,
    },
    mealRow: {
        marginBottom: 12,
    },
    mealLabel: {
        fontSize: 18,
        color: '#fff',
    },
    mealValue: {
        fontSize: 16,
        color: '#B0B0B0',
    },
});

export default NutrientsIndicatorScreen;
