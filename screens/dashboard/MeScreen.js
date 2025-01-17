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
import { auth, db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import RNPickerSelect from 'react-native-picker-select';
import globalStyle from '../../constants/GlobalStyle'; // Import global styles

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
                return 'Gain Weight';
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
                return 'Sedentary';
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
            const goalValue = selectedGoal === 'Lose Weight' ? 'lose' : selectedGoal === 'Maintain Weight' ? 'maintain' : 'gain';

            const activityMap = {
                Sedentary: 'sedentary',
                Light: 'light',
                Moderate: 'moderate',
                Active: 'active',
                VeryActive: 'veryActive',
            };

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
                });
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
            <Text style={[globalStyle.textSemiBold, styles.header]}>Physical Stats</Text>
            <View style={styles.form}>
                <Text style={[globalStyle.textSemiBold, styles.subHeader]}>Goal</Text>
                <RNPickerSelect
                    onValueChange={(value) => setSelectedGoal(value)}
                    items={[
                        { label: 'Lose Weight', value: 'Lose Weight' },
                        { label: 'Maintain Weight', value: 'Maintain Weight' },
                        { label: 'Gain Weight', value: 'Gain Weight' },
                    ]}
                    value={selectedGoal || 'Lose Weight'}
                    style={pickerSelectStyles}
                />
                <Text style={[globalStyle.textSemiBold, styles.subHeader]}>Age</Text>
                <TextInput
                    style={[globalStyle.textRegular, styles.input]}
                    value={userData.age}
                    onChangeText={(value) => handleInputChange('age', value)}
                />
                <Text style={[globalStyle.textSemiBold, styles.subHeader]}>Height (cm)</Text>
                <TextInput
                    style={[globalStyle.textRegular, styles.input]}
                    value={userData.height}
                    onChangeText={(value) => handleInputChange('height', value)}
                />
                <Text style={[globalStyle.textSemiBold, styles.subHeader]}>Weight (kg)</Text>
                <TextInput
                    style={[globalStyle.textRegular, styles.input]}
                    value={userData.weight}
                    onChangeText={(value) => handleInputChange('weight', value)}
                />
                <Text style={[globalStyle.textSemiBold, styles.subHeader]}>Gender</Text>
                <RNPickerSelect
                    onValueChange={(value) => setSelectedGender(value)}
                    items={[
                        { label: 'Male', value: 'male' },
                        { label: 'Female', value: 'female' },
                    ]}
                    value={selectedGender || 'male'}
                    style={pickerSelectStyles}
                />
                <Text style={[globalStyle.textSemiBold, styles.subHeader]}>Activity Level</Text>
                <RNPickerSelect
                    onValueChange={(value) => setSelectedActivityLevel(value)}
                    items={[
                        { label: 'Sedentary', value: 'Sedentary' },
                        { label: 'Light', value: 'Light' },
                        { label: 'Moderate', value: 'Moderate' },
                        { label: 'Active', value: 'Active' },
                        { label: 'Very Active', value: 'Very Active' },
                    ]}
                    value={selectedActivityLevel || 'Sedentary'}
                    style={pickerSelectStyles}
                />
                <TouchableOpacity style={styles.calculateButton} onPress={handleSave}>
                    <Text style={[globalStyle.textSemiBold, styles.calculateButtonText]}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#1E1E1E',
    },
    backButton: {
        position: 'absolute',
        top: 25,
        left: 16,
        zIndex: 1,
    },
    header: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 30,
        color: '#FFFFFF',
    },
    subHeader: {
        marginVertical: 8,
        fontSize: 18,
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
        backgroundColor: '#6a1b9a',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 16,
    },
    calculateButtonText: {
        fontSize: 16,
        color: '#fff',
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputAndroid: {
        backgroundColor: '#2d2d2d',
        color: '#fff',
        borderRadius: 8,
        borderColor: '#4a148c',
        marginBottom: 10,
        paddingLeft: 8,
    },
});

export default MeScreen;
