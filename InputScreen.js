import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useUser } from '../UserContext';

const InputScreen = () => {
    const { updateUserData } = useUser();
    const [form, setForm] = useState({
        goal: '',
        gender: '',
        activity: '',
        height: '',
        weight: '',
        age: '',
    });

    const handleSubmit = () => {
        updateUserData({
            goal: form.goal,
            weight: parseFloat(form.weight),
            height: parseFloat(form.height),
            age: parseInt(form.age),
            activity: form.activity,
        });
    };

    return (
        <View style={styles.container}>
            <TextInput placeholder="Goal (gain/lose)" onChangeText={(val) => setForm({ ...form, goal: val })} style={styles.input} />
            <TextInput placeholder="Weight (kg)" keyboardType="numeric" onChangeText={(val) => setForm({ ...form, weight: val })} style={styles.input} />
            <TextInput placeholder="Height (cm)" keyboardType="numeric" onChangeText={(val) => setForm({ ...form, height: val })} style={styles.input} />
            <TextInput placeholder="Age" keyboardType="numeric" onChangeText={(val) => setForm({ ...form, age: val })} style={styles.input} />
            <Button title="Calculate Intake" onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
    },
});

export default InputScreen;
