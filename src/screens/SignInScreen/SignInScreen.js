import React from 'react';
import {
  Image,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  Alert,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import apiClient from '../../api/axios'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

import Logo from '../../../assets/images/logo.png';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButtons';

const SignInScreen = () => {
  const { height } = useWindowDimensions();
  const navigation = useNavigation();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const onSignInPressed = async () => {
    if (!email || !password) {
      Alert.alert('Campos Incompletos', 'Por favor, introduce tu correo y contraseña.');
      return;
    }
    try {

      const response = await apiClient.post('/auth/login', {
        email: email,
        password: password,
      });
      
      await AsyncStorage.setItem('userInfo', JSON.stringify(response.data));
      
      navigation.replace('Home');

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
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Image
          source={Logo}
          style={[styles.logo, { height: height * 0.3 }]}
          resizeMode="contain"
        />
        <CustomInput
          placeholder="Correo Electrónico"
          value={email}
          setValue={setEmail}
          keyboardType="email-address"
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
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: '70%',
    maxWidth: 300,
    maxHeight: 200,
  },
});

export default SignInScreen;