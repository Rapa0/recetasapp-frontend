import React from 'react';
import {Text, StyleSheet, Pressable, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CustomButton = ({onPress, text, type = 'PRIMARY', bgColor, fgColor, icon}) => {
  const textColor = fgColor || (type === 'TERTIARY' ? 'gray' : type === 'SECONDARY' ? '#3B71F3' : 'white');

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        styles[`container_${type}`],
        bgColor ? {backgroundColor: bgColor} : {},
      ]}>
      <View style={styles.content}>
        {icon && <Icon name={icon} size={20} color={textColor} style={styles.icon} />}
        <Text
          style={[
            styles.text,
            styles[`text_${type}`],
            fgColor ? {color: fgColor} : {},
          ]}>
          {text}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 15,
    marginVertical: 5,
    alignItems: 'center',
    borderRadius: 5,
  },
  container_PRIMARY: {
    backgroundColor: '#3B71F3',
  },
  container_SECONDARY: {
    borderColor: '#3B71F3',
    borderWidth: 2,
  },
  container_TERTIARY: {},
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontWeight: 'bold',
    color: 'white',
  },
  text_SECONDARY: {
    color: '#3B71F3',
  },
  text_TERTIARY: {
    color: 'gray',
  },
});

export default CustomButton;