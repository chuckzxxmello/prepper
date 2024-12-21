import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import CustomButton from '../../components/CustomButton';
import { auth } from '../../config/firebase';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import OptionSelector from '../../components/OptionSelector';

const db = getFirestore();

const GoalScreen = ({ navigation }) => {
    const [selectedGoal, setSelectedGoal] = useState(null);
    const goals = ['lose', 'maintain', 'gain'];

    const handleContinue = async () => {
        try {
            // Save goal to Firestore
            const userRef = doc(db, 'userInfo', auth.currentUser.uid);
            await updateDoc(userRef, {
                goal: selectedGoal
            });

            navigation.navigate('Gender', { goal: selectedGoal });
        } catch (error) {
            console.log('Error saving goal:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>What's Your Goal?</Text>
                <Text style={styles.subtitle}>Select your fitness goal</Text>
            </View>

            <OptionSelector
                options={goals}
                selectedOption={selectedGoal}
                onSelect={setSelectedGoal}
            />

            <View style={styles.buttonContainer}>
                <CustomButton
                    title="Continue"
                    onPress={handleContinue}
                    type="primary"
                    disabled={!selectedGoal}
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

export default GoalScreen;
