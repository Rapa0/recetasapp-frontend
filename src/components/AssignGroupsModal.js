import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Modal, FlatList, TouchableOpacity, Alert } from 'react-native';
import apiClient from '../api/axios'; 
import CustomButton from './CustomButton';
import CustomInput from './CustomInput';
import Icon from 'react-native-vector-icons/Ionicons';

const AssignGroupsModal = ({ recipe, isVisible, onClose, onSave }) => {
  const [userGroups, setUserGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');


  const fetchGroups = useCallback(async () => {
    try {
      const response = await apiClient.get('/groups/mygroups'); 
      setUserGroups(response.data);

      if (recipe) {
        const initialGroupIds = recipe.groups ? recipe.groups.map(g => g._id || g) : [];
        setSelectedGroups(initialGroupIds);
      }
    } catch (error) {
      console.error("Error al cargar grupos:", error); 
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
      await apiClient.post('/groups', { name: newGroupName });
      setNewGroupName(''); 
      fetchGroups(); 
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