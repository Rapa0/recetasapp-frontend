import React from 'react';
import {Text, StyleSheet, ScrollView, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import apiClient from '../../api/axios';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButtons';

const SignUpScreen = () => {
  const navigation = useNavigation();

  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordRepeat, setPasswordRepeat] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const onRegisterPressed = async () => {
    if (password.length < 6) {
      Alert.alert('Contraseña Débil', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (password !== passwordRepeat) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/auth/register', {
          username,
          email,
          password,
        }
      );
      
      const { registrationToken } = response.data;
      
      Alert.alert('Casi Listo', 'Hemos enviado un código de confirmación a tu correo.');
      navigation.navigate('ConfirmEmail', { registrationToken: registrationToken });

    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
      Alert.alert('Error de Registro', error.response?.data?.message || 'Ocurrió un error');
    } finally {
        setLoading(false);
    }
  };

  const onSignInPress = () => {
    navigation.navigate('SignIn');
  };

  const onTermsOfUsePressed = () => console.warn('Términos de Uso presionado');
  const onPrivacyPolicyPressed = () => console.warn('Política de Privacidad presionado');

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <Text style={styles.title}>Crear una cuenta</Text>
      <CustomInput placeholder="Nombre de Usuario" value={username} setValue={setUsername} />
      <CustomInput placeholder="Correo Electrónico" value={email} setValue={setEmail} keyboardType="email-address" />
      <CustomInput placeholder="Contraseña" value={password} setValue={setPassword} secureTextEntry />
      <CustomInput placeholder="Repetir Contraseña" value={passwordRepeat} setValue={setPasswordRepeat} secureTextEntry />
      <CustomButton text={loading ? "Registrando..." : "Registrarse"} onPress={onRegisterPressed} disabled={loading} />

      <Text style={styles.text}>
        Al registrarte, confirmas que aceptas nuestros{' '}
        <Text style={styles.link} onPress={onTermsOfUsePressed}>Términos de Uso</Text>{' '}
        y nuestra{' '}
        <Text style={styles.link} onPress={onPrivacyPolicyPressed}>Política de Privacidad</Text>.
      </Text>

      <SocialSignInButtons />
      <CustomButton text="¿Ya tienes una cuenta? Inicia Sesión" onPress={onSignInPress} type="TERTIARY" />
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
  text: {
    color: 'gray',
    marginVertical: 10,
  },
  link: {
    color: '#FDB075',
  },
});

export default SignUpScreen;