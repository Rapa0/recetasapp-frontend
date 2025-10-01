import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import apiClient from '../../api/axios';
import Icon from 'react-native-vector-icons/Ionicons';

// Componente para el selector de ordenamiento
const SortPicker = ({ selected, onSelect }) => {
  const options = [
    { label: 'Más Recientes', value: 'newest' },
    { label: 'Más Antiguas', value: 'oldest' },
    { label: 'A-Z', value: 'alphabetical' },
  ];

  return (
    <View style={styles.sortContainer}>
      {options.map(option => (
        <TouchableOpacity
          key={option.value}
          style={[styles.sortButton, selected === option.value && styles.sortButtonActive]}
          onPress={() => onSelect(option.value)}
        >
          <Text style={[styles.sortText, selected === option.value && styles.sortTextActive]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const AllRecipesTab = () => {
  const navigation = useNavigation();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('newest');

  useFocusEffect(
    useCallback(() => {
      const fetchRecipes = async () => {
        setLoading(true);
        try {
          const { data } = await apiClient.get('/recipes', {
            params: { sort: sortOrder }
          });
          setRecipes(data);
        } catch (error) {
          Alert.alert('Error', 'No se pudieron cargar las recetas');
        } finally {
          setLoading(false);
        }
      };
      fetchRecipes();
    }, [sortOrder])
  );

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={<SortPicker selected={sortOrder} onSelect={setSortOrder} />}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('RecipeDetail', { recipeId: item._id })} style={styles.recipeCard}>
            <Image 
              source={{ uri: item.imageUrl || `https://source.unsplash.com/400x300/?food,recipe,${item.title}` }} 
              style={styles.recipeImage} 
            />
            <View style={styles.recipeContent}>
              <Text style={styles.recipeTitle}>{item.title}</Text>
              <Text style={styles.recipeUser}>Por: {item.user?.username || 'Usuario Eliminado'}</Text>
              <View style={styles.recipeActions}>
                <Icon name="heart" size={18} color="#FF6347" />
                <Text style={styles.likeCount}>{item.likes.length}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        style={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>Aún no hay recetas publicadas.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sortButtonActive: {
    backgroundColor: '#3B71F3',
    borderColor: '#3B71F3',
  },
  sortText: {
    color: '#555',
  },
  sortTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  list: { width: '100%' },
  recipeCard: { backgroundColor: 'white', borderRadius: 10, marginVertical: 8, marginHorizontal: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2, overflow: 'hidden' },
  recipeImage: { width: '100%', height: 180 },
  recipeContent: { padding: 15 },
  recipeTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  recipeUser: { fontSize: 14, color: '#999', marginBottom: 10 },
  recipeActions: { flexDirection: 'row', alignItems: 'center' },
  likeCount: { marginLeft: 5, fontSize: 14, color: '#666' },
  emptyText: { textAlign: 'center', marginTop: 50, color: 'gray', fontSize: 16 },
});

export default AllRecipesTab;