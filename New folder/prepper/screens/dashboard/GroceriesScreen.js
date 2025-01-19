import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProfileHeader from '../../components/ProfileHeader';

const GroceriesScreen = () => {
    return (
        <View style={styles.container}>
            <ProfileHeader />
            <View style={styles.content}>
                <Text style={styles.title}>Groceries</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default GroceriesScreen;
