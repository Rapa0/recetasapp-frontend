import React from 'react';
import {Text, StyleSheet, ScrollView, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = React.useState('');

  const onSendPressed = async () => {
    try {
      await axios.post('https://recetasapp-backend-production.up.railway.app/api/auth/forgotpassword', {
        email: username,
      });
      Alert.alert(
        'Éxito',
        'Se ha enviado un código a tu correo para restablecer la contraseña.',
      );
      navigation.navigate('VerifyCode');
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'No se pudo enviar el correo',
      );
    }
  };

  const onSignInPress = () => {
    navigation.navigate('SignIn');
  };

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <Text style={styles.title}>Restablecer Contraseña</Text>

      <CustomInput
        placeholder="Correo Electrónico"
        value={username}
        setValue={setUsername}
      />

      <CustomButton text="Enviar" onPress={onSendPressed} />

      <CustomButton
        text="Volver a Iniciar Sesión"
        onPress={onSignInPress}
        type="TERTIARY"
      />
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

export default ForgotPasswordScreen;