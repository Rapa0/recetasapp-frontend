import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../components/CustomButton';
import Icon from 'react-native-vector-icons/Ionicons';
import apiClient from '../../api/axios';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const profileResponse = await apiClient.get('/users/profile');
          setUser(profileResponse.data);
        } catch (error) {
          Alert.alert('Error', 'No se pudo cargar el perfil.');
          navigation.navigate('SignIn');
        } finally {
          setLoading(false);
        }
      };
      
      const setupInterceptorAndFetch = async () => {
           const userInfoString = await AsyncStorage.getItem('userInfo');
           if (!userInfoString) {
               navigation.navigate('SignIn');
               return;
           }
           const userInfo = JSON.parse(userInfoString);
           apiClient.defaults.headers.common.Authorization = `Bearer ${userInfo.token}`;
           fetchData();
      }
      setupInterceptorAndFetch();
    }, [navigation])
  );
  
  const onLogoutPressed = async () => {
    await AsyncStorage.removeItem('userInfo');
    navigation.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
    });
  };
  
  const onDeletePressed = () => {
    Alert.alert(
        'Borrar Cuenta',
        '¿Estás seguro? Esta acción es permanente y eliminará tu cuenta, tus recetas y tus grupos.',
        [
            {text: 'Cancelar', style: 'cancel'},
            {
                text: 'Sí, Borrar Todo',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await apiClient.delete('/users/profile');
                        await AsyncStorage.clear();
                        Alert.alert('Éxito', 'Tu cuenta ha sido eliminada.');
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'SignIn' }],
                        });
                    } catch (error) {
                        Alert.alert('Error', 'No se pudo eliminar la cuenta.');
                    }
                }
            }
        ]
    )
  };

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <ScrollView style={styles.root}>
      <View style={styles.header}>
        <Icon name="person-circle-outline" size={120} color="#ccc" />
        <Text style={styles.username}>{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.menu}>
        <CustomButton 
          text="Ver Recetas" 
          onPress={() => navigation.navigate('Home')} 
          type="TERTIARY" 
          fgColor="#333" 
          icon="restaurant-outline"
        />
        <CustomButton 
          text="Mis Grupos" 
          onPress={() => navigation.navigate('Groups')} 
          type="TERTIARY" 
          fgColor="#333" 
          icon="folder-outline"
        />
        <CustomButton 
          text="Editar Perfil" 
          onPress={() => navigation.navigate('EditProfile')} 
          type="TERTIARY" 
          fgColor="#333" 
          icon="create-outline"
        />
        <CustomButton 
          text="Cambiar Contraseña" 
          onPress={() => navigation.navigate('ChangePassword')} 
          type="TERTIARY" 
          fgColor="#333" 
          icon="lock-closed-outline"
        />
        <CustomButton 
          text="Borrar Cuenta" 
          onPress={onDeletePressed} 
          type="TERTIARY" 
          fgColor="#E53935" 
          icon="trash-outline"
        />
      </View>
      
      <View style={styles.footer}>
        <CustomButton text="Cerrar Sesión" onPress={onLogoutPressed} type="TERTIARY" icon="log-out-outline" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        alignItems: 'center',
        padding: 20,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    username: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#333',
    },
    email: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 20,
    },
    menu: {
        width: '100%',
        paddingHorizontal: 20,
    },
    footer: {
        width: '100%',
        marginTop: 'auto', 
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 10,
        paddingBottom: 20, 
    },
});

export default ProfileScreen;