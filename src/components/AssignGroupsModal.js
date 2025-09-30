import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Modal, FlatList, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from './CustomButton';
import CustomInput from './CustomInput';
import Icon from 'react-native-vector-icons/Ionicons';

const AssignGroupsModal = ({ recipe, isVisible, onClose, onSave }) => {
  const [userGroups, setUserGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');

  const fetchGroups = useCallback(async () => {
    try {
      const userInfoString = await AsyncStorage.getItem('userInfo');
      if (!userInfoString) {
          Alert.alert('Error', 'No se pudo obtener la información del usuario.');
          return;
      }
      const userInfo = JSON.parse(userInfoString);
      
      // --- CAMBIO PRINCIPAL ---
      // Se cambió la URL para que solo traiga los grupos del usuario actual
      const response = await axios.get('http://10.0.2.2:5000/api/groups/mygroups', {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setUserGroups(response.data);

      if (recipe) {
        // --- MEJORA DE ROBUSTEZ ---
        // Nos aseguramos de que solo se usen los IDs de los grupos,
        // ya que `recipe.groups` podría contener objetos completos.
        const initialGroupIds = recipe.groups ? recipe.groups.map(g => g._id || g) : [];
        setSelectedGroups(initialGroupIds);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los grupos');
    }
  }, [recipe]);

  useEffect(() => {
    if (isVisible) {
      fetchGroups();
    }
  }, [isVisible, fetchGroups]);

  const handleSelectGroup = (groupId) => {
    setSelectedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId) 
        : [...prev, groupId]
    );
  };

  const handleSaveChanges = () => {
    onSave(selectedGroups);
  };

  const handleCreateGroup = async () => {
    if (!newGroupName) {
        Alert.alert('Error', 'El nombre no puede estar vacío.');
        return;
    }
    try {
      const userInfoString = await AsyncStorage.getItem('userInfo');
      if (!userInfoString) {
        Alert.alert('Error', 'Debes iniciar sesión para crear un grupo.');
        return;
      }
      const userInfo = JSON.parse(userInfoString);
      await axios.post(
        'http://10.0.2.2:5000/api/groups',
        { name: newGroupName },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setNewGroupName(''); // Limpia el input
      fetchGroups(); // Refresca la lista de grupos para incluir el nuevo
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'No se pudo crear el grupo.');
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Asignar a Grupos</Text>
          <FlatList
            data={userGroups}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.groupItem} onPress={() => handleSelectGroup(item._id)}>
                <Icon 
                  name={selectedGroups.includes(item._id) ? 'checkbox' : 'square-outline'} 
                  size={24} 
                  color="#3B71F3" 
                />
                <Text style={styles.groupName}>{item.name}</Text>
              </TouchableOpacity>
            )}
            ListFooterComponent={
              <View style={styles.addGroupContainer}>
                <CustomInput 
                  placeholder="Nombre del nuevo grupo" 
                  value={newGroupName} 
                  setValue={setNewGroupName} 
                />
                <CustomButton 
                  text="Crear Grupo" 
                  onPress={handleCreateGroup} 
                  type="SECONDARY" 
                />
              </View>
            }
            style={styles.list}
          />
          <View style={styles.footerButtons}>
            <CustomButton text="Guardar Cambios" onPress={handleSaveChanges} />
            <CustomButton text="Cancelar" onPress={onClose} type="TERTIARY" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { width: '90%', maxHeight: '80%', backgroundColor: 'white', borderRadius: 20, padding: 25, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  groupItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, width: '100%', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  groupName: { marginLeft: 15, fontSize: 18 },
  addGroupContainer: { marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#eee', width: '100%' },
  footerButtons: { width: '100%', marginTop: 15 },
  list: { width: '100%' }
});

export default AssignGroupsModal;