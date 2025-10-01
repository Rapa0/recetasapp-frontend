import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, Alert, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import apiClient from '../../api/axios';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

const ChangePasswordScreen = () => {
    const navigation = useNavigation();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordRepeat, setNewPasswordRepeat] = useState('');
    const [loading, setLoading] = useState(false);

    const onChangePasswordPressed = async () => {
        if (!oldPassword || !newPassword || !newPasswordRepeat) {
            Alert.alert('Error', 'Por favor, rellena todos los campos.');
            return;
        }
        if (newPassword !== newPasswordRepeat) {
            Alert.alert('Error', 'Las contraseñas nuevas no coinciden.');
            return;
        }

        setLoading(true);
        try {

            await apiClient.put(
                '/users/profile/changepassword',
                { oldPassword, newPassword }
            );

            Alert.alert('Éxito', 'Contraseña actualizada. Por favor, inicia sesión de nuevo.');
            await AsyncStorage.clear();

            navigation.reset({
                index: 0,
                routes: [{ name: 'SignIn' }],
            });

        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'No se pudo cambiar la contraseña.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.root}>
            <View style={styles.container}>
                <Text style={styles.title}>Cambiar Contraseña</Text>
                <CustomInput placeholder="Contraseña Antigua" value={oldPassword} setValue={setOldPassword} secureTextEntry />
                <CustomInput placeholder="Nueva Contraseña" value={newPassword} setValue={setNewPassword} secureTextEntry />
                <CustomInput placeholder="Repetir Nueva Contraseña" value={newPasswordRepeat} setValue={setNewPasswordRepeat} secureTextEntry />
      
                <CustomButton 
                    text={loading ? "Cambiando..." : "Cambiar Contraseña"} 
                    onPress={onChangePasswordPressed} 
                    disabled={loading}
                />
                <CustomButton 
                    text="Cancelar" 
                    onPress={() => navigation.goBack()} 
                    type="TERTIARY" 
                    disabled={loading}
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
    container: {
        alignItems: 'center',
        padding: 20,
    },
    title: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 20 
    },
});

export default ChangePasswordScreen;