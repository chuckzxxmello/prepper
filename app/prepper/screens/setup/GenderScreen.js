import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import OptionSelector from '../../components/OptionSelector';
import NextButton from '../../components/NextButton';
import BackButton from '../../components/BackButton';

const GenderScreen = ({ navigation}) => {
    const [selectedGender, setSelectedGender] = useState(null);

    const genderOptions = ['Male', 'Female'];

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <BackButton onPress={() => navigation.goBack()} />

            {/* Title */}
            <Text style={styles.title}>What's your gender?</Text>
            <Text style={styles.subtitle}>Male bodies needs more calories</Text>

            {/* Option Selector */}
            <OptionSelector
                options={genderOptions}
                selectedOption={selectedGender}
                onSelect={(gender) => setSelectedGender(gender)}
            />

            {/* Next Button */}
            <NextButton
                onPress={() => {
                    if (selectedGender) {
                        navigation.navigate('Activity', { gender: selectedGender });
                    }
                }}
                disabled={!selectedGender} // Disable button if no option is selected
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

export default GenderScreen;
