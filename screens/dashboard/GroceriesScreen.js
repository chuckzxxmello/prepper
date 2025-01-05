import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProfileHeader from '../../components/ProfileHeader';
import { auth, db } from '../../config/firebase';
import { doc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore';

const GroceriesScreen = () => {
    // State to manage the grocery list
    const [groceryList, setGroceryList] = useState([]);
    // State to manage the input for a new grocery item
    const [newItem, setNewItem] = useState('');
    // Retrieve the current user's ID from Firebase Auth
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    // Fetch the grocery list from Firestore and set up a real-time listener
    useEffect(() => {
        if (userId) {
            const userRef = doc(db, 'userInfo', userId);
            // Real-time listener to keep grocery list in sync with Firestore
            const unsubscribe = onSnapshot(userRef, (snapshot) => {
                if (snapshot.exists()) {
                    setGroceryList(snapshot.data().groceryList || []);
                }
            });
            return () => unsubscribe(); // Cleanup the listener when the component unmounts
        }
    }, [userId]);

    // Add a new item to the grocery list
    const addItem = async () => {
        if (newItem.trim() !== '' && userId) {
            // Check if the item already exists in the list
            const itemExists = groceryList.some(
                (item) => item.name.toLowerCase() === newItem.toLowerCase()
            );
            if (itemExists) {
                console.log('This item is already in the grocery list.');
                return;
            }
            // Update the local state and Firestore
            const updatedList = [...groceryList, { name: newItem, checked: false }];
            setGroceryList(updatedList);
            const userRef = doc(db, 'userInfo', userId);
            await updateDoc(userRef, {
                groceryList: arrayUnion({ name: newItem, checked: false }),
            });
            setNewItem(''); // Clear the input field after adding
        }
    };

    // Toggle the checked status of an item
    const toggleItem = async (index) => {
        const updatedList = [...groceryList];
        // Toggle the `checked` property
        updatedList[index].checked = !updatedList[index].checked;
        setGroceryList(updatedList); // Update local state
        const userRef = doc(db, 'userInfo', userId);
        await updateDoc(userRef, { groceryList: updatedList }); // Sync with Firestore
    };

    // Remove an item from the grocery list
    const removeItem = async (index) => {
        const updatedList = groceryList.filter((_, i) => i !== index); // Filter out the item
        setGroceryList(updatedList);
        const userRef = doc(db, 'userInfo', userId);
        await updateDoc(userRef, { groceryList: updatedList });
    };

    // Clear all items from the grocery list
    const clearAllItems = async () => {
        setGroceryList([]); // Clear the local state
        const userRef = doc(db, 'userInfo', userId);
        await updateDoc(userRef, { groceryList: [] }); // Clear the list in Firestore
    };

    // Render a single grocery list item
    const renderItem = ({ item, index }) => (
        <View style={styles.listItem}>
            {/* Checkbox to toggle the checked status */}
            <TouchableOpacity onPress={() => toggleItem(index)}>
                <Ionicons
                    name={item.checked ? 'checkbox' : 'square-outline'}
                    size={24}
                    color="#000"
                />
            </TouchableOpacity>
            {/* Display the item name */}
            <Text
                style={[styles.listItemText, item.checked && styles.checkedText]}
                numberOfLines={1} // Truncate if text is too long
            >
                {item.name || ''}
            </Text>
            {/* Button to remove the item */}
            <TouchableOpacity onPress={() => removeItem(index)}>
                <Ionicons name="close-circle" size={24} color="#000" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Profile header component */}
            <ProfileHeader />
            {/* Header section with "Clear All" button */}
            <View style={styles.listHeaderContainer}>
                <Text style={styles.subtitle}>Grocery List</Text>
                <TouchableOpacity onPress={clearAllItems}>
                    <Text style={styles.clearAllText}>Clear All</Text>
                </TouchableOpacity>
            </View>
            {/* Input section to add new items */}
            <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.addButton} onPress={addItem}>
                    <Ionicons name="add-circle" size={28} color="#6A1B9A" />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder="Add to list"
                    value={newItem}
                    onChangeText={setNewItem}
                />
            </View>
            {/* Display the grocery list */}
            <FlatList
                data={groceryList}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item.name}-${index}`} // Ensure unique keys
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    listHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
        marginHorizontal: 16,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginHorizontal: 16,
    },
    input: {
        flex: 1,
        backgroundColor: '#F0F0F0',
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
    },
    addButton: {
        padding: 5,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        marginHorizontal: 16,
    },
    listItemText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#000',
    },
    checkedText: {
        textDecorationLine: 'line-through',
        color: '#888',
    },
    clearAllText: {
        color: '#6A1B9A',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default GroceriesScreen;
