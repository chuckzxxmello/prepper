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

const MeScreen = () => {
    const [userData, setUserData] = useState({
        goal: '',
        age: '',
        height: '',
        weight: '',
        gender: '',
        lifestyle: '',
    });
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
                            lifestyle: data.lifestyle || '',
                        });
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

    const handleInputChange = (field, value) => {
        setUserData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        if (auth.currentUser) {
            try {
                const userDocRef = doc(db, 'userInfo', auth.currentUser.uid);
                await updateDoc(userDocRef, userData); // Use updateDoc instead of setDoc to avoid overwriting entire document
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
            <View style={styles.meHeader}>
                <Text style={styles.meHeaderText}>Me</Text>
            </View>
            <View style={styles.form}>
                <Text style={styles.label}>Goal</Text>
                <TextInput
                    style={styles.input}
                    value={userData.goal}
                    onChangeText={(value) => handleInputChange('goal', value)}
                />
                <Text style={styles.label}>Age</Text>
                <TextInput
                    style={styles.input}
                    value={userData.age}
                    onChangeText={(value) => handleInputChange('age', value)}
                />
                <Text style={styles.label}>Height (cm)</Text>
                <TextInput
                    style={styles.input}
                    value={userData.height}
                    onChangeText={(value) => handleInputChange('height', value)}
                />
                <Text style={styles.label}>Weight (kg)</Text>
                <TextInput
                    style={styles.input}
                    value={userData.weight}
                    onChangeText={(value) => handleInputChange('weight', value)}
                />
                <Text style={styles.label}>Gender</Text>
                <TextInput
                    style={styles.input}
                    value={userData.gender}
                    onChangeText={(value) => handleInputChange('gender', value)}
                />
                <Text style={styles.label}>Lifestyle</Text>
                <TextInput
                    style={styles.input}
                    value={userData.lifestyle}
                    onChangeText={(value) => handleInputChange('lifestyle', value)}
                />
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E', // Dark background color
        padding: 16,
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 16,
        zIndex: 1,
    },
    meHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    meHeaderText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#9D4EDD', // Purple color
    },
    form: {
        backgroundColor: '#2E2E2E', // Dark panel background color
        borderRadius: 10,
        padding: 12,
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        color: '#fff', // White text color for label
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#3C3C3C', // Slightly lighter dark color for input fields
        borderRadius: 10,
        padding: 8,
        marginBottom: 16,
        borderColor: '#9D4EDD', // Purple border color
        borderWidth: 1,
        color: '#fff', // White text inside input fields
    },
    saveButton: {
        backgroundColor: '#9D4EDD', // Purple save button
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default MeScreen;
