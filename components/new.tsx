import React, { useState } from "react";
import { AsyncStorage } from "react-native";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import * as ImagePicker from "expo-image-picker";
import AssetUtils from 'expo-asset-utils';
import * as styleConstants from '../utils/styles'


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
      <TouchableOpacity style={styles.button} onPress={() => pickImageFromGallery()} >
        <Text style={styles.buttonText}>Open gallery  </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => pickImageFromCamera()} >
        <Text style={styles.buttonText}>Open camera  </Text>
      </TouchableOpacity>
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
    borderRadius: styleConstants.gridGutterWidth / 3,
    width: "100%",
    height: "70%",
    marginVertical: styleConstants.padding.md,
    borderColor: styleConstants.colors.primary,
    borderWidth: 2,
  },
  button: {
    backgroundColor: styleConstants.colors.white,
    width: styleConstants.gridGutterWidth * 5,
    borderRadius: styleConstants.gridGutterWidth,
    borderColor: styleConstants.colors.primary,
    borderWidth: 2,
    height: styleConstants.gridGutterWidth * 1.5,
    justifyContent: "center",
    marginHorizontal: styleConstants.padding.sm / 2
  },
  buttonText: {
    fontSize: styleConstants.fonts.md,
    color: styleConstants.colors.primary,
    textAlign: 'center'
  }
});
