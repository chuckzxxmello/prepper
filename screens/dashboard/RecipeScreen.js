import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import ProfileHeader from '../../components/ProfileHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../constants/colors';

const RecipeScreen = () => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [recipes, setRecipes] = useState([]);

    const searchRecipes = async () => {
        try {
            const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
                params: {
                    query,
                    apiKey: 'e5a4006119304baeb4c2751d678cdfac',
                    number: 10,
                    addRecipeInformation: true,
                    addRecipeNutrition: true,
                    sort: 'popularity', // Sort by popularity to get the most common or relevant recipes
                },
            });
            setRecipes(response.data.results);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    };

    return (
        <View style={styles.container}>
            <ProfileHeader />
            <View style={[styles.searchContainer, isFocused && styles.searchContainerFocused]}>
                <Icon name="search" size={20} color={isFocused ? colors.primary : '#555'} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for recipes..."
                    value={query}
                    onChangeText={setQuery}
                    onSubmitEditing={searchRecipes}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
            </View>
            <FlatList
                contentContainerStyle={styles.recipeList}
                data={recipes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.recipeCard}>
                        <Image source={{ uri: item.image }} style={styles.recipeImage} />
                        <View style={styles.recipeDetails}>
                            <View style={styles.recipeHeader}>
                                <Text style={styles.recipeTitle}>{item.title}</Text>
                                <View style={styles.recipeTimeContainer}>
                                    <Icon name="access-time" size={14} color="#555" />
                                    <Text style={styles.recipeTime}>{item.readyInMinutes} mins</Text>
                                </View>
                            </View>
                            <Text style={styles.recipeInfo}>Calories: {item.nutrition?.nutrients.find(n => n.name === 'Calories')?.amount || 'N/A'}</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        marginHorizontal: 20,
        marginTop: 5,
        marginBottom: 22,
        paddingLeft: 8,
        backgroundColor: '#fff',
    },
    searchContainerFocused: {
        borderColor: colors.primary,
        borderWidth: 2,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
    },
    recipeList: {
        paddingHorizontal: 20,
    },
    recipeCard: {
        marginVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden',
    },
    recipeImage: {
        width: '100%',
        height: 150,
    },
    recipeDetails: {
        padding: 10,
    },
    recipeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    recipeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
        flexWrap: 'wrap',
        maxWidth: '70%', // Ensure the title doesn't overlap with the time
    },
    recipeTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    recipeTime: {
        fontSize: 14,
        color: '#555',
        marginLeft: 5,
    },
    recipeInfo: {
        fontSize: 14,
        color: '#555',
        marginTop: 5,
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

export default RecipeScreen;