import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProfileHeader from '../../components/ProfileHeader'; 
import { auth, db } from '../../config/firebase'; 
import { doc, getDoc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore'; 

const GroceriesScreen = () => {
    const [groceryList, setGroceryList] = useState([]); 
    const [newItem, setNewItem] = useState('');
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    useEffect(() => {
        if (userId) {
            const userRef = doc(db, 'userInfo', userId);
            const unsubscribe = onSnapshot(userRef, (snapshot) => {
                if (snapshot.exists()) {
                    setGroceryList(snapshot.data().groceryList || [])
                }
            });
            return () => unsubscribe();
        }
    }, [userId]);

    const fetchGroceryList = async () => {
        if (!userId) return;
        const userRef = doc(db, 'userInfo', userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            setGroceryList(userDoc.data().groceryList || []);
        } else {
            await setDoc(userRef, { groceryList: [] }, { merge: true });
        }
    };

    const addItem = async () => {
        if (newItem.trim() !== '' && userId) {
            const itemExists = groceryList.some(item => item.name.toLowerCase() === newItem.toLowerCase());
            if (itemExists) {
                console.log("This item is already in the grocery list.");
                return;
            }
            const updatedList = [...groceryList, { name: newItem, checked: false }];
            setGroceryList(updatedList);
            const userRef = doc(db, 'userInfo', userId);
            await updateDoc(userRef, {
                groceryList: arrayUnion({ name: newItem, checked: false })
            });
            setNewItem('');
        }
    };

    const toggleItem = async (index) => {
        const updatedList = [...groceryList];
        updatedList[index].checked = !updatedList[index].checked;
        setGroceryList(updatedList);
        const userRef = doc(db, 'userInfo', userId);
        await updateDoc(userRef, { groceryList: updatedList });
    };

    const removeItem = async (index) => {
        const updatedList = groceryList.filter((_, i) => i !== index);
        setGroceryList(updatedList);
        const userRef = doc(db, 'userInfo', userId);
        await updateDoc(userRef, { groceryList: updatedList });
    };

    const clearAllItems = async () => {
        setGroceryList([]);
        const userRef = doc(db, 'userInfo', userId);
        await updateDoc(userRef, { groceryList: [] });
    };

    const renderItem = ({ item, index }) => (
        <View style={styles.listItem}>
            <TouchableOpacity onPress={() => toggleItem(index)}>
                <Ionicons
                    name={item.checked ? "checkbox" : "square-outline"}
                    size={24}
                    color="#BB86FC" // Dark mode accent color
                />
            </TouchableOpacity>
            <Text
                style={[styles.listItemText, item.checked && styles.checkedText]}
            >
                {item.name}
            </Text>
            <TouchableOpacity onPress={() => removeItem(index)}>
                <Ionicons name="close-circle" size={24} color="#BB86FC" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <ProfileHeader />
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
                    placeholderTextColor="#B0B0B0" // Light placeholder text color
                />
            </View>
            <FlatList
                data={groceryList}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E', // Dark background
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
		fontSize: 24,
		fontWeight: 'bold',
		color: '#ffffff',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginHorizontal: 16,
    },
    input: {
        flex: 1,
        backgroundColor: '#333', // Dark background for input
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
        color: '#FFF', // White text
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
        borderBottomColor: '#444', // Darker divider line
        marginHorizontal: 16,
    },
    listItemText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#FFF', // White text for items
    },
    checkedText: {
        textDecorationLine: 'line-through',
        color: '#888', // Lighter color for checked items
    },
    clearAllText: {
        color: '#6A1B9A',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default GroceriesScreen;
