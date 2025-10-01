import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AllRecipesTab from './AllRecipesTab';
import MyRecipesTab from './MyRecipesTab';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomButton from '../../components/CustomButton';

const Tab = createMaterialTopTabNavigator();

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.root}>
      {/* Header personalizado */}
      <View style={styles.header}>
        <Text style={styles.title}>Recetas</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Icon name="person-circle-outline" size={36} color="#3B71F3" />
        </TouchableOpacity>
      </View>

      {/* Navegador de Pestañas */}
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#3B71F3',
          tabBarInactiveTintColor: 'gray',
          tabBarIndicatorStyle: {
            backgroundColor: '#3B71F3',
            height: 3,
          },
          tabBarLabelStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Tab.Screen name="Explorar" component={AllRecipesTab} />
        <Tab.Screen name="Mis Recetas" component={MyRecipesTab} />
      </Tab.Navigator>

      {/* Botón para añadir receta en el footer */}
      <View style={styles.footer}>
        <CustomButton text="Añadir Nueva Receta" onPress={() => navigation.navigate('AddRecipe')} icon="add-circle-outline" />
      </View>
    </SafeAreaView>
  );
};

// Estilos adaptados de tu HomeScreen original
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white', // Un fondo blanco para el header
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  }
});

export default HomeScreen;