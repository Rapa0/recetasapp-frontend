import React, { useState } from 'react';
import { Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import apiClient from '../../api/axios';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

const VerifyEmailChangeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [code, setCode] = useState('');
  const { newEmail } = route.params;

  const onVerifyPressed = async () => {
    if (!code) return Alert.alert('Error', 'Por favor, introduce el código.');
    try {
      await apiClient.post('/users/verify-email-change', { code });
      Alert.alert('Éxito', 'Tu correo ha sido actualizado correctamente.', [
          { text: 'OK', onPress: () => navigation.popToTop() }
      ]);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Ocurrió un error');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <Text style={styles.title}>Verificar Nuevo Correo</Text>
      <Text style={styles.subtitle}>
        Introduce el código que enviamos a <Text style={styles.email}>{newEmail}</Text>
      </Text>
      <CustomInput
        placeholder="Código de 6 dígitos"
        value={code}
        setValue={setCode}
        keyboardType="numeric"
      />
      <CustomButton text="Verificar y Guardar" onPress={onVerifyPressed} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#051C60',
    marginBottom: 10,
  },
  subtitle: {
      fontSize: 16,
      color: 'gray',
      textAlign: 'center',
      marginBottom: 20,
      paddingHorizontal: 20,
  },
  email: {
      fontWeight: 'bold',
      color: '#051C60',
  }
});

export default VerifyEmailChangeScreen;