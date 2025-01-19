import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import OptionSelector from '../../components/OptionSelector';
import NextButton from '../../components/NextButton';
import BackButton from '../../components/BackButton';
import { colors } from '../../constants/colors'; // Import colors
import globalStyle from '../../constants/GlobalStyle'; // Import GlobalStyles
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { auth } from '../../config/firebase'; // Import Firebase auth

const db = getFirestore();

const ActivityScreen = ({ navigation }) => {
    const [selectedActivity, setSelectedActivity] = useState(null);

    const activityOptions = ['Sedentary', 'Low Active', 'Active', 'Very Active'];

    const saveActivityLevel = async (activity) => {
        try {
            const userRef = doc(db, 'userInfo', auth.currentUser.uid);
            await updateDoc(userRef, {
                activityLevel: activity, // Save the selected activity level
            });
            console.log("Activity level saved successfully!");
        } catch (error) {
            console.log("Error saving activity level:", error);
        }
    };

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <BackButton onPress={() => navigation.goBack()} />

            {/* Title */}
            <Text style={[globalStyle.textBold, styles.title]}>How active are you?</Text>
            <Text style={[globalStyle.textRegular, styles.subtitle]}>
                A sedentary person burns fewer calories than an active person
            </Text>

            {/* Option Selector */}
            <OptionSelector
                options={activityOptions}
                selectedOption={selectedActivity}
                onSelect={(activity) => setSelectedActivity(activity)}
            />

            {/* Next Button */}
            <NextButton
                onPress={() => {
                    if (selectedActivity) {
                        // Save the activity level before navigating
                        saveActivityLevel(selectedActivity);
                        // Navigate to the next screen
                        navigation.navigate('Physical', { activity: selectedActivity });
                    }
                }}
                disabled={!selectedActivity} // Disable button if no option is selected
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
        backgroundColor: colors.background, // Dark background
    },
    title: {
        fontSize: 30,  // Increased font size for title
        color: colors.text, // White text for title
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: colors.primary,
        marginBottom: 10,
    },
    calculateButton: {
        backgroundColor: colors.primary, // Purple background for the next button
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        marginVertical: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    calculateButtonText: {
        color: colors.text, // White text for next button
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default ActivityScreen;
