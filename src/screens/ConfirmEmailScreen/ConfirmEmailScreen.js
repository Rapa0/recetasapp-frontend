import React, { useState } from 'react';
import {Text, StyleSheet, ScrollView, Alert, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import apiClient from '../../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

const ConfirmEmailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);


  const [currentToken, setCurrentToken] = useState(route.params.registrationToken);

  const onConfirmPressed = async () => {
    if (!code) {
        Alert.alert('Error', 'Por favor, introduce el código de tu correo');
        return;
    }
    setLoading(true);
    try {
        const response = await apiClient.post('/auth/confirmEmail', {
          code: code,
          registrationToken: currentToken, 
        });
        
        await AsyncStorage.setItem('userInfo', JSON.stringify(response.data));
        Alert.alert('¡Éxito!', 'Tu cuenta ha sido confirmada. ¡Bienvenido!');
        navigation.replace('Home');
    } catch (error) {
        Alert.alert('Error', error.response?.data?.message || 'El código es incorrecto o ha expirado.');
    } finally {
        setLoading(false);
    }
  };

  const onSignInPress = () => {
    navigation.navigate('SignIn');
  };

  const onResendPress = async () => {
    setResending(true);
    try {
        const response = await apiClient.post('/auth/resend-confirmation', {
            registrationToken: currentToken,
        });
        setCurrentToken(response.data.registrationToken);
        Alert.alert('Éxito', 'Se ha enviado un nuevo código a tu correo.');
    } catch (error) {
        Alert.alert('Error', error.response?.data?.message || 'No se pudo reenviar el código.');
    } finally {
        setResending(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.root}>
        <View style={styles.innerContainer}>
            <Text style={styles.title}>Confirmar tu Correo</Text>
            <CustomInput
                placeholder="Introduce tu código de confirmación"
                value={code}
                setValue={setCode}
                keyboardType="numeric"
            />
            <CustomButton 
                text={loading ? "Confirmando..." : "Confirmar"} 
                onPress={onConfirmPressed} 
                disabled={loading || resending}
            />
            <CustomButton
                text={resending ? "Enviando..." : "Reenviar código"}
                onPress={onResendPress}
                type="SECONDARY"
                disabled={loading || resending}
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