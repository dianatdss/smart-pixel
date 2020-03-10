import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
  FlatList, SafeAreaView
} from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import { AsyncStorage } from "react-native";
import AssetUtils from 'expo-asset-utils'
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
      <Button title="Get data" onPress={() => getDataFromStorage()} />

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
    marginVertical: 30,
    marginHorizontal: 20
  },
  image: {
    borderRadius: 10,
    width: 140,
    height: 140,
    margin: 10
  }
});
