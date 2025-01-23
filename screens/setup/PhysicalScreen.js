import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors'; // Import colors
import CustomButton from '../../components/CustomButton';
import { auth } from '../../config/firebase';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import globalStyle from '../../constants/GlobalStyle'; // Import GlobalStyles

const db = getFirestore();

const PhysicalScreen = ({ navigation, route }) => {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [age, setAge] = useState('');

    const handleContinue = async () => {
        try {
            const userRef = doc(db, 'userInfo', auth.currentUser.uid);
            await updateDoc(userRef, {
                weight: parseFloat(weight),
                height: parseFloat(height),
                age: parseFloat(age)
            });

            navigation.navigate('MacroResult', {
                ...route.params,
                weight: parseFloat(weight),
                height: parseFloat(height),
                age: parseFloat(age)
            });
        } catch (error) {
            console.log('Error saving physical details:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={[globalStyle.textBold, styles.title]}>Physical Details</Text>
                <Text style={[globalStyle.textRegular, styles.subtitle]}>Enter your measurements</Text>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Weight (kg)"
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="decimal-pad"
                    placeholderTextColor={colors.textLight}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Height (cm)"
                    value={height}
                    onChangeText={setHeight}
                    keyboardType="decimal-pad"
                    placeholderTextColor={colors.textLight}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Age"
                    value={age}
                    onChangeText={setAge}
                    keyboardType="decimal-pad"
                    placeholderTextColor={colors.textLight}
                />
            </View>

            <View style={styles.buttonContainer}>
                <CustomButton
                    title="Continue"
                    onPress={handleContinue}
                    type="primary"
                    disabled={!weight || !height || !age}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background, // Dark background from colors.js
        padding: 20,
    },
    headerContainer: {
        marginTop: 60,
        marginBottom: 40,
    },
    title: {
        fontSize: 30,  // Increased font size for prominence
        color: colors.text, // White text for header
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: colors.primary,
        marginBottom: 10,
    },
    inputContainer: {
        flex: 1,
        gap: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.secondary,
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        color: colors.text, // Text color for input fields from colors.js
        backgroundColor: colors.inputBackground, // Dark background for inputs from colors.js
    },
    buttonContainer: {
        marginTop: 20,
    },
});

export default PhysicalScreen;
