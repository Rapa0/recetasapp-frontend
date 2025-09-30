import React, { useState, useEffect } from 'react';
import { ScrollView, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import apiClient from '../../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

const EditProfileScreen = () => {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [originalEmail, setOriginalEmail] = useState(''); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await apiClient.get('/users/profile');
                setUsername(response.data.username);
                setEmail(response.data.email);
                setOriginalEmail(response.data.email); 
            } catch (error) {
                Alert.alert('Error', 'No se pudo cargar el perfil.');
            } finally {
                setLoading(false);
            }
        };
        const setupInterceptor = async () => {
             const userInfo = JSON.parse(await AsyncStorage.getItem('userInfo'));
             apiClient.defaults.headers.common['Authorization'] = `Bearer ${userInfo.token}`;
             fetchProfile();
        }
        setupInterceptor();
    }, []);

    const onSaveChangesPressed = async () => {
        const emailHasChanged = email.trim().toLowerCase() !== originalEmail.trim().toLowerCase();
        
        try {
            if (emailHasChanged) {
                await apiClient.post('/users/request-email-change', { newEmail: email });
                Alert.alert('Verifica tu Correo', 'Hemos enviado un código de verificación a tu nuevo correo.');
                navigation.navigate('VerifyEmailChange', { newEmail: email });
            } else {
                await apiClient.put('/users/profile', { username });
                Alert.alert('Éxito', 'Perfil actualizado.');
                navigation.goBack();
            }
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'No se pudo procesar la solicitud.');
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" style={styles.loader} />;
    }

    return (
        <ScrollView contentContainerStyle={styles.root}>
            <Text style={styles.title}>Editar Perfil</Text>
            <CustomInput placeholder="Nombre de Usuario" value={username} setValue={setUsername} />
            <CustomInput placeholder="Correo Electrónico" value={email} setValue={setEmail} />
            <CustomButton text="Guardar Cambios" onPress={onSaveChangesPressed} />
            <CustomButton text="Cancelar" onPress={() => navigation.goBack()} type="TERTIARY" />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    root: { 
        alignItems: 'center', 
        padding: 20 
    },
    title: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 20 
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default EditProfileScreen;