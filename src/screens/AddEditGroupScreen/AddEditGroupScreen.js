import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

const AddEditGroupScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const group = route.params?.group;

  const [name, setName] = useState(group?.name || '');
  const [loading, setLoading] = useState(false);

  const onSavePressed = async () => {
    if (!name) {
        Alert.alert('Error', 'El nombre del grupo no puede estar vacío.');
        return;
    }
    setLoading(true);
    try {
      const userInfo = JSON.parse(await AsyncStorage.getItem('userInfo'));
      const token = userInfo?.token;

      if (group) {
        // Lógica para Editar
        await axios.put(
          `recetasapp-backend-production.up.railway.app/api/groups/${group._id}`,
          { name },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } else {
        // Lógica para Crear
        await axios.post(
          'recetasapp-backend-production.up.railway.app/api/groups',
          { name },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Ocurrió un error.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.root}>
        <View style={styles.container}>
            <Text style={styles.title}>{group ? 'Editar Grupo' : 'Crear Nuevo Grupo'}</Text>
            <CustomInput 
                placeholder="Nombre del Grupo" 
                value={name} 
                setValue={setName} 
            />
            <CustomButton 
                text={loading ? 'Guardando...' : 'Guardar'} 
                onPress={onSavePressed} 
                disabled={loading}
            />
            <CustomButton 
                text="Cancelar" 
                onPress={() => navigation.goBack()} 
                type="TERTIARY" 
            />
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: { 
      flexGrow: 1, 
      justifyContent: 'center',
      backgroundColor: '#F5F5F5'
  },
  container: {
    padding: 20,
  },
  title: { 
      fontSize: 24, 
      fontWeight: 'bold', 
      textAlign: 'center', 
      marginBottom: 20 
  },
});

export default AddEditGroupScreen;