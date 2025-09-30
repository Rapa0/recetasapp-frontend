import React from 'react';
import {
  Image,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Logo from '../../../assets/images/logo.png';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButtons';

const SignInScreen = () => {
  const {height} = useWindowDimensions();
  const navigation = useNavigation();

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const onSignInPressed = async () => {
    try {
      const response = await axios.post(
        'http://10.0.2.2:5000/api/auth/login',
        {
          email: username,
          password: password,
        },
      );
      
      await AsyncStorage.setItem('userInfo', JSON.stringify(response.data));
      navigation.navigate('Home');

    } catch (error) {
      Alert.alert(
        'Error de Inicio de Sesión',
        error.response?.data?.message || 'Ocurrió un error',
      );
    }
  };

  const onForgotPasswordPressed = () => {
    navigation.navigate('ForgotPassword');
  };

  const onSignUpPressed = () => {
    navigation.navigate('SignUp');
  };

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <Image
        source={Logo}
        style={[styles.logo, {height: height * 0.3}]}
        resizeMode="contain"
      />
      <CustomInput
        placeholder="Correo Electrónico"
        value={username}
        setValue={setUsername}
      />
      <CustomInput
        placeholder="Contraseña"
        value={password}
        setValue={setPassword}
        secureTextEntry={true}
      />
      <CustomButton text="Iniciar Sesión" onPress={onSignInPressed} />
      <CustomButton
        text="¿Olvidaste tu contraseña?"
        onPress={onForgotPasswordPressed}
        type="TERTIARY"
      />
      <SocialSignInButtons />
      <CustomButton
        text="¿No tienes una cuenta? Crea una"
        onPress={onSignUpPressed}
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
  logo: {
    width: '70%',
    maxWidth: 300,
    maxHeight: 200,
  },
});

export default SignInScreen;