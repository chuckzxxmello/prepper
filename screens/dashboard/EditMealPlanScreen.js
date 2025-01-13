import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { auth, db } from '../../config/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const EditMealPlanScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const { mealIndex, selectedDay } = route.params || {}; // Destructure params correctly

    const [mealData, setMealData] = useState(null);
    const [mealName, setMealName] = useState('');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [fat, setFat] = useState('');
    const [carbs, setCarbs] = useState('');
    const [mealTime, setMealTime] = useState(''); // Store mealTime as string
    const [mealDay, setMealDay] = useState(selectedDay || ''); // Initialize with selectedDay
    const [mealType, setMealType] = useState('');
    const [showTimePicker, setShowTimePicker] = useState(false);

    useEffect(() => {
        if (mealIndex === undefined || !selectedDay) {
            Alert.alert('Error', 'Meal index or selected day is missing.');
            return;
        }

        const fetchMealData = async () => {
            try {
                const userDocRef = doc(db, 'userInfo', auth.currentUser.uid);
                const docSnapshot = await getDoc(userDocRef);

                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    console.log('Fetched user data:', data);

                    if (Array.isArray(data.mealPlan)) {
                        const mealsForDay = data.mealPlan.filter(meal => meal.mealDay === selectedDay);
                        console.log('Meals for selected day:', mealsForDay);

                        if (mealsForDay.length > mealIndex) {
                            const meal = mealsForDay[mealIndex];
                            setMealData(meal);
                            setMealName(meal.title || '');
                            setCalories((meal.macronutrients?.calories || 0).toString());
                            setProtein((meal.macronutrients?.protein || 0).toString());
                            setFat((meal.macronutrients?.fat || 0).toString());
                            setCarbs((meal.macronutrients?.carbs || 0).toString());
                            setMealTime(meal.mealTime || ''); // Set as string
                            setMealType(meal.mealType || '');
                        } else {
                            Alert.alert('Error', `No meals found for day ${selectedDay} at index ${mealIndex}.`);
                        }
                    } else if (typeof data.mealPlan === 'object' && data.mealPlan[selectedDay]) {
                        const mealsForDay = Object.values(data.mealPlan[selectedDay]);
                        console.log('Meals for selected day:', mealsForDay);

                        if (mealsForDay.length > mealIndex) {
                            const meal = mealsForDay[mealIndex];
                            setMealData(meal);
                            setMealName(meal.title || '');
                            setCalories((meal.macronutrients?.calories || 0).toString());
                            setProtein((meal.macronutrients?.protein || 0).toString());
                            setFat((meal.macronutrients?.fat || 0).toString());
                            setCarbs((meal.macronutrients?.carbs || 0).toString());
                            setMealTime(meal.mealTime || ''); // Set as string
                            setMealType(meal.mealType || '');
                        } else {
                            Alert.alert('Error', `No meals found for day ${selectedDay} at index ${mealIndex}.`);
                        }
                    } else {
                        Alert.alert('Error', `No meals found for selected day: ${selectedDay}`);
                    }
                } else {
                    Alert.alert('Error', 'User data not found.');
                }
            } catch (error) {
                console.error('Error fetching meal data:', error);
                Alert.alert('Error', 'Failed to fetch meal data.');
            }
        };

        fetchMealData();
    }, [mealIndex, selectedDay]);

    const handleEditMeal = async () => {
        if (!mealName || !calories || !mealTime || !protein || !fat || !carbs || !mealDay) {
            Alert.alert('Input Error', 'Please provide meal name, calories, protein, fat, carbs, meal day, and time.');
            return;
        }

        if (isNaN(calories) || isNaN(protein) || isNaN(fat) || isNaN(carbs)) {
            Alert.alert('Invalid Input', 'Please enter valid numbers for calories, protein, fat, and carbs.');
            return;
        }

        const updatedMeal = {
            title: mealName,
            macronutrients: {
                calories: Number(calories),
                protein: Number(protein),
                fat: Number(fat),
                carbs: Number(carbs),
            },
            mealDay: mealDay, // Editable mealDay
            mealTime: mealTime, // Store as string
            mealType: mealType, // Editable mealType
            recipeId: mealData.recipeId, // Retain the original recipeId
        };

        try {
            const userDocRef = doc(db, 'userInfo', auth.currentUser.uid);
            const docSnapshot = await getDoc(userDocRef);
            const data = docSnapshot.data();

            if (Array.isArray(data.mealPlan)) {
                const updatedMealPlan = [...data.mealPlan];
                updatedMealPlan[mealIndex] = {
                    ...updatedMealPlan[mealIndex], 
                    ...updatedMeal, 
                };

                await updateDoc(userDocRef, { mealPlan: updatedMealPlan });
            } else if (typeof data.mealPlan === 'object' && data.mealPlan[selectedDay]) {
                const updatedMealPlan = { ...data.mealPlan };
                updatedMealPlan[selectedDay][mealIndex] = {
                    ...updatedMealPlan[selectedDay][mealIndex], 
                    ...updatedMeal, 
                };

                await updateDoc(userDocRef, { mealPlan: updatedMealPlan });
            } else {
                Alert.alert('Error', 'mealPlan is not in the expected format.');
            }

            Alert.alert('Meal Plan Updated', `Your meal plan for ${mealDay} has been successfully updated!`);
            navigation.goBack();
        } catch (error) {
            console.error('Error updating meal plan:', error);
            Alert.alert('Update Failed', 'There was an error updating the meal plan.');
        }
    };

    const handleTimeChange = (event, selectedDate) => {
        setShowTimePicker(false);
        if (selectedDate) {
            const formattedTime = moment(selectedDate).format('HH:mm');
            setMealTime(formattedTime); // Store mealTime as string
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Edit Meal Plan for {mealDay}</Text>

            {/* Meal Day Dropdown */}
            <Text style={styles.label}>Meal Day</Text>
            <Picker
                style={styles.picker}
                selectedValue={mealDay}
                onValueChange={(itemValue) => setMealDay(itemValue)}
            >
                <Picker.Item label="Monday" value="Monday" />
                <Picker.Item label="Tuesday" value="Tuesday" />
                <Picker.Item label="Wednesday" value="Wednesday" />
                <Picker.Item label="Thursday" value="Thursday" />
                <Picker.Item label="Friday" value="Friday" />
                <Picker.Item label="Saturday" value="Saturday" />
            </Picker>

            {/* Meal Type Dropdown */}
            <Text style={styles.label}>Meal Type</Text>
            <Picker
                style={styles.picker}
                selectedValue={mealType}
                onValueChange={(itemValue) => setMealType(itemValue)}
            >
                <Picker.Item label="Breakfast" value="Breakfast" />
                <Picker.Item label="Lunch" value="Lunch" />
                <Picker.Item label="Dinner" value="Dinner" />
            </Picker>

            <TextInput
                style={styles.input}
                placeholder="Meal Name"
                placeholderTextColor="#bbb"
                value={mealName}
                onChangeText={setMealName}
            />

            <TextInput
                style={styles.input}
                placeholder="Calories"
                value={calories}
                keyboardType="numeric"
                onChangeText={setCalories}
            />

            <TextInput
                style={styles.input}
                placeholder="Protein (g)"
                value={protein}
                keyboardType="numeric"
                onChangeText={setProtein}
            />

            <TextInput
                style={styles.input}
                placeholder="Fat (g)"
                value={fat}
                keyboardType="numeric"
                onChangeText={setFat}
            />

            <TextInput
                style={styles.input}
                placeholder="Carbs (g)"
                value={carbs}
                keyboardType="numeric"
                onChangeText={setCarbs}
            />

            {/* Meal Time Picker */}
            <Text style={styles.label}>Meal Time</Text>
            <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.input}>
                <Text style={{ color: mealTime ? '#ffffff' : '#B0B0B0' }}>
                    {mealTime || 'Select Time'}
                </Text>
            </TouchableOpacity>

            {showTimePicker && (
                <DateTimePicker
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    value={mealTime ? new Date(`1970-01-01T${mealTime}:00`) : new Date()}
                    onChange={handleTimeChange}
                />
            )}

            <Button title="Save Changes" onPress={handleEditMeal} color="#4a148c" />

            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#1a1a1a',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#fff',
    },
    input: {
        height: 45,
        borderColor: '#4a148c',
        borderWidth: 1,
        marginBottom: 15,
        paddingLeft: 10,
        backgroundColor: '#2d2d2d',
        color: '#fff',
        borderRadius: 8,
    },
    label: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 8,
    },
    picker: {
        height: 40,
        backgroundColor: '#2d2d2d',
        color: '#fff',
        borderRadius: 8,
    },
    button: {
        marginTop: 20,
        backgroundColor: '#4a148c',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#ddd',
        alignItems: 'center',
        borderRadius: 8,
    },
    cancelButtonText: {
        fontSize: 18,
        color: '#000',
    },
    dateText: {
        fontSize: 16,
        color: '#bbb',
    },
});

export default EditMealPlanScreen;
