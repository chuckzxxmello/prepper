import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../config/firebase'; // Adjust the path if needed
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import RNPickerSelect from 'react-native-picker-select'; // Import Picker

const MeScreen = () => {
    const [userData, setUserData] = useState({
        goal: '',
        age: '',
        height: '',
        weight: '',
        gender: '',
        activityLevel: '',
    });

    const [selectedGoal, setSelectedGoal] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedActivityLevel, setSelectedActivityLevel] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserData = async () => {
            if (auth.currentUser) {
                try {
                    const userDoc = await getDoc(doc(db, 'userInfo', auth.currentUser.uid));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setUserData({
                            goal: data.goal || '',
                            age: data.age || '',
                            height: data.height || '',
                            weight: data.weight || '',
                            gender: data.gender || '',
                            activityLevel: data.activityLevel || '',
                        });

                        // Map Firestore values to UI-friendly values
                        setSelectedGoal(mapGoalToUI(data.goal || 'gain'));
                        setSelectedGender(data.gender || 'male');
                        setSelectedActivityLevel(mapActivityLevelToUI(data.activityLevel || 'sedentary'));
                    } else {
                        console.log('No such document!');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };
        fetchUserData();
    }, []);

    const mapGoalToUI = (goal) => {
        switch (goal) {
            case 'gain':
                return 'Gain Weight';
            case 'lose':
                return 'Lose Weight';
            case 'maintain':
                return 'Maintain Weight';
            default:
                return 'Gain Weight'; // Default value
        }
    };

    const mapActivityLevelToUI = (activityLevel) => {
        switch (activityLevel) {
            case 'sedentary':
                return 'Sedentary';
            case 'light':
                return 'Light';
            case 'moderate':
                return 'Moderate';
            case 'active':
                return 'Active';
            case 'veryActive':
                return 'Very Active';
            default:
                return 'Sedentary'; // Default value
        }
    };

    const handleInputChange = (field, value) => {
        setUserData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        if (auth.currentUser) {
            // Mapping selected goal value to Firestore-friendly format
            const goalValue = selectedGoal === 'Lose Weight' ? 'lose' : selectedGoal === 'Maintain Weight' ? 'maintain' : 'gain';

            // Activity level mapping
            const activityMap = {
                'Sedentary': 'sedentary',
                'Light': 'light',
                'Moderate': 'moderate',
                'Active': 'active',
                'Very Active': 'veryActive',
            };

            // Ensure selected activity level is mapped correctly
            const activityLevelValue = activityMap[selectedActivityLevel] || '';

            try {
                const userDocRef = doc(db, 'userInfo', auth.currentUser.uid);
                await updateDoc(userDocRef, {
                    goal: goalValue,
                    age: userData.age,
                    height: userData.height,
                    weight: userData.weight,
                    gender: selectedGender,
                    activityLevel: activityLevelValue,
                }); // Use updateDoc instead of setDoc to avoid overwriting entire document
                console.log('User data updated successfully');
                navigation.goBack();
            } catch (error) {
                console.error('Error updating user data:', error);
            }
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.header}>Physical Stats</Text>
            <View style={styles.form}>
                <Text style={styles.subHeader}>Goal</Text>
                <RNPickerSelect
                    onValueChange={(value) => setSelectedGoal(value)}
                    items={[
                        { label: 'Lose Weight', value: 'Lose Weight' },
                        { label: 'Maintain Weight', value: 'Maintain Weight' },
                        { label: 'Gain Weight', value: 'Gain Weight' },
                    ]}
                    value={selectedGoal || 'Lose Weight'} // Default value as fetched from Firestore
                    style={pickerSelectStyles}
                />
                <Text style={styles.subHeader}>Age</Text>
                <TextInput
                    style={styles.input}
                    value={userData.age}
                    onChangeText={(value) => handleInputChange('age', value)}
                />
                <Text style={styles.subHeader}>Height (cm)</Text>
                <TextInput
                    style={styles.input}
                    value={userData.height}
                    onChangeText={(value) => handleInputChange('height', value)}
                />
                <Text style={styles.subHeader}>Weight (kg)</Text>
                <TextInput
                    style={styles.input}
                    value={userData.weight}
                    onChangeText={(value) => handleInputChange('weight', value)}
                />
                <Text style={styles.subHeader}>Gender</Text>
                <RNPickerSelect
                    onValueChange={(value) => setSelectedGender(value)}
                    items={[
                        { label: 'Male', value: 'male' },
                        { label: 'Female', value: 'female' },
                    ]}
                    value={selectedGender || 'male'} // Default value as fetched from Firestore
                    style={pickerSelectStyles}
                />
                <Text style={styles.subHeader}>Activity Level</Text>
                <RNPickerSelect
                    onValueChange={(value) => setSelectedActivityLevel(value)}
                    items={[
                        { label: 'Sedentary', value: 'Sedentary' },
                        { label: 'Light', value: 'Light' },
                        { label: 'Moderate', value: 'Moderate' },
                        { label: 'Active', value: 'Active' },
                        { label: 'Very Active', value: 'Very Active' },
                    ]}
                    value={selectedActivityLevel || 'Sedentary'} // Default value as fetched from Firestore
                    style={pickerSelectStyles}
                />
                <TouchableOpacity style={styles.calculateButton} onPress={handleSave}>
                    <Text style={styles.calculateButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#1E1E1E', // Dark background
        marginTop: 40,
    },
    backButton: {
        position: 'absolute',
        top: 25,
        left: 16,
        zIndex: 1,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#FFFFFF', // White text for header
    },
    subHeader: {
        marginVertical: 8,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    input: {
        height: 40,
        borderColor: '#4a148c',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 8,
        backgroundColor: '#2d2d2d',
        color: '#fff',
        borderRadius: 8,
    },
    calculateButton: {
        backgroundColor: '#6a1b9a', // Purple background for calculate button
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 16,
    },
    calculateButtonText: {
        color: '#fff', // White text for calculate button
        fontWeight: 'bold',
        fontSize: 16,
    },
});

// Custom style for the picker select
const pickerSelectStyles = StyleSheet.create({
    inputAndroid: {
        backgroundColor: '#2d2d2d',
        color: '#fff',
        borderRadius: 8,
        borderColor: '#4a148c',
        marginBottom: 10,
    },
});

export default MeScreen;
