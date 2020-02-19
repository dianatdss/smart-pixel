import React, {useState} from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';

const Gallery = ({ navigation }) => {
  navigation.openDrawer();
    return (
        <View style={styles.container}>
        <Icon
          name='three-bars' 
          size={30} 
          color='#000' 
        onPress={() => navigation.toggleDrawer()}
      />
        </View>
    );
}
export default Gallery;


const styles = StyleSheet.create({
  container: {
    marginVertical: 30,
    marginHorizontal: 20
  }
});