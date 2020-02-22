import { RenderTarget } from "pixi.js";

/*
create on localStorage an 'current Edited Photo' key and always change that value,
according to what you select from new/gallery
make sure that when you do that, you remove that photo from gallery storage

on this component, extract that image and start editing it

after that, you have two options --create 2 buttons -- : 
- save it to gallery & remove from current Edited Photo
- don't save it: readd the unedited photo to gallery 
and also remove it from current Edited Photo

*/
import React, { useState } from "react";
import { AsyncStorage } from "react-native";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";

const EditPhoto = ({ navigation}) => {

    const [image, setImage] = useState(null);
    async function getCurrentImageFromStorage() {
      try {
        const value = await AsyncStorage.getItem("currentEditedImage");
        if (value !== null) {
          setImage(JSON.parse(value));
        }
      } catch (error) {
        console.log(error);
      }
    }

  return (
   
    <View style={styles.container}>
        <TouchableOpacity style={styles.to} onPress={() => getCurrentImageFromStorage()}>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      </TouchableOpacity>
    </View>
  );
};

export default EditPhoto;
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
  to: {
      height: 200,
      width: 200,
      backgroundColor: 'red'
  }
});
