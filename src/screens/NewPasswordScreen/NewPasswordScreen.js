import React from 'react';
import {Text, StyleSheet, ScrollView, Alert} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

const NewPasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [newPassword, setNewPassword] = React.useState('');
  const [newPasswordRepeat, setNewPasswordRepeat] = React.useState('');

  const onSubmitPressed = async () => {
    if (newPassword.length < 6) {
      Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (newPassword !== newPasswordRepeat) {
        Alert.alert('Error', 'Las contraseñas no coinciden.');
        return;
    }

    try {
      const code = route.params?.code;
      await axios.patch(
        `https://recetasapp-backend-production.up.railway.app/api/auth/resetpassword/${code}`,
        {password: newPassword},
      );

      Alert.alert('Éxito', 'Tu contraseña ha sido restablecida. Por favor, inicia sesión.');
      navigation.navigate('SignIn');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Ocurrió un error');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <Text style={styles.title}>Introduce la Nueva Contraseña</Text>
      <CustomInput
        placeholder="Nueva Contraseña"
        value={newPassword}
        setValue={setNewPassword}
        secureTextEntry
      />
      <CustomInput
        placeholder="Repetir Nueva Contraseña"
        value={newPasswordRepeat}
        setValue={setNewPasswordRepeat}
        secureTextEntry
      />
      <CustomButton text="Restablecer" onPress={onSubmitPressed} />
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
    margin: 10,
  },
});

export default NewPasswordScreen;