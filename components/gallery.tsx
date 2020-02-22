import React, { useState } from "react";
import { View, StyleSheet, Button, Image } from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import { AsyncStorage } from "react-native";

const Gallery = ({ navigation }) => {

  const [images, setImages] = useState([]);
  async function getDataFromStorage() {
    try {
      const value = await AsyncStorage.getItem("gallery");
      if (value !== null) {
        setImages(value.split(",").map(item => JSON.parse(item)));
      }
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

      {images &&
        images.map(imageItem => (
          <Image source={{ uri: imageItem }} style={styles.image} />
        ))}
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
    borderRadius: 30,
    width: 50,
    height: 50
  }
});
