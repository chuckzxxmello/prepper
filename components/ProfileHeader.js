import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Icons for UI
import { auth, db } from '../config/firebase'; // Ensure the path is correct based on your project structure
import { doc, getDoc } from 'firebase/firestore';
import globalStyle from '../constants/GlobalStyle'; // Import the global font styles

const ProfileHeader = () => {
    const [userData, setUserData] = useState(null);
    const navigation = useNavigation(); // Hook for navigation

    useEffect(() => {
        const fetchUserData = async () => {
            if (auth.currentUser) {
                try {
                    const userDoc = await getDoc(doc(db, 'userInfo', auth.currentUser.uid));
                    if (userDoc.exists()) {
                        setUserData(userDoc.data());
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

    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
                <Text style={[globalStyle.textSemiBold, styles.userName]}>
                    {userData?.fullName || 'User'}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.calculatorIcon}
                onPress={() => navigation.navigate('CalorieCalculatorScreen')}
            >
                <Ionicons name="calculator" size={24} color="#BB86FC" />
            </TouchableOpacity>
        </View>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 2,
        paddingTop: 30,
        backgroundColor: '#1E1E1E', // Dark background
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    userName: {
        marginLeft: 15,
        fontSize: 20,
        color: '#FFFFFF', // White text for header
    },
    calculatorIcon: {
        marginLeft: 'auto',
        padding: 12,
    },
});

export default ProfileHeader;
