import React from 'react';
import { View, StyleSheet } from 'react-native';
import NutrientsIndicator from '../../components/NutrientsIndicator';

const HomeScreen = () => {
    const nutrientsData = {
        proteins: { current: 200, goal: 225 },
        fats: { current: 60, goal: 100 },
        carbs: { current: 340, goal: 340 },
        calories: { current: 500, goal: 3300 },
    };

    return (
        <View style={styles.container}>
            <NutrientsIndicator nutrients={nutrientsData} /> 
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#FFF',
    },
});

export default HomeScreen;
