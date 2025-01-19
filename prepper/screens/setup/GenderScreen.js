import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import CustomButton from '../../components/CustomButton';
import { auth } from '../../config/firebase';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import OptionSelector from '../../components/OptionSelector';
import globalStyle from '../../constants/GlobalStyle'; // Import global font styles

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
                <Text style={[globalStyle.textBold, styles.header]}>What's Your Gender?</Text>
                <Text style={[globalStyle.textRegular, styles.subtitle]}>Select your biological gender</Text>
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
    header: {
        fontSize: 30,  // Increased font size for prominence
        color: colors.text, // White text for header
        marginBottom: 10,  // Increased margin for more space
    },
    subHeader: {
        marginVertical: 8,
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.textLight, // Lighter text for subheader
    },
    title: {
        fontSize: 28,
        color: colors.primary,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: colors.primary,
        marginBottom: 10,
    },
    buttonContainer: {
        marginTop: 20,
    },
});

export default GenderScreen;
