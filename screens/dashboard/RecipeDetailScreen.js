import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Alert, Modal, TouchableOpacity, Platform } from 'react-native';
import { colors } from '../../constants/colors'; // Ensure this path is correct
import CustomButton from '../../components/CustomButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { auth, db } from '../../config/firebase';
import { doc, updateDoc, arrayUnion, getDoc, Timestamp } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const RecipeDetailScreen = ({ route }) => {
    const { recipe } = route.params;

    const nutrients = recipe.nutrition?.nutrients || [];
    const getNutrientAmount = (name) => {
        const amount = nutrients.find((n) => n.name === name)?.amount || null;
        return amount ? Math.round(amount) : 'N/A';
    };

    const calories = getNutrientAmount('Calories');
    const protein = getNutrientAmount('Protein');
    const fat = getNutrientAmount('Fat');
    const carbs = getNutrientAmount('Carbohydrates')

    const ingredients = recipe.extendedIngredients || [];

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

    // Add Ingredients to Grocery List function
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
        return original
            .toLowerCase()
            .replace(/(\d+\s?\w*)/, '')
            .replace(/(minced|sliced|chopped|diced|crushed|ground|peeled|whole|fresh|large|small|medium|fine)/g, '')
            .replace(/[^a-z\s]/g, '')
            .trim();
    };

    // Meal Plan Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [mealTime, setMealTime] = useState('');
    const [mealDay, setMealDay] = useState('');
    const [mealType, setMealType] = useState('');
    const [showTimePicker, setShowTimePicker] = useState(false);

    const handleTimeChange = (event, selectedDate) => {
        setShowTimePicker(false);
        if (selectedDate) {
            const formattedTime = moment(selectedDate).format('HH:mm'); // Adjust time format as needed
            setMealTime(formattedTime);
        }
    };

    const handleAddToMealPlan = async () => {
        if (!auth.currentUser) {
            Alert.alert('Error', 'You need to be logged in to add meals to your plan.');
            return;
        }

        if (!mealTime || !mealDay || !mealType) {
            Alert.alert('Error', 'Please select all meal details.');
            return;
        }

        const userId = auth.currentUser.uid;
        const userRef = doc(db, 'userInfo', userId);

        try {
            const mealData = {
                title: recipe.title,
                mealTime,
                mealDay,
                mealType,
                recipeId: recipe.id,
                dateAdded: Timestamp.fromDate(new Date()),
                macronutrients: {
                    calories: calories === 'N/A' ? 0 : calories,
                    protein: protein === 'N/A' ? 0 : protein,
                    fat: fat === 'N/A' ? 0 : fat,
                    carbs: carbs === 'N/A' ? 0 : carbs,
                },
            };

            await updateDoc(userRef, {
                mealPlan: arrayUnion(mealData),
            });

            Alert.alert('Success', 'Recipe added to your meal plan!');
            setModalVisible(false);
        } catch (error) {
            console.error('Error adding recipe to meal plan:', error);
            Alert.alert('Error', 'Failed to add recipe to meal plan.');
        }
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
            <View style={styles.buttonContainer}>
                <CustomButton
                    title="Add Ingredients to Grocery List"
                    onPress={addIngredientsToGroceryList}
                    type="primary"
                    buttonStyle={styles.button}
                />
            </View>
            <View style={styles.buttonContainer}>
                <CustomButton
                    title="Add Recipe to My Meals"
                    onPress={() => setModalVisible(true)}
                    type="primary"
                    buttonStyle={styles.button}
                />
            </View>


            {/* Meal Plan Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Select Meal Details</Text>

                        {/* Meal Time Picker */}
                        <Text style={styles.modalLabel}>Meal Time</Text>
                        <TouchableOpacity
                            style={styles.modalInput}
                            onPress={() => setShowTimePicker(true)}
                        >
                            <Text style={{ color: mealTime ? '#ffffff' : '#B0B0B0' }}>
                                {mealTime || 'Select Time'}
                            </Text>
                        </TouchableOpacity>
                        {showTimePicker && (
                            <DateTimePicker
                                mode="time"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                value={new Date()}
                                onChange={handleTimeChange}
                            />
                        )}

                        {/* Meal Day Picker */}
                        <Text style={styles.modalLabel}>Meal Day</Text>
                        <Picker
                            selectedValue={mealDay}
                            onValueChange={(itemValue) => setMealDay(itemValue)}
                            style={styles.modalInput}
                        >
                            <Picker.Item label="Monday" value="Monday" />
                            <Picker.Item label="Tuesday" value="Tuesday" />
                            <Picker.Item label="Wednesday" value="Wednesday" />
                            <Picker.Item label="Thursday" value="Thursday" />
                            <Picker.Item label="Friday" value="Friday" />
                            <Picker.Item label="Saturday" value="Saturday" />
                            <Picker.Item label="Sunday" value="Sunday" />
                        </Picker>

                        {/* Meal Type Picker */}
                        <Text style={styles.modalLabel}>Meal Type</Text>
                        <Picker
                            selectedValue={mealType}
                            onValueChange={(itemValue) => setMealType(itemValue)}
                            style={styles.modalInput}
                        >
                            <Picker.Item label="Breakfast" value="breakfast" />
                            <Picker.Item label="Lunch" value="lunch" />
                            <Picker.Item label="Dinner" value="dinner" />
                        </Picker>

                        {/* Add to Meal Plan Button */}
                        <CustomButton
                            title="Add to Meal Plan"
                            onPress={handleAddToMealPlan}
                            type="primary"
                            buttonStyle={styles.button}
                        />

                        {/* Close Modal Button */}
                        <TouchableOpacity
                            style={styles.closeModalButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeModalText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        flex: 1,
    },
    recipeImage: {
        width: '100%',
        height: 250,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    detailsWrapper: {
        margin: 16,
    },
    detailsContainer: {
        backgroundColor: colors.white,
        padding: 16,
        borderRadius: 12,
        elevation: 8, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Inter-SemiBold', // Use SemiBold for headers
        color: colors.text,
        marginBottom: 10,
        textAlign: 'center',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    timeText: {
        fontSize: 16,
        fontFamily: 'Inter-Regular', // Use Regular for body text
        color: colors.text,
        marginLeft: 5,
    },
    nutrientsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    nutrientBox: {
        alignItems: 'center',
        marginBottom: 10,
        padding: 8,
        borderRadius: 8,
        backgroundColor: colors.backgroundLight,
    },
    nutrientLabel: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        color: colors.textLight,
    },
    nutrientValue: {
        fontSize: 14,
        fontFamily: 'Inter-SemiBold',
        color: colors.text,
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: 'Inter-SemiBold',
        color: colors.text,
        marginVertical: 16,
    },
    text: {
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        color: colors.text,
        marginBottom: 5,
    },
    stepContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    stepNumber: {
        fontSize: 18,
        fontFamily: 'Inter-Bold',
        color: colors.primary,
        marginRight: 8,
    },
    stepText: {
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        color: colors.text,
        flex: 1,
    },
    buttonContainer: {
        marginHorizontal: 16, 
        marginBottom: 12, 
        width: '70%', 
        alignSelf: 'center', 
    },
    button: {
        paddingVertical: 10, 
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: colors.background,
        padding: 20,
        borderRadius: 12,
        width: '90%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 22,
        fontFamily: 'Inter-SemiBold',
        color: colors.text,
        marginBottom: 20,
    },
    modalLabel: {
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        color: colors.textLight,
        marginBottom: 10,
    },
    modalInput: {
        backgroundColor: colors.backgroundLight,
        width: '100%',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        color: colors.text,
    },
    closeModalButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: colors.primary,
        borderRadius: 8,
        marginTop: 16,
    },
    closeModalText: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        color: colors.white,
    },
});


export default RecipeDetailScreen;
