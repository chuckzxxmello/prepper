import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Alert, TouchableOpacity } from 'react-native';
import { Text, Button, Card, IconButton, ProgressBar } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import ProfileHeader from '../../components/ProfileHeader';
import { db, auth } from '../../config/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import moment from 'moment';

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
        data: [2300, 2450, 2200, 2650, 2550, 2800, 3000],
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

  const renderNutrientsIndicator = () => (
    <TouchableOpacity
      onPress={() => navigation.navigate('NutrientsIndicatorScreen')}
      style={styles.leftPanel}
    >
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleSmall" style={styles.sectionTitle}>Nutrients Indicator</Text>
          <View style={styles.nutrientRow}>
            <Text style={styles.nutrientText}>Proteins</Text>
            <Text style={styles.nutrientText}>150 / 225</Text>
          </View>
          <ProgressBar progress={getProgress(150, 225)} color="#E57373" />
          
          <View style={styles.nutrientRow}>
            <Text style={styles.nutrientText}>Fats</Text>
            <Text style={styles.nutrientText}>30 / 118</Text>
          </View>
          <ProgressBar progress={getProgress(30, 118)} color="#FFB74D" />
          
          <View style={styles.nutrientRow}>
            <Text style={styles.nutrientText}>Carbs</Text>
            <Text style={styles.nutrientText}>319 / 340</Text>
          </View>
          <ProgressBar progress={getProgress(319, 340)} color="#81C784" />
          
          <View style={styles.nutrientRow}>
            <Text style={styles.nutrientText}>Calories</Text>
            <Text style={styles.nutrientText}>2456 / 3400</Text>
          </View>
          <ProgressBar progress={getProgress(2456, 3400)} color="#64B5F6" />
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderWaterIntake = () => (
    <TouchableOpacity 
      onPress={() => navigation.navigate('WaterIntakeScreen')} 
      style={styles.rightPanel}
    >
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleSmall" style={styles.sectionTitle}>Water Intake</Text>
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
              onPress={() => navigation.navigate('RecipeDetailScreen')}
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
    <ScrollView 
      contentContainerStyle={styles.container} 
      keyboardShouldPersistTaps="handled"
    >
      <ProfileHeader name="User" />
      <Text style={styles.bodyStatsHeader}>Stats</Text>
      
      {renderWeeklyCaloriesChart()}
      
      <View style={styles.rowContainer}>
        {renderNutrientsIndicator()}
        {renderWaterIntake()}
      </View>
      
      {renderMealsSection()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#121212',
  },
  bodyStatsHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 16,
    color: '#ffffff',
  },
  chartContainer: {
    marginBottom: 24,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
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
  },
  card: {
    marginBottom: 16,
    marginTop: 4,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#333333',
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#BB86FC',
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  nutrientText: {
    color: '#ffffff',
  },
  waterText: {
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
    marginTop: 8,
    fontSize: 12,
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
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mealDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  mealType: {
    color: '#BB86FC',
    fontSize: 14,
  },
  mealTime: {
    color: '#BB86FC',
    fontSize: 14,
  },
  caloriesText: {
    color: '#999999',
    fontSize: 14,
    marginTop: 4,
  },
  noMealsText: {
    color: '#757575',
    textAlign: 'center',
    marginVertical: 16,
  }
});
