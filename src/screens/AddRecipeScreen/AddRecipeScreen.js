import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import apiClient from '../api/axios';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import Icon from 'react-native-vector-icons/Ionicons';

const AddRecipeScreen = () => {
    const navigation = useNavigation();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [imageData, setImageData] = useState(null);
    const [imageUri, setImageUri] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChoosePhoto = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: true,
            quality: 0.5,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) return;
            if (response.errorCode) {
                Alert.alert('Error', 'Ocurrió un error al seleccionar la imagen.');
            } else if (response.assets && response.assets.length > 0) {
                const asset = response.assets[0];
                setImageUri(asset.uri);
                setImageData(`data:${asset.type};base64,${asset.base64}`);
            }
        });
    };

    const onAddRecipePressed = async () => {
        if (!title || !ingredients || !instructions) {
            Alert.alert('Campos Incompletos', 'El título, los ingredientes y las instrucciones son obligatorios.');
            return;
        }

        setLoading(true);
        try {
            await apiClient.post('/recipes', { 
                title, 
                description, 
                ingredients: ingredients.split('\n').filter(i => i.trim() !== ''),
                instructions,
                imageData
            });
            Alert.alert('¡Éxito!', 'Tu receta ha sido creada correctamente.', [
                { text: 'OK', onPress: () => navigation.navigate('Home') }
            ]);
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'No se pudo crear la receta.');
        } finally {
            setLoading(false);
        }
    };
    
    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#3B71F3" />
                <Text style={styles.loaderText}>Creando receta...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.keyboardAvoidingContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.root}>
                <Text style={styles.title}>Añadir Nueva Receta</Text>
                
                <TouchableOpacity onPress={handleChoosePhoto} style={styles.imagePicker}>
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                    ) : (
                        <View style={styles.placeholder}>
                            <Icon name="camera-outline" size={40} color="gray" />
                            <Text style={styles.placeholderText}>Añadir Foto (Opcional)</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <CustomInput placeholder="Título" value={title} setValue={setTitle} />
                <CustomInput 
                    placeholder="Descripción corta" 
                    value={description} 
                    setValue={setDescription} 
                />
                <CustomInput 
                    placeholder="Ingredientes (uno por línea)" 
                    value={ingredients} 
                    setValue={setIngredients} 
                    multiline
                    customStyles={styles.inputIngredients}
                />
                <CustomInput 
                    placeholder="Instrucciones" 
                    value={instructions} 
                    setValue={setInstructions} 
                    multiline
                    customStyles={styles.inputInstructions}
                />
                <CustomButton text="Añadir Receta" onPress={onAddRecipePressed} disabled={loading} />
                <CustomButton text="Cancelar" onPress={() => navigation.goBack()} type="TERTIARY" disabled={loading} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    keyboardAvoidingContainer: {
        flex: 1,
    },
    root: {
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputIngredients: {
      height: 120,
      textAlignVertical: 'top',
    },
    inputInstructions: {
      height: 200,
      textAlignVertical: 'top',
    },
    imagePicker: {
        width: '100%',
        height: 200,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#ddd',
        borderStyle: 'dashed',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    placeholder: {
        alignItems: 'center',
    },
    placeholderText: {
        color: 'gray',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loaderText: {
        marginTop: 10,
        fontSize: 16
    }
});

export default AddRecipeScreen;