import React from 'react';
import {Text, StyleSheet, ScrollView, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

const VerifyCodeScreen = () => {
  const navigation = useNavigation();
  const [code, setCode] = React.useState('');

  const onVerifyPressed = async () => {
    try {
      await axios.post('https://recetasapp-backend-production.up.railway.app/api/auth/verifyresetcode', { code });

      navigation.navigate('NewPassword', { code: code });
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Ocurrió un error');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <Text style={styles.title}>Verificar Código</Text>
      <CustomInput
        placeholder="Introduce el código de tu correo"
        value={code}
        setValue={setCode}
        keyboardType="numeric"
      />
      <CustomButton text="Verificar" onPress={onVerifyPressed} />
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

export default VerifyCodeScreen;