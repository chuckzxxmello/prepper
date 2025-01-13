import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import CustomButton from '../../components/CustomButton';
import { auth } from '../../config/firebase';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import OptionSelector from '../../components/OptionSelector';

const db = getFirestore();

const GenderScreen = ({ navigation, route }) => {
    const [selectedGender, setSelectedGender] = useState(null);
    const genders = ['male', 'female'];

    const handleContinue = async () => {
        try {
            const userRef = doc(db, 'userInfo', auth.currentUser.uid);
            await updateDoc(userRef, {
                gender: selectedGender
            });

            navigation.navigate('Activity', { 
                ...route.params, 
                gender: selectedGender 
            });
        } catch (error) {
            console.log('Error saving gender:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>What's Your Gender?</Text>
                <Text style={styles.subtitle}>Select your biological gender</Text>
            </View>

            <OptionSelector
                options={genders}
                selectedOption={selectedGender}
                onSelect={setSelectedGender}
            />

            <View style={styles.buttonContainer}>
                <CustomButton
                    title="Continue"
                    onPress={handleContinue}
                    type="primary"
                    disabled={!selectedGender}
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

export default GenderScreen;
