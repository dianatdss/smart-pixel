import React, { useState } from "react";
import { AsyncStorage } from "react-native";
import { View, Button, Image, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import * as ImagePicker from "expo-image-picker";
import AssetUtils from 'expo-asset-utils';


const New = ({ navigation }) => {
  const [image, setImage] = useState(null);

  async function storeDataToStorage(image) {
    try {
      let value = await AsyncStorage.getItem("gallery");
      const newImage = JSON.stringify(image);
      value = value ? value.concat(",", newImage) : newImage;
      await AsyncStorage.setItem("gallery", value);
    } catch (error) {
      console.log(error);
    }
  }

  async function pickImageFromGallery() {
    ImagePicker.requestCameraRollPermissionsAsync();

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1
    });
    if (!result.cancelled) {
      setImage(result);
      storeDataToStorage(result.uri);
    }
  }

  async function pickImageFromCamera() {
    ImagePicker.requestCameraPermissionsAsync();

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1
    });
    if (!result.cancelled) {
      setImage(result);
      storeDataToStorage(result.uri);
    }
  }

  async function redirectToEditPhoto() {

    try {
      AssetUtils.fromUriAsync(image.uri).then(fromUri => {
        fromUri.localUri = fromUri.uri;
        AssetUtils.resolveAsync(fromUri).then(uriResolved => {
          navigation.navigate('Edit', { photo: uriResolved })
        });
      });
    } catch (error) {
      console.log(error);
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
      <View style={styles.buttonContainer}>
      <View style={styles.button}>
        <Button title="Open gallery" onPress={() => pickImageFromGallery()} />
      </View>
      <View style={styles.button}>
        <Button title="Open cameraa" onPress={() => pickImageFromCamera()} />
      </View>
      </View>

      {image && (
        <TouchableOpacity onPress={() => redirectToEditPhoto()}  >
          <Image
            source={{ uri: image.uri }} style={styles.image} />
        </TouchableOpacity>
      )}
    </View>
  );
};
export default New;

const styles = StyleSheet.create({
  container: {
    marginVertical: 30,
    marginHorizontal: 20
  },
  buttonContainer: {
    flexDirection: 'row',
    marginHorizontal: -3
  },
  image: {
    borderRadius: 10,
    width: 150,
    height: 150
  },
  button: {
    width: "50%",
    marginVertical: 5,
    marginHorizontal: 3
  }
});
