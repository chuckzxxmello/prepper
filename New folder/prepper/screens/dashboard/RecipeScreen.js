import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import ProfileHeader from '../../components/ProfileHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../constants/colors';

const RecipeScreen = ({ navigation }) => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0); // New state for pagination
    const [hasMore, setHasMore] = useState(true); // Indicates if more recipes are available
    const [loadingMore, setLoadingMore] = useState(false); // Indicates if more recipes are being loaded

    useEffect(() => {
        // Fetch default recipes on initial load
        fetchRecipes(0, true);
    }, []);

    const fetchRecipes = async (pageNumber = 0, isNewSearch = false) => {
        if (loading || loadingMore) return;

        if (isNewSearch) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }

        try {
            const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
                params: {
                    query: query || 'chicken', // Default query if none provided
                    apiKey: 'e5a4006119304baeb4c2751d678cdfac', // Replace with your actual API key
                    number: 10,
                    offset: pageNumber * 10, // Pagination parameter
                    addRecipeInformation: true,
                    addRecipeNutrition: true,
                    instructionsRequired: true,      // Added
                    fillIngredients: true,           // Added
                    sort: 'popularity',
                },
            });
            const newRecipes = response.data.results;

            if (isNewSearch) {
                setRecipes(newRecipes);
            } else {
                setRecipes((prevRecipes) => [...prevRecipes, ...newRecipes]);
            }

            // Update hasMore based on the total results
            const totalResults = response.data.totalResults;
            setHasMore((pageNumber + 1) * 10 < totalResults);
            setPage(pageNumber + 1);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        } finally {
            if (isNewSearch) {
                setLoading(false);
            } else {
                setLoadingMore(false);
            }
        }
    };

    const handleSearch = () => {
        setPage(0);
        setHasMore(true);
        fetchRecipes(0, true);
    };

    const loadMoreRecipes = () => {
        if (hasMore && !loadingMore && !loading) {
            fetchRecipes(page);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
            activeOpacity={0.8}
        >
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
                    <Text style={styles.recipeInfo}>
                        Calories: {item.nutrition?.nutrients.find(n => n.name === 'Calories')?.amount || 'N/A'}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderFooter = () => {
        if (!loadingMore) return null;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={colors.primary} />
            </View>
        );
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
                    onChangeText={(text) => setQuery(text)}
                    onSubmitEditing={handleSearch}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    returnKeyType="search"
                />
            </View>
            {loading && page === 0 ? (
                <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
            ) : (
                <FlatList
                    contentContainerStyle={styles.recipeList}
                    data={recipes}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    ListEmptyComponent={<Text style={styles.emptyText}>No recipes found.</Text>}
                    onEndReached={loadMoreRecipes}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                />
            )}
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
        marginTop: 17,
        marginBottom: 15,
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
        paddingBottom: 20, // Ensure content is not hidden behind the footer
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
    loader: {
        marginTop: 20,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#555',
        fontSize: 16,
    },
    footerLoader: {
        paddingVertical: 20,
    },
});

export default RecipeScreen;