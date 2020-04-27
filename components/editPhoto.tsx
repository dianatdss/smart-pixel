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

import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Slider } from "react-native";
import ExpoPixi, { PIXI } from "expo-pixi";
import Carousel from 'react-native-snap-carousel';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { filters } from '../utils/filters'
import * as styleConstants from '../utils/styles'
import { StorageTypes, Routes } from '../utils/enums';
import { AsyncStorage } from "react-native";

const EditPhoto = ({ route, navigation }) => {
  const { photo } = route.params;
  // for filters:
  const [index, setIndex] = useState(0);
  const [filter, setFilters] = useState(filters[0]);

  const [firstBulgeParameter, setFirstBulgeParameter] = useState(500);
  const [secondBulgeParameter, setSecondBulgeParameter] = useState(1);

  const [ref, setRef] = useState();
  const [carouselRef, setCarouselRef] = useState();

  function onPageSelected(value) {
    setFilters(filters[value].filter);
  };

  function setFilterImageRef(c) {
    setRef(c);
  }

  function changeValue(value) {

    switch (index) {

      case 1: {
        const colorMatrixFilter = new PIXI.filters.ColorMatrixFilter();

        colorMatrixFilter.contrast(value);
        setFilters(colorMatrixFilter);
        return;
      }
      case 2: {
        const colorMatrixFilter = new PIXI.filters.ColorMatrixFilter();

        colorMatrixFilter.brightness(value + 1);
        setFilters(colorMatrixFilter);
        return;
      }
      case 3: {
        const colorMatrixFilter = new PIXI.filters.ColorMatrixFilter();

        colorMatrixFilter.greyscale(value);
        setFilters(colorMatrixFilter);
        return;
      }
      case 4: {
        const colorMatrixFilter = new PIXI.filters.ColorMatrixFilter();

        colorMatrixFilter.hue(value * 360);
        setFilters(colorMatrixFilter);
        return;
      }
      case 6: {
        setFilters(new PIXI.filters.DotFilter(value));
        return;
      }
      case 7: {
        setFilters(new PIXI.filters.EmbossFilter(value * filters[index].multiplyValue + 1));

        return;
      }
      case 8: {
        setFilters(new PIXI.filters.PixelateFilter(value * filters[index].multiplyValue + 1));

        return;
      }
      case 10: {
        setFilters(new PIXI.filters.NoiseFilter(value));

        return;
      }
      case 13: {
        setFirstBulgeParameter(value * 500);
        console.log(firstBulgeParameter);
        console.log(secondBulgeParameter);

        setFilters(new PIXI.filters.BulgePinchFilter([0.5, 0.5], firstBulgeParameter, secondBulgeParameter));
        return;

      }
      case 15: {
        setFilters(new PIXI.filters.AdvancedBloomFilter({ "brightness": value * filters[index].multiplyValue }));
        return;
      }
      case 16: {
        setFilters(new PIXI.filters.BlurFilter(value * filters[index].multiplyValue + 1));
        return;
      }
      case 19: {
        setFilters(new PIXI.filters.ZoomBlurFilter(value * filters[index].multiplyValue));
        return;
      }
      default: return;
    }
  }

  function changeSecondValue(value) {
    switch (index) {
      case 13: {
        setSecondBulgeParameter(value);
        setFilters(new PIXI.filters.BulgePinchFilter([0.5, 0.5], firstBulgeParameter, secondBulgeParameter));
      }
      default: return;
    }
  }

  function navigateBackToGallery() {
    carouselRef.snapToItem(0);
    setIndex(0);
    setFilters(filters[0]);
    navigation.goBack();
  }

  async function storeDataToStorage(image) {
    try {
      let value = await AsyncStorage.getItem(StorageTypes.EDITED_PHOTOS);
      const newImage = JSON.stringify(image);

      value = value ? value.concat(",", newImage) : newImage;
      console.log('Edit=', value);
      await AsyncStorage.setItem(StorageTypes.EDITED_PHOTOS, value);
    } catch (error) {
      console.log(error);
    }
  }

  async function _saveToCameraRollAsync() {
    try {
      let result = await captureRef(ref, {
        format: 'png',
      });
      MediaLibrary.requestPermissionsAsync()
      await MediaLibrary.saveToLibraryAsync(result);
      await storeDataToStorage(result);
      navigateBackToGallery();
    }
    catch (snapshotError) {
      console.error(snapshotError);
    }
  };

  function snap() {
    setIndex(carouselRef.currentIndex);
    onPageSelected(carouselRef.currentIndex);
  }

  const _renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity style={styles.viewButton} >
          <Text style={styles.buttonText}>{item.name}  </Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.container}>

      <ExpoPixi.FilterImage
        source={photo}
        ref={(c) => setFilterImageRef(c)}
        style={styles.image}
        resizeMode={"cover"}
        filters={filter}
      />

      <Carousel
        ref={(c) => setCarouselRef(c)}
        data={filters}
        renderItem={_renderItem}
        sliderWidth={300}
        itemWidth={300}
        firstItem={1}

        containerCustomStyle={{ flexGrow: 0 }}
        onSnapToItem={() => snap()}
      />

      <View style={{ height: 60 }}>
        {filters[index].hasSlider &&
          <Slider
            style={{ width: "100%", height: 30 }}

            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor={styleConstants.colors.secondary}
            maximumTrackTintColor={styleConstants.colors.dark}
            thumbTintColor={styleConstants.colors.secondary}
            onValueChange={(value) => changeValue(value)}
          />}

        {filters[index].hasSecondSlider &&
          <Slider
            style={{ width: "100%", height: 30 }}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor={styleConstants.colors.secondary}
            maximumTrackTintColor={styleConstants.colors.dark}
            thumbTintColor={styleConstants.colors.secondary}
            onValueChange={(value) => changeSecondValue(value)}
          />}
      </View>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity style={styles.button} onPress={() => _saveToCameraRollAsync()} >
          <Text style={styles.buttonText}>Save  </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigateBackToGallery()} >
          <Text style={styles.buttonText}>Back  </Text>
        </TouchableOpacity>
      </View>

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
    height: 200
  },
  viewButton: {
    backgroundColor: styleConstants.colors.white,
    borderRadius: styleConstants.gridGutterWidth,
    borderColor: styleConstants.colors.primary,
    borderWidth: 2,
    paddingVertical: styleConstants.gridGutterWidth / 3,
    marginVertical: styleConstants.gridGutterWidth / 3,
    justifyContent: "center"
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