import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  FlatList, SafeAreaView
} from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import { AsyncStorage } from "react-native";
import AssetUtils from 'expo-asset-utils';
import * as styleConstants from '../utils/styles'

const Gallery = ({ navigation }) => {
  const [images, setImages] = useState([]);

  async function getDataFromStorage() {
    try {
      const value = await AsyncStorage.getItem("gallery");
      
      if (value !== null) {
        let newValue = value.split(",").map(item => JSON.parse(item)).filter(item => item !== null);
        setImages(newValue);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function redirectToEditPhoto(image) {

    try {
      AssetUtils.fromUriAsync(image).then(fromUri => {
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
      <TouchableOpacity style={styles.button} onPress={() => getDataFromStorage()} >
      <Text style={styles.buttonText}>Get data  </Text>
      </TouchableOpacity>
      <FlatList
        data={images}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={ () => redirectToEditPhoto(item)}>
            <Image source={{ uri: item }} style={styles.image} />
          </TouchableOpacity>
        )}
        
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};
export default Gallery;

const styles = StyleSheet.create({
  container: {
    marginVertical: styleConstants.padding.lg,
    marginHorizontal: styleConstants.padding.sm
  },
  image: {
    borderRadius: styleConstants.gridGutterWidth / 3,
    width: (styleConstants.dimensions.fullWidth - 60) / 2,
    height: styleConstants.dimensions.fullWidth / 2,
    margin: styleConstants.padding.sm,
    borderWidth: 2,
    borderColor: styleConstants.colors.primary
  },
  button: {
    backgroundColor: styleConstants.colors.white,
    width: styleConstants.gridGutterWidth * 5,
    borderRadius: styleConstants.gridGutterWidth,
    borderColor: styleConstants.colors.primary,
    borderWidth: 2,
    height: styleConstants.gridGutterWidth * 1.5,
    justifyContent: "center"
  },
  buttonText: {
    fontSize: styleConstants.fonts.md,
    color: styleConstants.colors.primary,
    textAlign: 'center'
  }
});
