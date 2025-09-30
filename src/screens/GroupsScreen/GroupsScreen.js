import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../components/CustomButton';
import Icon from 'react-native-vector-icons/Ionicons';

const GroupsScreen = () => {
  const navigation = useNavigation();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGroups = async () => {
    // Se establece en `true` al inicio de la carga para mostrar el indicador
    setLoading(true); 
    try {
      const userInfoString = await AsyncStorage.getItem('userInfo');
      if (!userInfoString) {
        throw new Error('Token no encontrado');
      }
      const userInfo = JSON.parse(userInfoString);
      
      //      👇 AQUÍ ESTABA EL ERROR. Se cambió la URL a la ruta correcta.
      const response = await axios.get('http://10.0.2.2:5000/api/groups/mygroups', {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setGroups(response.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los grupos');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchGroups();
    }, [])
  );
  
  const onDeleteGroup = (groupId, groupName) => {
    Alert.alert(
      `Borrar "${groupName}"`,
      'ADVERTENCIA: ¿Estás seguro? Todas las recetas asociadas a este grupo serán eliminadas permanentemente.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, Borrar Todo',
          style: 'destructive',
          onPress: async () => {
            try {
              const userInfo = JSON.parse(await AsyncStorage.getItem('userInfo'));
              await axios.delete(`http://10.0.2.2:5000/api/groups/${groupId}`, {
                headers: { Authorization: `Bearer ${userInfo.token}` },
              });
              fetchGroups(); // Recarga la lista de grupos
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el grupo.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Mis Grupos</Text>
      </View>
      <FlatList
        data={groups}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('GroupDetail', { group: item })}>
            <View style={styles.groupItem}>
              <Text style={styles.groupName}>{item.name}</Text>
              <View style={styles.buttons}>
                <TouchableOpacity onPress={() => navigation.navigate('AddEditGroup', { group: item })}>
                  <Icon name="create-outline" size={24} color="#3B71F3" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDeleteGroup(item._id, item.name)} style={styles.deleteButton}>
                  <Icon name="trash-outline" size={24} color="#E53935" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
        style={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>Aún no has creado ningún grupo.</Text>}
      />
      <View style={styles.footer}>
        <CustomButton text="Crear Nuevo Grupo" onPress={() => navigation.navigate('AddEditGroup')} icon="add-circle-outline" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { 
    flex: 1, 
    paddingTop: 10, 
    backgroundColor: '#F5F5F5' 
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: { 
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15, 
    marginBottom: 10,
    paddingTop: 10,
  },
  backButton: {
    padding: 5,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold',
    marginLeft: 10,
  },
  list: { 
    width: '100%' 
  },
  groupItem: { 
    backgroundColor: 'white', 
    padding: 20, 
    marginVertical: 8, 
    marginHorizontal: 20, 
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupName: { 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: 'gray',
    fontSize: 16,
  },
  buttons: {
    flexDirection: 'row',
  },
  deleteButton: {
    marginLeft: 20,
  },
  footer: {
      padding: 20,
  }
});

export default GroupsScreen;