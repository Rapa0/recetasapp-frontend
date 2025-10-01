import React, {useState} from 'react';
import {View, TextInput, StyleSheet, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 

const CustomInput = ({value, setValue, placeholder, secureTextEntry, multiline, keyboardType, customStyles}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  return (
    <View style={[styles.container, customStyles]}>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        style={styles.input}
        secureTextEntry={!isPasswordVisible}
        placeholderTextColor="gray"
        multiline={multiline}
        keyboardType={keyboardType || 'default'}
      />
      {secureTextEntry && (
        <Pressable onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Icon
            name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color="gray"
            style={styles.icon}
          />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',
    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
    flexDirection: 'row', 
    alignItems: 'center',
  },
  input: {
    flex: 1, 
    minHeight: 50,
    paddingVertical: 10,
    fontSize: 16,
    letterSpacing: 0.5, 
  },
  icon: {
    padding: 5,
  },
});

export default CustomInput;