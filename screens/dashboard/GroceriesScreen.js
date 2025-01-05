import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProfileHeader from '../../components/ProfileHeader'; 
import { auth, db } from '../../config/firebase'; 
import { doc, getDoc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore'; 

const GroceriesScreen = () => {
    // Manage the grocery list state locally
    const [groceryList, setGroceryList] = useState([]); 
    const [newItem, setNewItem] = useState(''); // Manage new item input state
    const userId = auth.currentUser ? auth.currentUser.uid : null; // Get the current user's ID

    // UseEffect to fetch the grocery list when userId changes
    useEffect(() => {
        if (userId) {
            const userRef = doc(db, 'userInfo', userId);
            const unsubscribe = onSnapshot(userRef, (snapshot) => {
                if (snapshot.exists()) {
                    setGroceryList(snapshot.data().groceryList || [])
                }
            });
            return () => unsubscribe(); // Cleanup listener on unmount
        }
    }, [userId]);
    

    // Fetch the grocery list from Firestore
    const fetchGroceryList = async () => {
        if (!userId) return; // Early return if no userId
        const userRef = doc(db, 'userInfo', userId); // Reference Firestore document
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            setGroceryList(userDoc.data().groceryList || []); // Set state from Firestore data
        } else {
            // Create a document with an empty grocery list if it doesn't exist
            await setDoc(userRef, { groceryList: [] }, { merge: true });
        }
    };

    // Add a new item to the grocery list
    const addItem = async () => {
        if (newItem.trim() !== '' && userId) { // Validate input and userId
            const itemExists = groceryList.some(item => item.name.toLowerCase() === newItem.toLowerCase());
            if (itemExists) {
                console.log("This item is already in the grocery list."); // Prevent duplicate entries
                return;
            }
            const updatedList = [...groceryList, { name: newItem, checked: false }];
            setGroceryList(updatedList); // Update local state
            const userRef = doc(db, 'userInfo', userId); // Update Firestore
            await updateDoc(userRef, {
                groceryList: arrayUnion({ name: newItem, checked: false })
            });
            setNewItem(''); // Clear input field
        }
    };

    // Toggle the checked status of an item
    const toggleItem = async (index) => {
        const updatedList = [...groceryList];
        updatedList[index].checked = !updatedList[index].checked; // Toggle local state
        setGroceryList(updatedList);
        const userRef = doc(db, 'userInfo', userId); // Sync with Firestore
        await updateDoc(userRef, { groceryList: updatedList });
    };

    // Remove an item from the grocery list
    const removeItem = async (index) => {
        const updatedList = groceryList.filter((_, i) => i !== index); // Filter out the item
        setGroceryList(updatedList); 
        const userRef = doc(db, 'userInfo', userId); // Update Firestore
        await updateDoc(userRef, { groceryList: updatedList });
    };

    // Clear all items from the grocery list
    const clearAllItems = async () => {
        setGroceryList([]); // Clear local state
        const userRef = doc(db, 'userInfo', userId); // Clear Firestore
        await updateDoc(userRef, { groceryList: [] });
    };

    // Render individual grocery list items
    const renderItem = ({ item, index }) => (
        <View style={styles.listItem}>
            <TouchableOpacity onPress={() => toggleItem(index)}>
                <Ionicons
                    name={item.checked ? "checkbox" : "square-outline"}
                    size={24}
                    color="#000"
                />
            </TouchableOpacity>
            <Text
                style={[styles.listItemText, item.checked && styles.checkedText]} // Style for checked items
            >
                {item.name}
            </Text>
            <TouchableOpacity onPress={() => removeItem(index)}>
                <Ionicons name="close-circle" size={24} color="#000" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <ProfileHeader /> {/* Header component */}
            <View style={styles.listHeaderContainer}>
                <Text style={styles.subtitle}>Grocery List</Text>
                <TouchableOpacity onPress={clearAllItems}>
                    <Text style={styles.clearAllText}>Clear All</Text>
                </TouchableOpacity>
            </View>
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
            <FlatList
                data={groceryList}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()} // Use index as key
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
