import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../components/CustomButton';
import Icon from 'react-native-vector-icons/Ionicons';
import AssignGroupsModal from '../../components/AssignGroupsModal';

const RecipeDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { recipeId } = route.params;

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isGroupModalVisible, setGroupModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadRecipeData = async () => {
        setLoading(true);
        try {
          const info = await AsyncStorage.getItem('userInfo');
          if (info) setUserInfo(JSON.parse(info));
          
          const recipeRes = await axios.get(`recetasapp-backend-production.up.railway.app/api/recipes/${recipeId}`);
          setRecipe(recipeRes.data);
          setLikeCount(recipeRes.data.likes.length);

          if (info) {
              const currentUserId = JSON.parse(info)._id;
              const liked = recipeRes.data.likes.some(id => id === currentUserId);
              setIsLiked(liked);
          }
        } catch (error) {
          Alert.alert('Error', 'No se pudo cargar la receta');
          navigation.goBack();
        } finally {
          setLoading(false);
        }
      };
      loadRecipeData();
      return () => {};
    }, [recipeId, navigation])
  );

  const onLikePressed = async () => {
    try {
        const token = userInfo?.token;
        if (!token) {
            return Alert.alert('Error', 'Debes iniciar sesión para dar Me Gusta.');
        }
        const response = await axios.post(`recetasapp-backend-production.up.railway.app/api/recipes/${recipeId}/like`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setIsLiked(!isLiked);
        setLikeCount(response.data.likes.length);
    } catch (error) {
        Alert.alert('Error', 'Ocurrió un error al dar Me Gusta.');
    }
  };
  
  const onDeletePressed = () => {
    Alert.alert(
      'Confirmar Borrado',
      '¿Estás seguro de que quieres eliminar esta receta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = userInfo?.token;
              await axios.delete(`recetasapp-backend-production.up.railway.app/api/recipes/${recipeId}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              Alert.alert('Éxito', 'Receta eliminada.');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la receta.');
            }
          },
        },
      ]
    );
  };
  
  const refreshData = async () => {
    try {
        const recipeRes = await axios.get(`recetasapp-backend-production.up.railway.app/api/recipes/${recipeId}`);
        setRecipe(recipeRes.data);
    } catch (error) {
        console.error("No se pudo refrescar la receta", error);
    }
  };

  const handleUpdateGroups = async (newGroupIds) => {
    try {
      const token = userInfo?.token;
      if (!token) { return Alert.alert('Error', 'Debes iniciar sesión.'); }

      const originalGroupIds = recipe.groups.map(g => typeof g === 'object' ? g._id : g);

      const groupsToAdd = newGroupIds.filter(id => !originalGroupIds.includes(id));
      const groupsToRemove = originalGroupIds.filter(id => !newGroupIds.includes(id));
      
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const addPromises = groupsToAdd.map(groupId =>
        axios.post(`recetasapp-backend-production.up.railway.app/api/groups/${groupId}/addRecipe`, { recipeId }, config)
      );
      
      const removePromises = groupsToRemove.map(groupId =>
        axios.post(`recetasapp-backend-production.up.railway.app/api/groups/${groupId}/removeRecipe`, { recipeId }, config)
      );

      await Promise.all([...addPromises, ...removePromises]);

      setGroupModalVisible(false);
      refreshData(); 

    } catch (error) {
      Alert.alert('Error', 'No se pudieron actualizar los grupos. Verifica que seas el dueño de los grupos seleccionados.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }
  if (!recipe) {
    return <View style={styles.container}><Text>Receta no encontrada.</Text></View>;
  }

  const isAuthor = userInfo?._id === recipe.user?._id;

  return (
    <>
      <ScrollView style={styles.container}>
        <Image 
          source={{uri: recipe.imageUrl || `https://source.unsplash.com/random/400x300/?food,${recipe.title.replace(/\s/g, ',')}`}} 
          style={styles.image} 
        />
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{recipe.title}</Text>
          <View style={styles.authorContainer}>
            <Icon name="person-circle-outline" size={24} color="#555" />
            <Text style={styles.author}>Por: {recipe.user?.username || 'Usuario Eliminado'}</Text>
          </View>
        </View>
        <Text style={styles.description}>{recipe.description}</Text>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={onLikePressed}>
              <Icon name={isLiked ? "heart" : "heart-outline"} size={28} color="#FF6347" />
              <Text style={styles.actionText}>{likeCount} Me Gusta</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => setGroupModalVisible(true)}>
              <Icon name="folder-open-outline" size={28} color="#4CAF50" />
              <Text style={styles.actionText}>Grupos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.subtitle}>Ingredientes</Text>
          {recipe.ingredients.map((ingredient, index) => (
            <Text key={index} style={styles.listItem}>• {ingredient}</Text>
          ))}
        </View>
        <View style={styles.card}>
          <Text style={styles.subtitle}>Instrucciones</Text>
          <Text style={styles.instructions}>{recipe.instructions}</Text>
        </View>
        
        {isAuthor && (
          <View style={styles.buttonContainer}>
            <CustomButton 
              text="Editar" 
              onPress={() => navigation.navigate('EditRecipe', { recipeId: recipe._id })} 
              type="SECONDARY" 
              icon="create-outline"
            />
            <CustomButton 
              text="Eliminar" 
              onPress={onDeletePressed} 
              bgColor="#E53935" 
              icon="trash-outline"
            />
          </View>
        )}
      </ScrollView>

      {recipe && (
        <AssignGroupsModal 
            recipe={recipe}
            isVisible={isGroupModalVisible}
            onClose={() => setGroupModalVisible(false)}
            onSave={handleUpdateGroups}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    image: { width: '100%', height: 250 },
    headerContainer: { padding: 20, paddingBottom: 10 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
    authorContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    author: { fontSize: 16, color: '#555', marginLeft: 8 },
    description: { fontSize: 16, color: '#666', paddingHorizontal: 20, fontStyle: 'italic' },
    actionsContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 15, marginHorizontal: 20, marginTop: 20, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#eee' },
    actionButton: { alignItems: 'center' },
    actionText: { marginTop: 4, fontSize: 12, color: '#555' },
    card: { backgroundColor: '#f9f9f9', borderRadius: 8, padding: 20, marginHorizontal: 20, marginTop: 20, elevation: 1, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.1, shadowRadius: 2 },
    subtitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: '#333' },
    listItem: { fontSize: 16, lineHeight: 26 },
    instructions: { fontSize: 16, lineHeight: 26 },
    buttonContainer: { padding: 20 }
});

export default RecipeDetailScreen;