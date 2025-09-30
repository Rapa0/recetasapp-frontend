import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const GroupDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { group } = route.params;

  const [recipes, setRecipes] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchRecipesInGroup = async () => {
        try {
          const userInfoString = await AsyncStorage.getItem('userInfo');
          if (!userInfoString) {
              Alert.alert('Error', 'No se pudo obtener la información del usuario.');
              return;
          }
          const userInfo = JSON.parse(userInfoString);
          const response = await axios.get(`https://recetasapp-backend-production.up.railway.app/api/groups/${group._id}/recipes`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });
          setRecipes(response.data);
        } catch (error) {
          Alert.alert('Error', 'No se pudieron cargar las recetas del grupo');
        }
      };
      fetchRecipesInGroup();
    }, [group._id])
  );
  
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{group.name}</Text>
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
            </View>
          </TouchableOpacity>
        )}
        style={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>Este grupo aún no tiene recetas.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 10, backgroundColor: '#F5F5F5' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginBottom: 10, paddingTop: 10 },
  backButton: { padding: 5 },
  title: { fontSize: 28, fontWeight: 'bold', marginLeft: 10 },
  list: { width: '100%' },
  recipeCard: { backgroundColor: 'white', borderRadius: 10, marginVertical: 8, marginHorizontal: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2, overflow: 'hidden' },
  recipeImage: { width: '100%', height: 180 },
  recipeContent: { padding: 15 },
  recipeTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  recipeUser: { fontSize: 14, color: '#999' },
  emptyText: { textAlign: 'center', marginTop: 50, color: 'gray', fontSize: 16 },
});

export default GroupDetailScreen;