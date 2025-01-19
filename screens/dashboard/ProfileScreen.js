import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import globalStyle from '../../constants/GlobalStyle'; // Import global styles

const ProfileScreen = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);  // Loading state
    const [error, setError] = useState(null);      // Error state
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserData = async () => {
            if (auth.currentUser) {
                try {
                    const userDoc = await getDoc(doc(db, 'userInfo', auth.currentUser.uid));
                    if (userDoc.exists()) {
                        setUserData(userDoc.data());
                    } else {
                        setError('No such document!');
                    }
                } catch (error) {
                    setError('Error fetching user data.');
                } finally {
                    setLoading(false);
                }
            } else {
                setError('No user is logged in.');
                setLoading(false);
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

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#9D4EDD" />
            </View>
        ); // Show loading spinner until userData is available
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={[globalStyle.textRegular, { color: 'red' }]}>
                    {error}
                </Text>
            </View>
        ); // Show error message if there was an issue
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
                <Text style={[globalStyle.textSemiBold, styles.profileName]}>
                    {userData?.fullName || 'User'}
                </Text>
                <Text style={[globalStyle.textRegular, styles.profileEmail]}>
                    {userData?.email || 'user@example.com'}
                </Text>
            </View>

            {/* Me Tab */}
            <TouchableOpacity
                style={styles.meTab}
                onPress={() => navigation.navigate('MeScreen')}
            >
                <Text style={[globalStyle.textSemiBold, styles.meTabText]}>Me</Text>
                <Text style={[globalStyle.textRegular, styles.meTabDescription]}>
                    Here you can view and update your personal information.
                </Text>
            </TouchableOpacity>

            {/* Profile Options */}
            <View style={styles.profileOptions}>
                <TouchableOpacity
                    style={styles.option}
                    onPress={() =>
                        navigation.navigate('NutrientsIndicator', {
                            weight: userData?.weight || 70,
                            height: userData?.height || 170,
                            age: userData?.age || 25,
                            gender: userData?.gender || 'male',
                            activityLevel: userData?.activityLevel || 'moderate',
                            goal: userData?.goal || 'maintain',
                        })
                    }
                >
                    <Text style={[globalStyle.textRegular, styles.optionText]}>
                        Daily Nutrients Indicator
                    </Text>
                    <View style={styles.optionDetails}>
                        <Ionicons
                            name="restaurant"
                            size={24}
                            color="#9D4EDD"
                            style={styles.optionIcon}
                        />
                        <Text style={[globalStyle.textSemiBold, styles.optionValue]}>
                            {userData?.calorie || 'N/A'} Cal
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.option}>
                    <Text style={[globalStyle.textRegular, styles.optionText]}>
                        Weight Unit
                    </Text>
                    <View style={styles.optionDetails}>
                        <Ionicons
                            name="scale"
                            size={24}
                            color="#9D4EDD"
                            style={styles.optionIcon}
                        />
                        <Text style={[globalStyle.textSemiBold, styles.optionValue]}>
                            {userData?.weightUnit || 'Kilograms'}
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* About Us Button */}
                <TouchableOpacity
                    style={styles.option}
                    onPress={() => navigation.navigate('AboutUs')}
                >
                    <Text style={[globalStyle.textRegular, styles.optionText]}>
                        About Us
                    </Text>
                    <View style={styles.optionDetails}>
                        <Ionicons
                            name="information-circle"
                            size={24}
                            color="#9D4EDD"
                            style={styles.optionIcon}
                        />
                    </View>
                </TouchableOpacity>
            </View>

            {/* Logout */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={[globalStyle.textSemiBold, styles.logoutText]}>Logout</Text>
            </TouchableOpacity>

            {/* App Version */}
            <Text style={[globalStyle.textRegular, styles.versionText]}>
                Version: 0.0.1
            </Text>
        </View>
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
        top: 60,
        left: 16,
        zIndex: 1,
    },
    profileHeader: {
        alignItems: 'center',
		marginTop: 40,
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
        color: '#FFFFFF',
    },
    profileEmail: {
        fontSize: 14,
        color: '#B0B0B0',
    },
    meTab: {
        backgroundColor: '#2E2E2E',
        borderRadius: 10,
        padding: 12,
        marginBottom: 24,
    },
    meTabText: {
        fontSize: 18,
        color: '#9D4EDD',
    },
    meTabDescription: {
        fontSize: 14,
        color: '#B0B0B0',
        marginTop: 8,
    },
    profileOptions: {
        backgroundColor: '#2E2E2E',
        borderRadius: 10,
        padding: 12,
        marginBottom: 24,
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
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
        color: '#9D4EDD',
    },
    logoutButton: {
        backgroundColor: '#9D4EDD',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 16,
    },
    versionText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#B0B0B0',
    },
});

export default ProfileScreen;
