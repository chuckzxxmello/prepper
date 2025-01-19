import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, Modal, TouchableOpacity, Platform } from 'react-native';
import { colors } from '../../constants/colors'; // Ensure this path is correct
import CustomButton from '../../components/CustomButton';
import { auth, db } from '../../config/firebase';
import { doc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const CustomMealPlanScreen = () => {
    const [mealTitle, setMealTitle] = useState('');
    const [calories, setCalories] = useState('');
    const [carbs, setCarbs] = useState('');
    const [fat, setFat] = useState('');
    const [protein, setProtein] = useState('');
    const [mealDay, setMealDay] = useState('');
    const [mealTime, setMealTime] = useState('');
    const [mealType, setMealType] = useState('');
    const [showTimePicker, setShowTimePicker] = useState(false);

    // Meal Type Modal
    const [modalVisible, setModalVisible] = useState(false);

    // Handle time change for meal
    const handleTimeChange = (event, selectedDate) => {
        setShowTimePicker(false);
        if (selectedDate) {
            const formattedTime = moment(selectedDate).format('HH:mm');
            setMealTime(formattedTime);
        }
    };

    // Handle adding custom meal plan to database
    const handleAddToMealPlan = async () => {
    if (!auth.currentUser) {
        Alert.alert('Error', 'You need to be logged in to add meals to your plan.');
        return;
    }

    // Check if all fields are filled
    if (!mealTitle || !calories || !carbs || !fat || !protein || !mealDay || !mealTime || !mealType) {
        Alert.alert('Error', 'Please fill in all the details.');
        return;
    }

    const userId = auth.currentUser.uid;
    const userRef = doc(db, 'userInfo', userId);

    // Meal data according to the required structure
    const mealData = {
        dateAdded: Timestamp.fromDate(new Date()),  // Set current timestamp
        macronutrients: {
            calories: parseInt(calories, 10) || 0,  // Default to 0 if undefined
            carbs: parseInt(carbs, 10) || 0,        // Default to 0 if undefined
            fat: parseInt(fat, 10) || 0,            // Default to 0 if undefined
            protein: parseInt(protein, 10) || 0,    // Default to 0 if undefined
        },
        mealDay,  // Selected day of the week
        mealTime,  // Time of the meal (e.g., '12:30')
        mealType,  // Meal type (e.g., breakfast, lunch, dinner)
        recipeId: Math.floor(Math.random() * 1000000),  // Random recipe ID for custom meal
        title: mealTitle,  // Title of the meal
    };

    try {
        // Update Firestore
        await updateDoc(userRef, {
            mealPlan: arrayUnion(mealData),  // Add new meal data to mealPlan array
        });
        Alert.alert('Success', 'Custom meal plan added!');
        setModalVisible(false);  // Close modal after success
    } catch (error) {
        console.error('Error adding custom meal plan:', error);
        Alert.alert('Error', 'Failed to add meal plan.');
    }
	};

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Custom Meal Plan</Text>

            {/* Meal Title Input */}
            <TextInput
                style={styles.input}
                placeholder="Meal Title"
                placeholderTextColor="#B0B0B0"
                value={mealTitle}
                onChangeText={setMealTitle}
            />

            {/* Calories Input */}
            <TextInput
                style={styles.input}
                placeholder="Calories"
                keyboardType="numeric"
                placeholderTextColor="#B0B0B0"
                value={calories}
                onChangeText={setCalories}
            />

            {/* Carbs Input */}
            <TextInput
                style={styles.input}
                placeholder="Carbs (g)"
                keyboardType="numeric"
                placeholderTextColor="#B0B0B0"
                value={carbs}
                onChangeText={setCarbs}
            />

            {/* Fat Input */}
            <TextInput
                style={styles.input}
                placeholder="Fat (g)"
                keyboardType="numeric"
                placeholderTextColor="#B0B0B0"
                value={fat}
                onChangeText={setFat}
            />

            {/* Protein Input */}
            <TextInput
                style={styles.input}
                placeholder="Protein (g)"
                keyboardType="numeric"
                placeholderTextColor="#B0B0B0"
                value={protein}
                onChangeText={setProtein}
            />

            {/* Meal Day Picker */}
            <Text style={styles.label}>Meal Day</Text>
            <Picker
                selectedValue={mealDay}
                onValueChange={setMealDay}
                style={styles.picker}
            >
                <Picker.Item label="Monday" value="Monday" />
                <Picker.Item label="Tuesday" value="Tuesday" />
                <Picker.Item label="Wednesday" value="Wednesday" />
                <Picker.Item label="Thursday" value="Thursday" />
                <Picker.Item label="Friday" value="Friday" />
                <Picker.Item label="Saturday" value="Saturday" />
                <Picker.Item label="Sunday" value="Sunday" />
            </Picker>

            {/* Meal Time Picker */}
            <Text style={styles.label}>Meal Time</Text>
            <TouchableOpacity
                style={styles.input}
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

            {/* Meal Type Button */}
            <TouchableOpacity
                style={styles.input}
                onPress={() => setModalVisible(true)}
            >
                <Text style={{ color: mealType ? '#ffffff' : '#B0B0B0' }}>
                    {mealType || 'Select Meal Type'}
                </Text>
            </TouchableOpacity>

            {/* Meal Type Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Select Meal Type</Text>
                        <Picker
                            selectedValue={mealType}
                            onValueChange={(itemValue) => setMealType(itemValue)}
                            style={styles.modalInput}
                        >
                            <Picker.Item label="Breakfast" value="breakfast" />
                            <Picker.Item label="Lunch" value="lunch" />
                            <Picker.Item label="Dinner" value="dinner" />
                        </Picker>

                        <CustomButton
                            title="Save Meal Type"
                            onPress={() => setModalVisible(false)}
                            type="primary"
                            buttonStyle={styles.button}
                        />
                    </View>
                </View>
            </Modal>

            {/* Add to Meal Plan Button */}
            <CustomButton
                title="Add to Meal Plan"
                onPress={handleAddToMealPlan}
                type="primary"
                buttonStyle={styles.button}
            />
        </View>
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
        textAlign: 'left',
        marginBottom: 20,
		marginTop: 40,
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
        height: 50,
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
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#2d2d2d',
        padding: 20,
        borderRadius: 8,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    modalInput: {
        height: 40,
        backgroundColor: '#2d2d2d',
        color: '#fff',
        borderRadius: 8,
    },
});

export default CustomMealPlanScreen;
