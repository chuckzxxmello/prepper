import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { auth, db } from '../config/firebase'; // Ensure the path is correct based on your project structure
import { doc, getDoc } from 'firebase/firestore';

const ProfileHeader = () => {
    const [userData, setUserData] = useState(null);

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
            <Image
                source={
                    userData?.profilePic
                        ? { uri: userData.profilePic }
                        : require('../assets/default-profile.png')
                }
                style={styles.profilePic}
            />
            <Text style={styles.userName}>{userData?.fullName || 'User'}</Text>
        </View>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        paddingTop: 30,
        backgroundColor: '#fff',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginTop: 0, // Adjust this value to position the header lower
        marginHorizontal: 0, // Optional: Adds horizontal padding
        borderRadius: 15, // Optional: Rounds the corners of the header
    },
    profilePic: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    userName: {
        marginLeft: 15,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333', // Optional: Sets the text color
    },
});

export default ProfileHeader;