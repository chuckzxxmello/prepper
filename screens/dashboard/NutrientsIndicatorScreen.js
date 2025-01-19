import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../constants/colors';
import { auth } from '../../config/firebase';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { calculateBMR, calculateTDEE, adjustCaloriesForGoal, calculateMacros } from '../../utils/calculations';
import moment from 'moment';
import globalStyle from '../../constants/GlobalStyle'; // Import global fonts

const db = getFirestore();

const NutrientsIndicatorScreen = ({ navigation }) => {
    const [userData, setUserData] = useState(null);
    const [results, setResults] = useState(null);
    const [mealPlanTotals, setMealPlanTotals] = useState(null);
    const currentDay = moment().format('dddd'); // Get current day (e.g., 'Wednesday')

    useEffect(() => {
        const userRef = doc(db, 'userInfo', auth.currentUser.uid);
        
        const unsubscribe = onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setUserData(data);
                calculateResults(data);
                calculateMealPlanTotals(data.mealPlan || []);
            }
        }, (error) => {
            console.log('Error getting real-time updates:', error);
        });

        return () => unsubscribe();
    }, []);

    const calculateMealPlanTotals = (mealPlan) => {
        const todaysMeals = mealPlan.filter(meal => meal.mealDay === currentDay);
        
        const totals = todaysMeals.reduce((acc, meal) => {
            return {
                calories: acc.calories + (meal.macronutrients?.calories || 0),
                protein: acc.protein + (meal.macronutrients?.protein || 0),
                fat: acc.fat + (meal.macronutrients?.fat || 0),
                carbs: acc.carbs + (meal.macronutrients?.carbs || 0)
            };
        }, { calories: 0, protein: 0, fat: 0, carbs: 0 });

        setMealPlanTotals(totals);
    };

    const calculateResults = (data) => {
        const { weight, height, age, gender, activityLevel, goal } = data;
        
        const bmr = calculateBMR(weight, height, age, gender);
        const tdee = calculateTDEE(bmr, activityLevel);
        const targetCalories = adjustCaloriesForGoal(tdee, goal);
        const { protein, fat, carbs } = calculateMacros(targetCalories, weight, goal);

        const proteinPercentage = Math.round((protein * 4 / targetCalories) * 100);
        const fatPercentage = Math.round((fat * 9 / targetCalories) * 100);
        const carbPercentage = Math.round((carbs * 4 / targetCalories) * 100);

        setResults({
            tdee: targetCalories,
            proteinTarget: protein,
            fatTarget: fat,
            carbTarget: carbs,
            proteinRatio: proteinPercentage,
            fatRatio: fatPercentage,
            carbRatio: carbPercentage
        });
    };

    const calculateProgress = (current, target) => {
        return Math.round((current / target) * 100);
    };

    if (!results || !userData || !mealPlanTotals) {
        return (
            <View style={styles.container}>
                <Text style={[globalStyle.textRegular, styles.loading]}>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={[globalStyle.textSemiBold, styles.title]}>Your Daily Targets</Text>
                <Text style={[globalStyle.textRegular, styles.subtitle]}>
                    Target vs. Current Progress for {currentDay}
                </Text>
            </View>

            <View style={styles.resultContainer}>
                {/* Calories */}
                <View style={styles.macroCard}>
                    <Text style={[globalStyle.textSemiBold, styles.macroTitle]}>Calories</Text>
                    <Text style={[globalStyle.textLarge, styles.macroValue]}>{results.tdee} kcal</Text>
                    <Text style={[globalStyle.textRegular, styles.macroProgress]}>
                        Progress: {mealPlanTotals.calories} / {results.tdee} kcal
                    </Text>
                    <Text style={[
                        globalStyle.textBold,
                        styles.macroPercentage,
                        { color: calculateProgress(mealPlanTotals.calories, results.tdee) > 100 ? colors.error : colors.success }
                    ]}>
                        {calculateProgress(mealPlanTotals.calories, results.tdee)}% of daily target
                    </Text>
                </View>

                {/* Protein */}
                <View style={styles.macroCard}>
                    <Text style={[globalStyle.textSemiBold, styles.macroTitle]}>Protein</Text>
                    <Text style={[globalStyle.textLarge, styles.macroValue]}>{results.proteinTarget}g</Text>
                    <Text style={[globalStyle.textRegular, styles.macroProgress]}>
                        Progress: {mealPlanTotals.protein} / {results.proteinTarget}g
                    </Text>
                    <Text style={[
                        globalStyle.textBold,
                        styles.macroPercentage,
                        { color: calculateProgress(mealPlanTotals.protein, results.proteinTarget) > 100 ? colors.error : colors.success }
                    ]}>
                        {calculateProgress(mealPlanTotals.protein, results.proteinTarget)}% of daily target
                    </Text>
                    <Text style={[globalStyle.textSmall, styles.macroRatio]}>
                        ({results.proteinRatio}% of calories)
                    </Text>
                </View>

                {/* Fat */}
                <View style={styles.macroCard}>
                    <Text style={[globalStyle.textSemiBold, styles.macroTitle]}>Fat</Text>
                    <Text style={[globalStyle.textLarge, styles.macroValue]}>{results.fatTarget}g</Text>
                    <Text style={[globalStyle.textRegular, styles.macroProgress]}>
                        Progress: {mealPlanTotals.fat} / {results.fatTarget}g
                    </Text>
                    <Text style={[
                        globalStyle.textBold,
                        styles.macroPercentage,
                        { color: calculateProgress(mealPlanTotals.fat, results.fatTarget) > 100 ? colors.error : colors.success }
                    ]}>
                        {calculateProgress(mealPlanTotals.fat, results.fatTarget)}% of daily target
                    </Text>
                    <Text style={[globalStyle.textSmall, styles.macroRatio]}>
                        ({results.fatRatio}% of calories)
                    </Text>
                </View>

                {/* Carbs */}
                <View style={styles.macroCard}>
                    <Text style={[globalStyle.textSemiBold, styles.macroTitle]}>Carbs</Text>
                    <Text style={[globalStyle.textLarge, styles.macroValue]}>{results.carbTarget}g</Text>
                    <Text style={[globalStyle.textRegular, styles.macroProgress]}>
                        Progress: {mealPlanTotals.carbs} / {results.carbTarget}g
                    </Text>
                    <Text style={[
                        globalStyle.textBold,
                        styles.macroPercentage,
                        { color: calculateProgress(mealPlanTotals.carbs, results.carbTarget) > 100 ? colors.error : colors.success }
                    ]}>
                        {calculateProgress(mealPlanTotals.carbs, results.carbTarget)}% of daily target
                    </Text>
                    <Text style={[globalStyle.textSmall, styles.macroRatio]}>
                        ({results.carbRatio}% of calories)
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
    },
    headerContainer: {
        marginTop: 40,
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        color: '#FFF',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: colors.primary,
    },
    resultContainer: {
        flex: 1,
        gap: 20,
        marginBottom: 24,
    },
    macroCard: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 20,
        elevation: 2,
    },
    macroTitle: {
        color: colors.text,
        marginBottom: 8,
    },
    macroValue: {
        color: colors.primary,
    },
    macroProgress: {
        color: colors.text,
        marginTop: 8,
    },
    macroPercentage: {
        marginTop: 4,
    },
    macroRatio: {
        marginTop: 4,
        color: colors.textLight,
    },
    loading: {
        textAlign: 'center',
        marginTop: 50,
    },
});

export default NutrientsIndicatorScreen;
