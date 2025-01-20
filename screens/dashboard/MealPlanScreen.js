import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import moment from 'moment';
import globalStyle from '../../constants/GlobalStyle';

const MealPlanScreen = () => {
    const [userData, setUserData] = useState(null);
    const [selectedDay, setSelectedDay] = useState('M');
    const [modalVisible, setModalVisible] = useState(false);
    const [mealToDelete, setMealToDelete] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserData = async () => {
            if (auth.currentUser) {
                try {
                    const userDoc = await getDoc(doc(db, 'userInfo', auth.currentUser.uid));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setUserData(data);
                    } else {
                        console.log('No such document!');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            } else {
                console.log('User is not authenticated');
            }
        };
        fetchUserData();
    }, []);

    // Full day names mapping
    const fullDayNames = {
        M: 'Monday',
        T: 'Tuesday',
        W: 'Wednesday',
        Th: 'Thursday',
        F: 'Friday',
        St: 'Saturday',
        Sn: 'Sunday',
    };

    const calculateTotalCalories = (day) => {
        const mealsForDay = userData?.mealPlan?.filter(meal => meal.mealDay === day) || [];
        return mealsForDay.reduce((total, meal) => total + meal.macronutrients?.calories, 0);
    };

    const calculateTotalProtein = (day) => {
        const mealsForDay = userData?.mealPlan?.filter(meal => meal.mealDay === day) || [];
        return mealsForDay.reduce((total, meal) => total + meal.macronutrients?.protein, 0);
    };

    const calculateTotalFat = (day) => {
        const mealsForDay = userData?.mealPlan?.filter(meal => meal.mealDay === day) || [];
        return mealsForDay.reduce((total, meal) => total + meal.macronutrients?.fat, 0);
    };

    const calculateTotalCarbs = (day) => {
        const mealsForDay = userData?.mealPlan?.filter(meal => meal.mealDay === day) || [];
        return mealsForDay.reduce((total, meal) => total + meal.macronutrients?.carbs, 0);
    };

    const deleteMeal = async () => {
        if (mealToDelete && mealToDelete.recipeId) {
            const recipeId = mealToDelete.recipeId;
            const mealDay = selectedDay;
            console.log('Deleting meal with ID:', recipeId, 'on day:', mealDay);
    
            try {
                const userDocRef = doc(db, 'userInfo', auth.currentUser.uid);
                const userDoc = await getDoc(userDocRef);
    
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const updatedMealPlan = userData.mealPlan.filter(meal => 
                        !(meal.recipeId === recipeId && meal.mealDay === mealDay)
                    );
    
                    await setDoc(userDocRef, { mealPlan: updatedMealPlan }, { merge: true });
    
                    console.log('Meal deleted successfully');
                    Alert.alert('Success', 'Meal deleted successfully.');
                    setModalVisible(false);
                } else {
                    console.log('User document does not exist');
                    Alert.alert('Error', 'User document not found.');
                }
            } catch (error) {
                console.error('Error deleting meal:', error);
                Alert.alert('Error', 'Something went wrong while deleting the meal.');
            }
        } else {
            console.error('No valid meal selected for deletion:', mealToDelete);
            Alert.alert('Error', 'No valid meal selected for deletion.');
        }
    };

    const handleDeleteMealClick = (meal) => {
        console.log('Meal selected for deletion:', meal);
        if (meal && meal.recipeId) {
            setMealToDelete(meal);
            setModalVisible(true);
        } else {
            console.error('Invalid meal selected for deletion:', meal);
        }
    };

    const handleEditMeal = (meal, index, selectedDay) => {
        console.log('Navigating with:', { mealIndex: index, selectedDay: selectedDay });

        // Ensure selectedDay and mealIndex are defined before navigating
        if (selectedDay && index !== undefined) {
            navigation.navigate('EditMealPlanScreen', { mealIndex: index, selectedDay: selectedDay });
        } else {
            Alert.alert('Error', 'Missing meal index or selected day.');
        }
    };

    const resetMealPlan = async () => {
        try {
            const userDocRef = doc(db, 'userInfo', auth.currentUser.uid); // Reference to user's document
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                // Set the mealPlan array to an empty array
                await setDoc(userDocRef, { mealPlan: [] }, { merge: true });

                console.log('Meal plan reset successfully');
                Alert.alert('Success', 'Meal plan has been reset.');
            } else {
                console.log('User document does not exist');
                Alert.alert('Error', 'User document not found.');
            }
        } catch (error) {
            console.error('Error resetting meal plan:', error);
            Alert.alert('Error', 'Something went wrong while resetting the meal plan.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            <Text style={[globalStyle.textBold, styles.title]}>My Meal Plans</Text>

            <View style={styles.daySelector}>
                {['M', 'T', 'W', 'Th', 'F', 'St', 'Sn'].map((day) => (
                    <TouchableOpacity
                        key={day}
                        style={[styles.dayButton, selectedDay === day && styles.selectedDay]}
                        onPress={() => setSelectedDay(day)}
                    >
                        <Text style={globalStyle.textRegular}>{day.slice(0, 3)}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.mealPlanOverview}>
                {/* Display full name of the day */}
                <Text style={[globalStyle.textBold, styles.sectionTitle]}>
                    Meals for {fullDayNames[selectedDay]}
                </Text>
                {userData?.mealPlan?.filter(meal => meal.mealDay === selectedDay)?.length ? (
                    userData.mealPlan.filter(meal => meal.mealDay === selectedDay).map((meal, index) => (
                        <View key={index} style={styles.mealPane}>
                            <Text style={[globalStyle.textRegular, styles.mealPlanText]}>{meal.title}</Text>
                            <Text style={[globalStyle.textRegular, styles.mealPlanText]}>Calories: {meal.macronutrients.calories} kcal</Text>
                            <Text style={[globalStyle.textRegular, styles.mealPlanText]}>Protein: {meal.macronutrients.protein} g</Text>
                            <Text style={[globalStyle.textRegular, styles.mealPlanText]}>Fat: {meal.macronutrients.fat} g</Text>
                            <Text style={[globalStyle.textRegular, styles.mealPlanText]}>Carbs: {meal.macronutrients.carbs} g</Text>
                            <Text style={[globalStyle.textRegular, styles.mealPlanText]}>Time: {meal.mealTime}</Text>

                            <View style={styles.mealActions}>
                                <TouchableOpacity onPress={() => handleEditMeal(meal, index, selectedDay)}>
                                    <Text style={styles.editText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDeleteMealClick(meal)}>
                                    <Text style={styles.deleteText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={[globalStyle.textRegular, styles.mealPlanText]}>No meal plan available for {fullDayNames[selectedDay]}.</Text>
                )}
            </View>

            <TouchableOpacity style={styles.addMealButton} onPress={() => navigation.navigate('RecipeScreen')}>
                <Text style={[globalStyle.textBold, styles.addMealButtonText]}>Add a Meal Plan</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.createMealButton} onPress={() => navigation.navigate('CustomMealPlanScreen')}>
                <Text style={[globalStyle.textBold, styles.createMealButtonText]}>Add a Custom Meal Plan</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingButton} onPress={resetMealPlan}>
                <Text style={[globalStyle.textBold, styles.settingButtonText]}>Reset Entire Meal Plan</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={[globalStyle.textRegular, styles.modalText]}>Are you sure you want to delete this meal?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={deleteMeal} style={styles.modalButton}>
                                <Text style={[globalStyle.textBold, styles.modalButtonText]}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
                                <Text style={[globalStyle.textBold, styles.modalButtonText]}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E',
        padding: 16,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 16,
        zIndex: 1,
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        marginVertical: 16,
        marginTop: 40,
        color: '#fff', // White text
    },
    daySelector: {
        flexDirection: 'row',
		marginHorizontal: 14,
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20,
    },
    dayButton: {
        backgroundColor: '#2C2C2C',
        padding: 8,
        borderRadius: 5,
        margin: 4,
        width: '12%',
        alignItems: 'center',
    },
    selectedDay: {
        backgroundColor: '#9D4EDD',
    },
    mealPlanOverview: {
        marginTop: 0,
    },
    mealPane: {
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#2C2C2C',
        borderRadius: 8,
    },
    sectionTitle: {
        marginBottom: 10,
        fontSize: 24,
        color: '#ffffff',
    },
    mealPlanText: {
        fontSize: 16,
        marginVertical: 4,
        color: '#B0B0B0',
    },
    addMealButton: {
        backgroundColor: '#8A2BE2',
        padding: 12,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
    },
    addMealButtonText: {
        fontSize: 16,
        color: '#fff',
    },
    createMealButton: {
        backgroundColor: '#330099',
        padding: 12,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
    },
    createMealButtonText: {
        fontSize: 16,
        color: '#fff',
    },
    settingButton: {
        backgroundColor: 'crimson',
        padding: 12,
        borderRadius: 5,
        marginTop: 20,
        marginBottom: 40,
        alignItems: 'center',
    },
    settingButtonText: {
        fontSize: 16,
        color: '#fff',
    },
    mealActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    editText: {
        color: 'lightgreen',
        fontSize: 16,
    },
    deleteText: {
        color: '#FF5C5C',
        fontSize: 16
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#2C2C2C',
        padding: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalText: {
        color: '#fff',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    modalButton: {
        backgroundColor: '#8A2BE2',
        padding: 10,
        borderRadius: 5,
        width: '40%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#fff',
    },
});

export default MealPlanScreen;
