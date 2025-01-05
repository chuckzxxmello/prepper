import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import { colors } from '../../constants/colors'; // Ensure this path is correct
import CustomButton from '../../components/CustomButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { auth, db } from '../../config/firebase';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';

const RecipeDetailScreen = ({ route, navigation }) => {
    const { recipe } = route.params;

    // Extract nutrient information, parse to remove decimals
    const nutrients = recipe.nutrition?.nutrients || [];
    const getNutrientAmount = (name) => {
        const amount = nutrients.find((n) => n.name === name)?.amount || null;
        return amount ? Math.round(amount) : 'N/A';
    };

    const calories = getNutrientAmount('Calories');
    const protein = getNutrientAmount('Protein');
    const fat = getNutrientAmount('Fat');
    const carbs = getNutrientAmount('Carbohydrates');

    // Extract ingredients
    const ingredients = recipe.extendedIngredients || [];

    // Extract instructions
    let instructions = [];
    if (recipe.instructions) {
        instructions = recipe.instructions
            .split('. ')
            .map((step) => step.trim())
            .filter((step) => step.length > 0);
    } else if (
        recipe.analyzedInstructions &&
        recipe.analyzedInstructions.length > 0 &&
        recipe.analyzedInstructions[0].steps
    ) {
        instructions = recipe.analyzedInstructions[0].steps.map((stepObj) => stepObj.step);
    }

    const addIngredientsToGroceryList = async () => {
        if (!auth.currentUser) {
            Alert.alert('Error', 'You need to be logged in to add items to the grocery list.');
            return;
        }
    
        const userId = auth.currentUser.uid;
        const userRef = doc(db, 'userInfo', userId);
    
        try {
            const userDoc = await getDoc(userRef);
            const currentGroceryList = userDoc.exists() ? userDoc.data().groceryList || [] : [];
    
            console.log("Current grocery list:", currentGroceryList);
    
            // Extract clean ingredient names
            const newItems = ingredients
                .map((ingredient) => {
                    // Prefer clean name or name field if available, fallback to extracting from original
                    return ingredient.nameClean || ingredient.name || extractCoreIngredient(ingredient.original);
                })
                .filter((ingredientName) => 
                    ingredientName && 
                    !currentGroceryList.some((item) => item.name.toLowerCase() === ingredientName.toLowerCase())
                )
                .map((ingredientName) => ({
                    name: ingredientName,
                    checked: false,
                }));
    
            console.log("Cleaned new items to add:", newItems);
    
            if (newItems.length > 0) {
                await updateDoc(userRef, {
                    groceryList: arrayUnion(...newItems),
                });
    
                Alert.alert('Success', 'Ingredients added to your grocery list!');
            } else {
                Alert.alert('Notice', 'All ingredients are already in your grocery list.');
            }
        } catch (error) {
            console.error('Error adding ingredients to grocery list:', error);
            Alert.alert('Error', 'Failed to add ingredients to the grocery list.');
        }
    };
    
    // Utility function to extract the core ingredient from the original string
    const extractCoreIngredient = (original) => {
        // Remove measurements, quantities, and extra descriptions using regex
        return original
            .toLowerCase() // Convert to lowercase
            .replace(/(\d+\s?\w*)/, '') // Remove quantities (e.g., 4tsp, 1 cup)
            .replace(/(minced|sliced|chopped|diced|crushed|ground|peeled|whole|fresh|large|small|medium|fine)/g, '') // Remove descriptors
            .replace(/[^a-z\s]/g, '') // Remove non-alphabetic characters
            .trim(); // Trim extra spaces
    };
    

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
            <View style={styles.detailsWrapper}>
                <View style={styles.detailsContainer}>
                    <Text style={styles.title}>{recipe.title}</Text>

                    {/* Time to Make */}
                    <View style={styles.timeContainer}>
                        <Icon name="access-time" size={20} color={colors.primary} />
                        <Text style={styles.timeText}>
                            {recipe.readyInMinutes ? `${recipe.readyInMinutes}mins` : 'N/A'}
                        </Text>
                    </View>

                    {/* Nutritional Information */}
                    <View style={styles.nutrientsContainer}>
                        <View style={styles.nutrientBox}>
                            <Text style={styles.nutrientLabel}>Calories</Text>
                            <Text style={styles.nutrientValue}>
                                {calories === 'N/A' ? 'N/A' : `${calories}kcal`}
                            </Text>
                        </View>
                        <View style={styles.nutrientBox}>
                            <Text style={styles.nutrientLabel}>Protein</Text>
                            <Text style={styles.nutrientValue}>
                                {protein === 'N/A' ? 'N/A' : `${protein}g`}
                            </Text>
                        </View>
                        <View style={styles.nutrientBox}>
                            <Text style={styles.nutrientLabel}>Fat</Text>
                            <Text style={styles.nutrientValue}>
                                {fat === 'N/A' ? 'N/A' : `${fat}g`}
                            </Text>
                        </View>
                        <View style={styles.nutrientBox}>
                            <Text style={styles.nutrientLabel}>Carbs</Text>
                            <Text style={styles.nutrientValue}>
                                {carbs === 'N/A' ? 'N/A' : `${carbs}g`}
                            </Text>
                        </View>
                    </View>

                    {/* Ingredients */}
                    <Text style={styles.sectionTitle}>Ingredients</Text>
                    {ingredients.length > 0 ? (
                        ingredients.map((ingredient, index) => (
                            <Text key={`${ingredient.id}-${index}`} style={styles.text}>
                                • {ingredient.original}
                            </Text>
                        ))
                    ) : (
                        <Text style={styles.text}>No ingredients available.</Text>
                    )}

                    {/* Instructions */}
                    <Text style={styles.sectionTitle}>Instructions</Text>
                    {instructions.length > 0 ? (
                        instructions.map((step, index) => (
                            <View key={index} style={styles.stepContainer}>
                                <Text style={styles.stepNumber}>{index + 1}.</Text>
                                <Text style={styles.stepText}>{step}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.text}>No instructions available.</Text>
                    )}
                </View>
            </View>

            {/* Add to Grocery List Button */}
            <CustomButton
                title="Add Ingredients to Grocery List"
                onPress={addIngredientsToGroceryList}
                type="primary"
                buttonStyle={styles.button}
            />

            {/* Back Button */}
            <CustomButton
                title="Back"
                onPress={() => navigation.goBack()}
                type="primary"
                buttonStyle={styles.button}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    recipeImage: {
        width: '100%',
        height: 250,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    detailsWrapper: {
        marginTop: -20,
        marginHorizontal: 15,
        borderRadius: 20,
        backgroundColor: '#fff',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        marginBottom: 20,
    },
    detailsContainer: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 10,
        textAlign: 'center',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    timeText: {
        fontSize: 16,
        color: '#555',
        marginLeft: 5,
    },
    nutrientsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        marginTop: 10,
    },
    nutrientBox: {
        alignItems: 'center',
        minWidth: 70,
    },
    nutrientLabel: {
        fontSize: 14,
        color: '#888',
        marginBottom: 2,
    },
    nutrientValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.primary,
        marginTop: 10,
        marginBottom: 5,
    },
    text: {
        fontSize: 16,
        color: '#444',
        marginBottom: 5,
        lineHeight: 22,
    },
    stepContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    stepNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
        marginRight: 5,
    },
    stepText: {
        flex: 1,
        fontSize: 16,
        color: '#444',
        lineHeight: 22,
    },
    button: {
        alignSelf: 'center',
        width: '90%',
        marginBottom: 15,
    },
});

export default RecipeDetailScreen;
