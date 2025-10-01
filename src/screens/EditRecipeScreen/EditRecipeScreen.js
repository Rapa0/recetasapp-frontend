import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import apiClient from '../../api/axios';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import Icon from 'react-native-vector-icons/Ionicons';

const EditRecipeScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { recipeId } = route.params;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    
    const [imageUri, setImageUri] = useState(null); 
    const [imageData, setImageData] = useState(undefined); 
    
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const { data } = await apiClient.get(`/recipes/${recipeId}`);
                setTitle(data.title);
                setDescription(data.description);
                setIngredients(data.ingredients.join('\n'));
                setInstructions(data.instructions);
                setImageUri(data.imageUrl); 
            } catch (error) {
                Alert.alert('Error', 'No se pudo cargar la receta para editar.');
                navigation.goBack();
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [recipeId, navigation]);

    const handleChoosePhoto = () => {
        launchImageLibrary({ mediaType: 'photo', includeBase64: true, quality: 0.5 }, (response) => {
            if (response.didCancel) return;
            if (response.errorCode) return Alert.alert('Error', 'Ocurrió un error al seleccionar la imagen.');
            
            if (response.assets && response.assets.length > 0) {
                const asset = response.assets[0];
                setImageUri(asset.uri); 
                setImageData(`data:${asset.type};base64,${asset.base64}`); 
            }
        });
    };

    const removeImage = () => {
        Alert.alert(
            "Eliminar Imagen",
            "¿Estás seguro de que quieres eliminar la imagen de esta receta?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Eliminar", 
                    style: "destructive",
                    onPress: () => {
                        setImageUri(null); 
                        setImageData(null); 
                    }
                }
            ]
        );
    };

    const onSaveChangesPressed = async () => {
        if (!title || !ingredients || !instructions) {
            Alert.alert('Error', 'El título, los ingredientes y las instrucciones son obligatorios.');
            return;
        }
        setLoading(true);
        try {
            const payload = { 
                title, 
                description, 
                ingredients: ingredients.split('\n').filter(i => i.trim() !== ''), 
                instructions,
            };

            if (imageData !== undefined) {
                payload.imageData = imageData;
            }

            await apiClient.put(`/recipes/${recipeId}`, payload);
            Alert.alert('Éxito', 'Receta actualizada correctamente.');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'No se pudo actualizar la receta.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" style={styles.loader} />;
    }

    return (
        <KeyboardAvoidingView style={styles.keyboardAvoidingContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.root}>
                <Text style={styles.title}>Editar Receta</Text>
                
                <TouchableOpacity onPress={handleChoosePhoto} style={styles.imagePicker}>
                    {imageUri ? (
                        <>
                            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                            <TouchableOpacity onPress={removeImage} style={styles.removeImageButton}>
                                <Icon name="close-circle" size={30} color="#E53935" />
                            </TouchableOpacity>
                        </>
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
                />
                <CustomInput 
                    placeholder="Instrucciones" 
                    value={instructions} 
                    setValue={setInstructions} 
                    multiline
                />
                <CustomButton text="Guardar Cambios" onPress={onSaveChangesPressed} disabled={loading} />
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
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        overflow: 'hidden', 
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholder: {
        alignItems: 'center',
    },
    placeholderText: {
        color: 'gray',
    },
    removeImageButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 2,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
    },
});

export default EditRecipeScreen;