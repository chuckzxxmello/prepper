import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ScrollView } from 'react-native';

export default function App() {
  const [mealPlan, setMealPlan] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [calories, setCalories] = useState(0);
  
  const [meal, setMeal] = useState({ name: '', ingredients: '' });
  const [newRecipe, setNewRecipe] = useState({ name: '', ingredients: '', instructions: '' });
  const [mealCalories, setMealCalories] = useState('');

  const addMealToPlan = () => {
    setMealPlan([...mealPlan, { ...meal, ingredients: meal.ingredients.split(', ') }]);
    setMeal({ name: '', ingredients: '' });
    generateShoppingList();
  };

  const addRecipe = () => {
    setRecipes([...recipes, { ...newRecipe, ingredients: newRecipe.ingredients.split(', ') }]);
    setNewRecipe({ name: '', ingredients: '', instructions: '' });
  };

  const generateShoppingList = () => {
    let list = [];
    mealPlan.forEach(meal => {
      list = [...list, ...meal.ingredients];
    });
    setShoppingList(list);
  };

  const updateCalories = () => {
    setCalories(calories + parseInt(mealCalories, 10));
    setMealCalories('');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Prepper - Meal Planning App</Text>
    <Text style={styles.header}>(Initial Test Only)</Text>

      {/* Meal Plan Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Create Your Weekly Meal Plan</Text>
        <TextInput
          style={styles.input}
          placeholder="Meal Name"
          value={meal.name}
          onChangeText={(text) => setMeal({ ...meal, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Ingredients (comma separated)"
          value={meal.ingredients}
          onChangeText={(text) => setMeal({ ...meal, ingredients: text })}
        />
        <Button title="Add Meal" onPress={addMealToPlan} />
      </View>

      {/* Recipe Library Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recipe Library</Text>
        <TextInput
          style={styles.input}
          placeholder="Recipe Name"
          value={newRecipe.name}
          onChangeText={(text) => setNewRecipe({ ...newRecipe, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Ingredients (comma separated)"
          value={newRecipe.ingredients}
          onChangeText={(text) => setNewRecipe({ ...newRecipe, ingredients: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Instructions"
          value={newRecipe.instructions}
          onChangeText={(text) => setNewRecipe({ ...newRecipe, instructions: text })}
        />
        <Button title="Add Recipe" onPress={addRecipe} />
        <FlatList
          data={recipes}
          renderItem={({ item }) => (
            <View style={styles.recipe}>
              <Text style={styles.recipeText}>{item.name}</Text>
              <Text>Ingredients: {item.ingredients.join(', ')}</Text>
              <Text>{item.instructions}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>

      {/* Calorie Tracker Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Calorie and Nutrition Tracker</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Meal Calories"
          keyboardType="numeric"
          value={mealCalories}
          onChangeText={setMealCalories}
        />
        <Button title="Add Calories" onPress={updateCalories} />
        <Text style={styles.text}>Total Calories: {calories}</Text>
      </View>

      {/* Shopping List Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shopping List</Text>
        <FlatList
          data={shoppingList}
          renderItem={({ item }) => <Text style={styles.text}>{item}</Text>}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5, // For shadow on Android devices
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
  },
  button: {
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  recipe: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  recipeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
