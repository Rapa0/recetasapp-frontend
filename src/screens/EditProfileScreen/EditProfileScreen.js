import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import apiClient from '../../api/axios';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

const EditProfileScreen = () => {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [originalEmail, setOriginalEmail] = useState('');
    const [originalUsername, setOriginalUsername] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const response = await apiClient.get('/users/profile');
            setUsername(response.data.username);
            setEmail(response.data.email);
            setOriginalEmail(response.data.email);
            setOriginalUsername(response.data.username);
        } catch (error) {
            Alert.alert('Error', 'No se pudo cargar el perfil.');
        } finally {
            setLoading(false);
        }
    };
    
    useFocusEffect(
      React.useCallback(() => {
        setLoading(true);
        fetchProfile();
      }, [])
    );

    const onSaveChangesPressed = async () => {
        console.log('Botón "Guardar Cambios" presionado.');

        const emailHasChanged = email.trim().toLowerCase() !== originalEmail.trim().toLowerCase();
        const usernameHasChanged = username.trim() !== originalUsername.trim();
        
        console.log('¿Email ha cambiado?:', emailHasChanged);
        console.log('¿Username ha cambiado?:', usernameHasChanged);

        if (!emailHasChanged && !usernameHasChanged) {
            console.log('No se detectaron cambios. Mostrando alerta.');
            return Alert.alert('Sin Cambios', 'No has modificado ningún dato.');
        }

        try {
            if (emailHasChanged) {
                console.log('Iniciando flujo para cambiar email a:', email);
                await apiClient.post('/users/request-email-change', { newEmail: email });
                
                console.log('Petición exitosa. Mostrando alerta y navegando...');
                Alert.alert('Verifica tu Correo', 'Hemos enviado un código de verificación a tu nuevo correo.');
                navigation.navigate('VerifyEmailChange', { newEmail: email });

            } else if (usernameHasChanged) {
                console.log('Iniciando flujo para cambiar username a:', username);
                await apiClient.put('/users/profile', { username });

                console.log('Petición exitosa. Mostrando alerta y volviendo atrás...');
                Alert.alert('Éxito', 'Nombre de usuario actualizado.');
                navigation.goBack();
            }
        } catch (error) {
            console.error('--- ERROR CAPTURADO EN onSaveChangesPressed ---');
            console.error('Objeto de error completo:', JSON.stringify(error, null, 2));

            if (error.response) {
                console.error('Datos del error (error.response.data):', error.response.data);
                console.error('Status del error (error.response.status):', error.response.status);
            }
            
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
            <CustomInput placeholder="Correo Electrónico" value={email} setValue={setEmail} keyboardType="email-address"/>
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