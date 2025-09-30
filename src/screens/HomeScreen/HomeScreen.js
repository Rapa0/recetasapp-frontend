import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import CustomButton from '../../components/CustomButton';
import Icon from 'react-native-vector-icons/Ionicons';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [recipes, setRecipes] = useState([]);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get('https://recetasapp-backend-production.up.railway.app/api/recipes');
      setRecipes(response.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las recetas');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRecipes();
    }, [])
  );

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Recetas</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Icon name="person-circle-outline" size={36} color="#3B71F3" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('RecipeDetail', { recipeId: item._id })} style={styles.recipeCard}>
            <Image 
              source={{ uri: item.imageUrl || `https://source.unsplash.com/400x300/?food,recipe,${item._id}` }} 
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
        ListEmptyComponent={<Text style={styles.emptyText}>Aún no hay recetas. ¡Crea la primera!</Text>}
      />
      <View style={styles.footer}>
        <CustomButton text="Añadir Nueva Receta" onPress={() => navigation.navigate('AddRecipe')} icon="add-circle-outline" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#F5F5F5',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  list: {
    width: '100%',
  },
  recipeCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: 180,
  },
  recipeContent: {
    padding: 15,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  recipeUser: {
    fontSize: 14,
    color: '#999',
    marginBottom: 10,
  },
  recipeActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: 'gray',
    fontSize: 16,
  },
  footer: {
      padding: 20,
      paddingTop: 10,
  }
});

export default HomeScreen;