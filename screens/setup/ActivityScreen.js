import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import CustomButton from '../../components/CustomButton';
import { auth } from '../../config/firebase';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import OptionSelector from '../../components/OptionSelector';

const db = getFirestore();

const ActivityScreen = ({ navigation, route }) => {
    const [selectedActivity, setSelectedActivity] = useState(null);
    const activityLevels = ['sedentary', 'light', 'moderate', 'active', 'veryActive'];

    const handleContinue = async () => {
        try {
            const userRef = doc(db, 'userInfo', auth.currentUser.uid);
            await updateDoc(userRef, {
                activityLevel: selectedActivity
            });

            navigation.navigate('Physical', { 
                ...route.params, 
                activityLevel: selectedActivity 
            });
        } catch (error) {
            console.log('Error saving activity level:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Activity Level</Text>
                <Text style={styles.subtitle}>Select your typical activity level</Text>
            </View>

            <OptionSelector
                options={activityLevels}
                selectedOption={selectedActivity}
                onSelect={setSelectedActivity}
            />

            <View style={styles.buttonContainer}>
                <CustomButton
                    title="Continue"
                    onPress={handleContinue}
                    type="primary"
                    disabled={!selectedActivity}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
    },
    headerContainer: {
        marginTop: 60,
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: colors.text,
    },
    buttonContainer: {
        marginTop: 20,
    },
});

export default ActivityScreen;
