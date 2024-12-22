import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { auth, db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const ProfileHeader = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (auth.currentUser) {
                const userDoc = await getDoc(doc(db, 'userInfo', auth.currentUser.uid));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                }
            }
        };
        fetchUserData();
    }, []);

    return (
        <View style={styles.headerContainer}>
            <Image
                source={userData?.profilePic ? { uri: userData.profilePic } : require('../assets/default-profile.png')}
                style={styles.profilePic}
            />
            <Text style={styles.userName}>{userData?.fullName || 'User'}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    profilePic: {
        width: 60,
        height: 60,
        borderRadius: 20,
        marginRight: 10,
    },
    userName: {
        fontSize: 21,
        fontWeight: '600',
        color: '#333333',
    },
});

export default ProfileHeader;
