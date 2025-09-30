import React, { useState, useEffect } from 'react';
import { ScrollView, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

const EditProfileScreen = () => {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userInfo = JSON.parse(await AsyncStorage.getItem('userInfo'));
                const response = await axios.get('recetasapp-backend-production.up.railway.app/api/users/profile', {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                setUsername(response.data.username);
                setEmail(response.data.email);
            } catch (error) {
                Alert.alert('Error', 'No se pudo cargar el perfil.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const onSaveChangesPressed = async () => {
        try {
            const userInfo = JSON.parse(await AsyncStorage.getItem('userInfo'));
            await axios.put(
                'recetasapp-backend-production.up.railway.app/api/users/profile',
                { username, email },
                { headers: { Authorization: `Bearer ${userInfo.token}` } }
            );
            Alert.alert('Éxito', 'Perfil actualizado.');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'No se pudo actualizar el perfil.');
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