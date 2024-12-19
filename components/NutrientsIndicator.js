import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper'; // Ensure you use react-native-paper

const NutrientsIndicator = ({ nutrients }) => {
    const { proteins, fats, carbs, calories } = nutrients;

    // Helper function to calculate progress (rounded to 2 decimal places)
    const getProgress = (current, goal) => {
        if (!goal || goal === 0) return 0; // Avoid division by zero
        return Math.min(current / goal, 1).toFixed(2); // Limit to 1 and 2 decimals
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nutrients Indicator</Text>

            {/* Proteins */}
            <View style={styles.row}>
                <Text style={styles.label}>Proteins</Text>
                <Text style={styles.value}>{proteins.current} / {proteins.goal}</Text>
                <ProgressBar
                    progress={parseFloat(getProgress(proteins.current, proteins.goal))}
                    color="#FF6B6B"
                    style={styles.progressBar}
                />
            </View>

            {/* Fats */}
            <View style={styles.row}>
                <Text style={styles.label}>Fats</Text>
                <Text style={styles.value}>{fats.current} / {fats.goal}</Text>
                <ProgressBar
                    progress={parseFloat(getProgress(fats.current, fats.goal))}
                    color="#FFA94D"
                    style={styles.progressBar}
                />
            </View>

            {/* Carbs */}
            <View style={styles.row}>
                <Text style={styles.label}>Carbs</Text>
                <Text style={styles.value}>{carbs.current} / {carbs.goal}</Text>
                <ProgressBar
                    progress={parseFloat(getProgress(carbs.current, carbs.goal))}
                    color="#63E6BE"
                    style={styles.progressBar}
                />
            </View>

            {/* Calories */}
            <View style={styles.row}>
                <Text style={styles.label}>Calories</Text>
                <Text style={styles.value}>{calories.current} / {calories.goal}</Text>
                <ProgressBar
                    progress={parseFloat(getProgress(calories.current, calories.goal))}
                    color="#38D9A9"
                    style={styles.progressBar}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F8F9FA',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    row: {
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        color: '#6C757D',
    },
    value: {
        fontSize: 12,
        textAlign: 'right',
        marginBottom: 4,
        color: '#495057',
    },
    progressBar: {
        height: 6,
        borderRadius: 5,
    },
});

export default NutrientsIndicator;
