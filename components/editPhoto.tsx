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
import { View, StyleSheet, TouchableOpacity, Text, Slider } from "react-native";
import ExpoPixi from "expo-pixi";
import ViewPager from '@react-native-community/viewpager';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { filters } from '../utils/filters'
import * as styleConstants from '../utils/styles'

const EditPhoto = ({ route, navigation }) => {
  const { photo } = route.params;
  const [image, setImage] = useState(null);

  // for filters:
  const [index, setIndex] = useState(0);
  const [filter, setFilters] = useState(filters[0]);

  const [ref, setRef] = useState();
  function onPageSelected(e) {
    setIndex(e.nativeEvent.position);
    setFilters(filters[e.nativeEvent.position].filter);
  };

  function setFilterImageRef(c) {
    setRef(c);
  }


  async function _saveToCameraRollAsync() {
    try {
      let result = await captureRef(ref, {
        format: 'png',
      });
      MediaLibrary.requestPermissionsAsync()
      await MediaLibrary.saveToLibraryAsync(result);
    }
    catch (snapshotError) {
      console.error(snapshotError);
    }
  };

  return (
    <View style={styles.container}>

      <ExpoPixi.FilterImage
        source={photo}
        ref={(c) => setFilterImageRef(c)}
        style={styles.image}
        resizeMode={"contain"}
        filters={filter}
      />

      <ViewPager pageMargin={10} onPageSelected={(event) => onPageSelected(event)} style={styles.viewPager} initialPage={0}>
        {filters.map((item, key) => (
          <TouchableOpacity style={styles.viewButton} key={key}>
            <Text key={key + 'a'} style={styles.buttonText}>{item.name}  </Text>
          </TouchableOpacity>
        )
        )}
      </ViewPager>
      <TouchableOpacity style={styles.button} onPress={() => _saveToCameraRollAsync()} >
        <Text style={styles.buttonText}>Save  </Text>
      </TouchableOpacity>
      <Slider
        style={{ width: "100%", height: 60 }}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor={styleConstants.colors.secondary}
        thumbTintColor={styleConstants.colors.secondary}
        maximumTrackTintColor="#000000"
      />
    </View>
  );
};

export default EditPhoto;
const styles = StyleSheet.create({
  container: {
    marginVertical: styleConstants.padding.lg,
    marginHorizontal: styleConstants.padding.md,
    flex: 1,
  },
  image: {
    flex: 1,
  },
  viewPager: {
    height: styleConstants.padding.md * 2,

  },
  viewButton: {
    backgroundColor: styleConstants.colors.white,
    borderRadius: styleConstants.gridGutterWidth,
    borderColor: styleConstants.colors.primary,
    borderWidth: 2,
    height: styleConstants.gridGutterWidth * 1.5,
    justifyContent: "center"
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