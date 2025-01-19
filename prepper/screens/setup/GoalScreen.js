import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { auth } from '../../config/firebase';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { colors } from '../../constants/colors';
import CustomButton from '../../components/CustomButton';
import OptionSelector from '../../components/OptionSelector';
import globalStyle from '../../constants/GlobalStyle'; // Import global font styles

const db = getFirestore();

const GoalScreen = ({ navigation }) => {
    const [selectedGoal, setSelectedGoal] = useState(null);
    const goals = ['Lose Weight', 'Maintain Weight', 'Gain Weight'];

    const handleContinue = async () => {
        try {
            const userRef = doc(db, 'userInfo', auth.currentUser.uid);
            let goalValue;
            if (selectedGoal === 'Lose Weight') goalValue = 'lose';
            else if (selectedGoal === 'Maintain Weight') goalValue = 'maintain';
            else if (selectedGoal === 'Gain Weight') goalValue = 'gain';

            await updateDoc(userRef, {
                goal: goalValue
            });

            navigation.navigate('Gender', { goal: goalValue });
        } catch (error) {
            console.log('Error saving goal:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={[globalStyle.textBold, styles.header]}>What is your goal?</Text>
				 <Text style={[globalStyle.textRegular, styles.subtitle]}>Select your weight goal</Text>
            </View>
            <OptionSelector
                options={goals}
                selectedOption={selectedGoal}
                onSelect={setSelectedGoal}
            />
            <CustomButton
                onPress={handleContinue}
                title="Continue"
                buttonStyle={styles.calculateButton}
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
    headerContainer: {
        marginTop: 60,
        marginBottom: 40,
    },
    header: {
        fontSize: 30,  // Increased font size for prominence
        color: colors.text, // White text for header
        marginBottom: 10,  // Increased margin for more space
    },
    subHeader: {
        fontSize: 28,
        color: colors.primary,
        marginBottom: 10,
    },
	subtitle: {
        fontSize: 18,
        color: colors.primary,
        marginBottom: 10,
    },
    input: {
        height: 45,
        borderColor: colors.primary,
        borderWidth: 1,
        marginBottom: 12,
        paddingLeft: 10,
        backgroundColor: '#2d2d2d',
        color: colors.text,
        borderRadius: 10,
    },
    activityLevelButton: {
        backgroundColor: colors.secondary,
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderRadius: 10,
        marginBottom: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    selectedActivityLevelButton: {
        backgroundColor: colors.primary, // Purple background for selected option
    },
    activityLevelText: {
        color: colors.text,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    selectedActivityLevelText: {
        color: colors.text, // White text for selected activity level
    },
    calculateButton: {
        backgroundColor: colors.primary, // Purple background for the continue button
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
        color: colors.text, // White text for calculate button
        fontWeight: 'bold',
        fontSize: 18,
    },
    result: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 16,
        color: colors.text,
    },
});

export default GoalScreen;
