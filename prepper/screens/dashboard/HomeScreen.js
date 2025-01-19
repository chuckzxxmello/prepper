import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Alert, TouchableOpacity } from 'react-native';
import { Text, Button, Card, IconButton, ProgressBar } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import ProfileHeader from '../../components/ProfileHeader';
import { db, auth } from '../../config/firebase';
import { doc, getDoc, setDoc, getFirestore, onSnapshot } from 'firebase/firestore';
import moment from 'moment';

import { calculateBMR, calculateTDEE, adjustCaloriesForGoal, calculateMacros } from '../../utils/calculations';
import lobalStyle from '../../constants/GlobalStyle'; // Import global styles

export default function HomeScreen({ navigation }) {
  const [waterIntake, setWaterIntake] = useState(0);
  const [lastTime, setLastTime] = useState('10:45 AM');
  const [userData, setUserData] = useState(null);
  const maxWaterIntake = 3.0;

  // Get current day
  const getCurrentDay = () => {
    return moment().format('dddd'); // Returns current day name (e.g., 'Monday')
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch user data with real-time listener for meal plan updates
  const fetchUserData = () => {
    if (auth.currentUser) {
      const userDocRef = doc(db, 'userInfo', auth.currentUser.uid);

      // Listen for real-time updates to user data
      onSnapshot(userDocRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          console.log('Fetched user data:', data);
          setUserData(data);
        } else {
          console.log('No such document!');
        }
      }, (error) => {
        console.error('Error fetching user data:', error);
      });
    }
  };

  const getProgress = (current, total) => {
    return parseFloat((current / total).toFixed(2));
  };

  const saveWaterIntake = async (intake) => {
    if (auth.currentUser) {
      try {
        const roundedWaterIntake = Math.round(intake * 10) / 10;
        await setDoc(doc(db, 'userInfo', auth.currentUser.uid),
          { waterIntake: roundedWaterIntake },
          { merge: true }
        );
        console.log('Water intake saved successfully');
      } catch (error) {
        console.error('Error saving water intake:', error);
      }
    }
  };

  const handleWaterIntakeChange = (change) => {
    let newWaterIntake = waterIntake + change;

    if (newWaterIntake > maxWaterIntake) {
      Alert.alert(
        "Maximum Water Intake Reached",
        "You've reached the maximum water intake of 3.0 L.",
        [{ text: "OK" }]
      );
      return;
    }

    newWaterIntake = Math.max(0, newWaterIntake);
    setWaterIntake(newWaterIntake);
    saveWaterIntake(newWaterIntake);

    const currentTime = moment().format('HH:mm A');
    setLastTime(currentTime);
  };

  // Format time to 24-hour format with AM/PM
  const formatTime = (time) => {
    return moment(time, 'HH:mm').format('HH:mm A');
  };

  const weeklyCaloriesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: (() => {
          const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
          return daysOfWeek.map(day => {
            const mealsForDay = userData?.mealPlan?.filter(meal => meal.mealDay === day) || [];
            return mealsForDay.reduce((total, meal) => total + (Number(meal.macronutrients?.calories) || 0), 0);
          });
        })(),
        color: (opacity = 1) => `rgba(128, 0, 128, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const renderWeeklyCaloriesChart = () => (
    <View style={styles.chartContainer}>
      <Text variant="titleSmall" style={styles.sectionTitle}>Weekly Calorie Intake</Text>
      <LineChart
        data={weeklyCaloriesData}
        width={Dimensions.get('window').width - 30}
        height={220}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: '#121212',
          backgroundGradientFrom: '#1E1E1E',
          backgroundGradientTo: '#121212',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          propsForDots: {
            r: '2',
            stroke: '#BB86FC',
            fill: '#BB86FC',
          },
        }}
        bezier={false}
        style={{ marginVertical: 8, borderRadius: 8 }}
      />
    </View>
  );


  const db = getFirestore();

  const renderNutrientsIndicator = () => {
    const [userData, setUserData] = useState(null);
    const [results, setResults] = useState(null);
    const [mealPlanTotals, setMealPlanTotals] = useState(null);
    const currentDay = moment().format('dddd'); // Get current day (e.g., 'Wednesday')

    useEffect(() => {
      // Set up real-time listener for user data
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

      // Cleanup listener on component unmount
      return () => unsubscribe();
    }, []);

    const calculateTotalCalories = (day) => {
      const mealsForDay = userData?.mealPlan?.filter(meal => meal.mealDay === day) || [];
      const totalCalories = mealsForDay.reduce((total, meal) => total + Math.round(meal.macronutrients?.calories || 0), 0);
      return totalCalories;
    };

    const calculateTotalProtein = (day) => {
      const mealsForDay = userData?.mealPlan?.filter(meal => meal.mealDay === day) || [];
      const totalProtein = mealsForDay.reduce((total, meal) => total + Math.round(meal.macronutrients?.protein || 0), 0);
      return totalProtein;
    };

    const calculateTotalFat = (day) => {
      const mealsForDay = userData?.mealPlan?.filter(meal => meal.mealDay === day) || [];
      const totalFat = mealsForDay.reduce((total, meal) => total + Math.round(meal.macronutrients?.fat || 0), 0);
      return totalFat;
    };

    const calculateTotalCarbs = (day) => {
      const mealsForDay = userData?.mealPlan?.filter(meal => meal.mealDay === day) || [];
      const totalCarbs = mealsForDay.reduce((total, meal) => total + Math.round(meal.macronutrients?.carbs || 0), 0);
      return totalCarbs;
    };

    const renderProgressBar = (label, current, total, color) => {
      const roundedCurrent = Math.round(current);
      const roundedTotal = Math.round(total);
      // Convert progress calculation to a fixed-point number
      const progress = (roundedCurrent / roundedTotal).toFixed(2);
      return (
        <>
          <View style={styles.nutrientRow}>
            <Text style={styles.nutrientText}>{label}</Text>
            <Text style={styles.nutrientText}>
              {roundedCurrent} / {roundedTotal} {label === "Calories" ? "kcal" : "g"}
            </Text>
          </View>
          <ProgressBar progress={Math.min(progress, 1)} color={color} />
        </>
      );
    };

    const calculateMealPlanTotals = (mealPlan) => {
      const todaysMeals = mealPlan.filter(meal => meal.mealDay === currentDay);
      const totals = todaysMeals.reduce((acc, meal) => {
        return {
          calories: acc.calories * Math.round(meal.macronutrients?.calories || 0),
          protein: acc.protein + Math.round(meal.macronutrients?.protein || 0),
          fat: acc.fat + Math.round(meal.macronutrients?.fat || 0),
          carbs: acc.carbs + Math.round(meal.macronutrients?.carbs || 0)
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
          <Text style={styles.loading}>Loading...</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('NutrientsIndicator')}
        style={styles.leftPanel}
      >
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleSmall" style={styles.sectionTitle}>Daily Nutrients Indicator</Text>
            {renderProgressBar("Calories", calculateTotalCalories(currentDay), results.tdee, "#64B5F6")}
            {renderProgressBar("Proteins", calculateTotalProtein(currentDay), results.proteinTarget, "#E57373")}
            {renderProgressBar("Fats", calculateTotalFat(currentDay), results.fatTarget, "#FFB74D")}
            {renderProgressBar("Carbs", calculateTotalCarbs(currentDay), results.carbTarget, "#81C784")}
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderWaterIntake = () => (
    <TouchableOpacity
      onPress={() => navigation.navigate('WaterIntakeScreen')}
      style={styles.rightPanel}
    >
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleSmall" style={styles.sectionTitle}>Daily Water Intake</Text>
          <View style={styles.waterRow}>
            <Text style={styles.waterText}>{waterIntake.toFixed(1)} / {maxWaterIntake}L</Text>
            <View style={styles.waterControls}>
              <Button
                mode="contained"
                compact
                style={styles.waterButton}
                onPress={() => handleWaterIntakeChange(-1)}
              >
                -
              </Button>
              <Button
                mode="contained"
                compact
                style={styles.waterButton}
                onPress={() => handleWaterIntakeChange(1)}
              >
                +
              </Button>
            </View>
          </View>
          <ProgressBar progress={getProgress(waterIntake, maxWaterIntake)} color="#42A5F5" />
          <Text style={styles.lastTimeText}>Last time {lastTime}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderMealsSection = () => {
    const today = getCurrentDay();
    const todaysMeals = userData?.mealPlan?.filter(meal => meal.mealDay === today) || [];

    // Sort meals by time
    const sortedMeals = [...todaysMeals].sort((a, b) => {
      return moment(a.mealTime, 'HH:mm').diff(moment(b.mealTime, 'HH:mm'));
    });

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('MealPlanScreen')}
        style={styles.fullWidthPanel}
      >
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.mealHeader}>
              <Text variant="titleSmall" style={styles.sectionTitle}>Today's Meals</Text>
              <IconButton
                icon="plus"
                size={20}
                onPress={() => navigation.navigate('RecipeScreen')}
              />
            </View>

            {sortedMeals.length > 0 ? (
              sortedMeals.map((meal, index) => (
                <View key={index} style={styles.mealItem}>
                  <Text style={styles.mealTitle}>{meal.title}</Text>
                  <View style={styles.mealDetails}>
                    <Text style={styles.mealType}>{meal.mealType}</Text>
                    <Text style={styles.mealTime}>{formatTime(meal.mealTime)}</Text>
                  </View>
                  <Text style={styles.caloriesText}>
                    {meal.macronutrients.calories} calories
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noMealsText}>No meals planned for today</Text>
            )}
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };


  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <ProfileHeader name="User" />

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.bodyStatsHeader}>Stats</Text>
        {renderWeeklyCaloriesChart()}
        <View style={styles.rowContainer}>
          {renderNutrientsIndicator()}
          {renderWaterIntake()}
        </View>
        {renderMealsSection()}
      </ScrollView>
    </View>
  );
}

import globalStyle from '../../constants/GlobalStyle'; // Import your global styles

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    flex: 1,
  },
  bodyStatsHeader: {
    ...globalStyle.textBold, // Apply global bold font
    fontSize: 24,
    padding: 16,
    color: '#ffffff',
  },
  chartContainer: {
    padding: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  leftPanel: {
    flex: 1,
    marginRight: 8,
  },
  rightPanel: {
    flex: 1,
    marginLeft: 8,
  },
  fullWidthPanel: {
    width: '100%',
    marginBottom: 16,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    marginTop: 4,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#333333',
  },
  sectionTitle: {
    ...globalStyle.textSemiBold, // Apply global semi-bold font
    marginBottom: 8,
    color: '#BB86FC',
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  nutrientText: {
    ...globalStyle.textRegular, // Apply global regular font
    color: '#ffffff',
  },
  waterText: {
    ...globalStyle.textRegular, // Apply global regular font
    color: '#ffffff',
  },
  waterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  waterControls: {
    flexDirection: 'row',
  },
  waterButton: {
    marginHorizontal: 4,
  },
  lastTimeText: {
    ...globalStyle.textSmall, // Apply global small text style
    marginTop: 8,
    color: '#757575',
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealItem: {
    marginVertical: 8,
    padding: 12,
    backgroundColor: '#242424',
    borderRadius: 8,
  },
  mealTitle: {
    ...globalStyle.textBold, // Apply global bold font
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 4,
  },
  mealDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  mealType: {
    ...globalStyle.textRegular, // Apply global regular font
    color: '#BB86FC',
    fontSize: 14,
  },
  mealTime: {
    ...globalStyle.textRegular, // Apply global regular font
    color: '#BB86FC',
    fontSize: 14,
  },
  caloriesText: {
    ...globalStyle.textRegular, // Apply global regular font
    color: '#999999',
    fontSize: 14,
    marginTop: 4,
  },
  noMealsText: {
    ...globalStyle.textRegular, // Apply global regular font
    color: '#757575',
    textAlign: 'center',
    marginVertical: 16,
  },
});
