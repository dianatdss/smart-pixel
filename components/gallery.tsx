import React, {useState} from 'react';
import { Text, View, Button } from 'react-native';

const Gallery = ({ navigation }) => {
  navigation.openDrawer();
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Page Gallery</Text>
        <Button
        title="Open drawer"
        onPress={() => navigation.toggleDrawer()}
      />
        </View>
    );
}
export default Gallery;