import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import OptionSelector from '../../components/OptionSelector';
import NextButton from '../../components/NextButton';
import BackButton from '../../components/BackButton';

const ActivityScreen = ({ navigation, route }) => {
    const [selectedActivity, setSelectedActivity] = useState(null);

    const activityOptions = ['Sedentary', 'Low Active', 'Active', 'Very Active'];

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <BackButton onPress={() => navigation.goBack()} />

            {/* Title */}
            <Text style={styles.title}>How active are you?</Text>
            <Text style={styles.subtitle}>
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
                        navigation.navigate('Physical', { gender: selectedActivity });
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
        backgroundColor: '#FFF',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        marginTop: 0,
        marginBottom: 20,
    },
    subtitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
    },
});

export default ActivityScreen;