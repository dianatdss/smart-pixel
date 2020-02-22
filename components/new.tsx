import React, { useState } from "react";
import { AsyncStorage } from 'react-native';
import { Text, View, Button, Image, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import * as ImagePicker from "expo-image-picker";
const New = ({ navigation }) => {

  const [image, setState] = useState(null);
  async function storeDataToStorage  (image) {
    try {
      let value = await AsyncStorage.getItem('gallery');
      const newImage = JSON.stringify(image);      
      value = value ? value.concat(',', newImage): newImage;
      await AsyncStorage.setItem('gallery', value);
    } catch (error) {
      console.log(error);
    }
  };
  async function pickImageFromGallery() {
    ImagePicker.requestCameraRollPermissionsAsync();

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });
    if (!result.cancelled) {
      setState(result.uri);
      storeDataToStorage(result.uri);
    }
  }

  async function pickImageFromCamera() {
    ImagePicker.requestCameraPermissionsAsync();

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });
    if (!result.cancelled) {
      setState(result.uri);
      storeDataToStorage(result.uri);
    }
  }

  return (
    <View style={styles.container}>
      <Icon
        name="three-bars"
        size={30}
        color="#000"
        onPress={() => navigation.toggleDrawer()}
      />
      <View style={styles.button}>
        <Button title="Open gallery" onPress={() => pickImageFromGallery()} />
      </View>
      <View style={styles.button}>
        <Button title="Open cameraa" onPress={() => pickImageFromCamera()} />
      </View>

      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
};
export default New;

const styles = StyleSheet.create({
  container: {
    marginVertical: 30,
    marginHorizontal: 20
  },
  image: {
    borderRadius: 30,
    width: 150,
    height: 150
  },
  button: {
    width: '50%',
    borderRadius: 30,
    marginVertical: 5
  }
});
