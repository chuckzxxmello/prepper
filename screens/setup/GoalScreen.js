import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import OptionSelector from '../../components/OptionSelector';
import NextButton from '../../components/NextButton';
import { useUser } from '../../context/UserContext';

const GoalScreen = ({ navigation }) => {
    const [selectedGoal, setSelectedGoal] = useState(null); // State to track selected goal
    const { updateUserData } = useUser(); // Access updateUserData function

    const goalOptions = ['Lose weight', 'Keep weight', 'Gain weight'];

    return (
        <View style={styles.container}>
            {/* Title and Subtitle */}
            <View style={styles.header}>
                <Text style={styles.title}>What's your goal?</Text>
                <Text style={styles.subtitle}>
                    We will calculate daily calories according to your goal
                </Text>
            </View>

            {/* Goal Options */}
            <OptionSelector
                options={goalOptions}
                selectedOption={selectedGoal}
                onSelect={(goal) => setSelectedGoal(goal)}
            />

            {/* Next Button */}
            <NextButton
                onPress={() => {
                    if (selectedGoal) {
                        updateUserData({ goal: selectedGoal }); // Save to UserContext
                        navigation.navigate('Gender'); // Move to next screen
                    }
                }}
                disabled={!selectedGoal} // Disable button if no option is selected
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
    },
    header: {
        marginTop: 70,
        alignItems: 'center',
    },
    title: {
        fontFamily: 'Poppins-Bold',
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
    },
});

export default GoalScreen;
