import React from 'react';
import {Text, StyleSheet, ScrollView, Alert, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

const ConfirmEmailScreen = () => {
  const navigation = useNavigation();
  const [code, setCode] = React.useState('');

  const onConfirmPressed = async () => {
    if (!code) {
        Alert.alert('Error', 'Por favor, introduce el código de tu correo');
        return;
    }
    try {
        await axios.post('recetasapp-backend-production.up.railway.app/api/auth/confirmemail', {token: code});
        Alert.alert('Éxito', 'Tu cuenta ha sido confirmada. Ahora puedes iniciar sesión.');
        navigation.navigate('SignIn');
    } catch (error) {
        Alert.alert('Error', error.response?.data?.message || 'El código es incorrecto o ha expirado.');
    }
  };

  const onSignInPress = () => {
    navigation.navigate('SignIn');
  };

  const onResendPress = () => {
    console.warn('Reenviar código presionado (funcionalidad no implementada)');
  };

  return (
    <ScrollView contentContainerStyle={styles.root}>
        <View style={styles.innerContainer}>
            <Text style={styles.title}>Confirmar tu Correo</Text>
            <CustomInput
                placeholder="Introduce tu código de confirmación"
                value={code}
                setValue={setCode}
            />
            <CustomButton text="Confirmar" onPress={onConfirmPressed} />
            <CustomButton
                text="Reenviar código"
                onPress={onResendPress}
                type="SECONDARY"
            />
            <CustomButton
                text="Volver a Iniciar Sesión"
                onPress={onSignInPress}
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
  },
  innerContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#051C60',
    margin: 10,
  },
});

export default ConfirmEmailScreen;