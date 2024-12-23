import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { auth } from '../../config/firebase';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { colors } from '../../constants/colors';
import CustomButton from '../../components/CustomButton';
import OptionSelector from '../../components/OptionSelector';

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
            <Text style={styles.title}>What is your goal?</Text>
            <OptionSelector
                options={goals}
                selectedOption={selectedGoal}
                onSelect={setSelectedGoal}
            />
            <CustomButton
                onPress={handleContinue}
                title="Continue"
                buttonStyle={styles.continueButton}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 40,
        justifyContent: 'flex-start',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 24,
        textAlign: 'center',
    },
    continueButton: {
        marginTop: 20,
        backgroundColor: colors.primary,
    },
});

export default GoalScreen;