import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import ProfileHeader from '../../components/ProfileHeader';
import { LineChart } from 'react-native-chart-kit'; // Import the LineChart component

const NutrientsIndicator = () => (
  <View style={styles.nutrientsIndicator}>
    <Text style={styles.nutrientText}>Calories: 2456 / 3400</Text>
    <Text style={styles.nutrientText}>Proteins: 150 / 225</Text>
    <Text style={styles.nutrientText}>Fats: 30 / 118</Text>
    <Text style={styles.nutrientText}>Carbs: 319 / 340</Text>
  </View>
);

const Meals = () => (
  <View style={styles.meals}>
    <Text style={styles.mealText}>Breakfast: 531 Cal at 10:45 AM</Text>
    <Text style={styles.mealText}>Lunch: 1024 Cal at 03:45 PM</Text>
  </View>
);

const GroceryList = () => (
  <View style={styles.groceryListContainer}>
    <Text style={styles.groceryListTitle}>My Grocery List</Text>
    <Text style={styles.groceryItem}>1. Apples</Text>
    <Text style={styles.groceryItem}>2. Bananas</Text>
    <Text style={styles.groceryItem}>3. Chicken Breasts</Text>
    <Text style={styles.groceryItem}>4. Brown Rice</Text>
    <Text style={styles.groceryItem}>5. Spinach</Text>
    <Text style={styles.groceryItem}>6. Avocados</Text>
    <Text style={styles.groceryItem}>7. Almonds</Text>
  </View>
);

// Weekly calorie data for the line chart
const weeklyCaloriesData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      data: [2300, 2450, 2200, 2650, 2550, 2800, 3000], // Sample calorie intake data for each day
      color: (opacity = 1) => `rgba(128, 0, 128, ${opacity})`, // Purple color
      strokeWidth: 2,
    },
  ],
};

const HomeScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ProfileHeader name="User" />
      
      {/* Statistics Section */}
      <Text style={styles.bodyStatsHeader}>Statistics</Text>
      
      {/* Weekly Calorie Line Chart (Centered) */}
      <View style={styles.chartContainer}>
        <LineChart
          data={weeklyCaloriesData}
          width={350} // Width of the chart
          height={220} // Height of the chart
          yAxisLabel="Cal" // Label for the Y-axis
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0, // Decimal places in the Y-axis
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Label color
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#8A2BE2', // Purple color for dots
            },
          }}
          bezier // Smooth line chart
        />
      </View>
      
      {/* Total Calories Consumed */}
      <Text style={styles.totalCaloriesText}>Total Calories Consumed: 10453 Kcal</Text>

      {/* Summary Section */}
      <Text style={styles.summaryTitle}>Summary</Text>
      <NutrientsIndicator />
      
      {/* Meal Plans Section */}
      <Text style={styles.mealPlansHeader}>My Meal Plans</Text>
      <Meals />
      
      {/* Grocery List Section */}
      <GroceryList />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 15,
    backgroundColor: '#ffffff',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    borderWidth: 3,
    borderColor: '#d1d1d1',
  },
  profileName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
  },
  date: {
    fontSize: 18,
    color: '#777',
  },
  bodyStatsHeader: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'purple',
    marginVertical: 10,
    textAlign: 'center',
  },
  totalCaloriesText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginVertical: 15,
    textAlign: 'center',
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'purple',
    marginVertical: 10,
    textAlign: 'center',
  },
  nutrientsIndicator: {
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  nutrientText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
    marginVertical: 4,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  mealPlansHeader: {
    fontSize: 24,
    fontWeight: '700',
    color: 'purple',
    marginVertical: 5,
    textAlign: 'center',
  },
  meals: {
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  mealText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
    marginVertical: 5,
  },
  groceryListContainer: {
    marginVertical: 20,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  groceryListTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'purple',
    marginVertical: 10,
    textAlign: 'center',
  },
  groceryItem: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
    marginVertical: 5,
  },
});

export default HomeScreen;
