import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const ProfileScreen = () => {
    const [userData, setUserData] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserData = async () => {
            if (auth.currentUser) {
                try {
                    const userDoc = await getDoc(doc(db, 'userInfo', auth.currentUser.uid));
                    if (userDoc.exists()) {
                        console.log(userDoc.data());  // Debug log
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

    const handleLogout = () => {
        auth.signOut()
            .then(() => {
                navigation.replace('Welcome');
            })
            .catch((error) => console.error('Error logging out:', error));
    };

    if (!userData) {
        return <Text>Loading...</Text>;  // Show loading until userData is available
    }

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Profile Header */}
            <View style={styles.profileHeader}>
                <Image
                    source={
                        userData?.profilePic
                            ? { uri: userData.profilePic }
                            : require('../../assets/default-profile.png')
                    }
                    style={styles.profileImage}
                />
                <Text style={styles.profileName}>{userData?.fullName || 'User'}</Text>
                <Text style={styles.profileEmail}>{userData?.email || 'user@example.com'}</Text>
            </View>

            {/* Me Tab */}
            <TouchableOpacity
                style={styles.meTab}
                onPress={() => navigation.navigate('MeScreen')}
            >
                <Text style={styles.meTabText}>Me</Text>
                <Text style={styles.meTabDescription}>
                    Here you can view and update your personal information.
                </Text>
            </TouchableOpacity>

            {/* Profile Options */}
            <View style={styles.profileOptions}>
                <TouchableOpacity
                    style={styles.option}
                    onPress={() => navigation.navigate('NutrientsIndicator', {
                        weight: userData?.weight || 70, // Provide default values if necessary
                        height: userData?.height || 170,
                        age: userData?.age || 25,
                        gender: userData?.gender || 'male',
                        activityLevel: userData?.activityLevel || 'moderate',
                        goal: userData?.goal || 'maintain'
                    })}
                >
                    <Text style={styles.optionText}>Nutrients Indicator</Text>
                    <View style={styles.optionDetails}>
                        <Ionicons name="restaurant" size={24} color="#9D4EDD" style={styles.optionIcon} />
                        <Text style={styles.optionValue}>{userData?.calorie || 'N/A'} Cal</Text>
                    </View>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.option}>
                    <Text style={styles.optionText}>Weight Unit</Text>
                    <View style={styles.optionDetails}>
                        <Ionicons name="scale" size={24} color="#9D4EDD" style={styles.optionIcon} />
                        <Text style={styles.optionValue}>{userData?.weightUnit || 'Kilograms'}</Text>
                    </View>
                </TouchableOpacity>

                {/* About Us Button */}
                <TouchableOpacity
                    style={styles.option}
                    onPress={() => navigation.navigate('AboutUs')} // Add navigation to About Us screen or any other action
                >
                    <Text style={styles.optionText}>About Us</Text>
                    <View style={styles.optionDetails}>
                        <Ionicons name="information-circle" size={24} color="#9D4EDD" style={styles.optionIcon} />
                    </View>
                </TouchableOpacity>
            </View>

            {/* Logout */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            {/* App Version */}
            <Text style={styles.versionText}>Version: 0.0.1</Text>
        </View>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E', // Dark background
        padding: 16,
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 16,
        zIndex: 1,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 8,
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF', // White text
    },
    profileEmail: {
        fontSize: 14,
        color: '#B0B0B0', // Light gray text
    },
    meTab: {
        backgroundColor: '#2E2E2E', // Dark gray background for the "Me" tab
        borderRadius: 10,
        padding: 12,
        marginBottom: 24,
    },
    meTabText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#9D4EDD', // Purple text for the "Me" tab
    },
    meTabDescription: {
        fontSize: 14,
        color: '#B0B0B0', // Light gray text for description
        marginTop: 8,
    },
    profileOptions: {
        backgroundColor: '#2E2E2E', // Dark gray background for options
        borderRadius: 10,
        padding: 12,
        marginBottom: 24,
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#444', // Dark border
    },
    optionText: {
        fontSize: 16,
        color: '#FFFFFF', // White text for option title
    },
    optionDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionIcon: {
        marginRight: 8,
    },
    optionValue: {
        fontSize: 16,
        color: '#9D4EDD', // Purple color for option value
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: '#9D4EDD', // Purple background for logout button
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 16,
    },
    logoutText: {
        color: '#FFFFFF', // White text for logout button
        fontWeight: 'bold',
    },
    versionText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#B0B0B0', // Light gray text for version
    },
});

export default ProfileScreen;
