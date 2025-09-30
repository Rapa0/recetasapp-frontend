import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

const ChangePasswordScreen = () => {
    const navigation = useNavigation();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordRepeat, setNewPasswordRepeat] = useState('');

    const onChangePasswordPressed = async () => {
        if (newPassword !== newPasswordRepeat) {
            Alert.alert('Error', 'Las contraseñas nuevas no coinciden.');
            return;
        }

        try {
            const userInfo = JSON.parse(await AsyncStorage.getItem('userInfo'));
            await axios.put(
                'http://10.0.2.2:5000/api/users/profile/changepassword',
                { oldPassword, newPassword },
                { headers: { Authorization: `Bearer ${userInfo.token}` } }
            );
            Alert.alert('Éxito', 'Contraseña actualizada. Por favor, inicia sesión de nuevo.');
            await AsyncStorage.clear();
            navigation.navigate('SignIn');
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'No se pudo cambiar la contraseña.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.root}>
            <Text style={styles.title}>Cambiar Contraseña</Text>
            <CustomInput placeholder="Contraseña Antigua" value={oldPassword} setValue={setOldPassword} secureTextEntry />
            <CustomInput placeholder="Nueva Contraseña" value={newPassword} setValue={setNewPassword} secureTextEntry />
            <CustomInput placeholder="Repetir Nueva Contraseña" value={newPasswordRepeat} setValue={setNewPasswordRepeat} secureTextEntry />
            <CustomButton text="Cambiar Contraseña" onPress={onChangePasswordPressed} />
            <CustomButton text="Cancelar" onPress={() => navigation.goBack()} type="TERTIARY" />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    root: { alignItems: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});

export default ChangePasswordScreen;