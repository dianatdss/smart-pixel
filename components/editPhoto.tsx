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
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import ExpoPixi, { PIXI } from "expo-pixi";
import ViewPager from '@react-native-community/viewpager';


const filters = [
  {},
  new PIXI.filters.ColorReplaceFilter(0x000000, 0xff0000),
  new PIXI.filters.DotFilter(0.5),
  new PIXI.filters.EmbossFilter(),
  new PIXI.filters.PixelateFilter(),
  new PIXI.filters.CrossHatchFilter(),
  new PIXI.filters.NoiseFilter(),
  new PIXI.filters.OldFilmFilter(),
  new PIXI.filters.RGBSplitFilter(),

  new PIXI.filters.GlowFilter(30, 2, 0.5, 0xff0000),
  new PIXI.filters.BulgePinchFilter([0.5, 0.2], 300, 1),
  new PIXI.filters.MotionBlurFilter([54, 40], 15, 0),
  new PIXI.filters.DropShadowFilter(),
  new PIXI.filters.AdvancedBloomFilter(),
  new PIXI.filters.BlurFilter(),
  new PIXI.filters.TwistFilter(400, 4, 20),
  new PIXI.filters.BloomFilter(),
  new PIXI.filters.OutlineFilter(20, 0x00fc00, 1),
  new PIXI.filters.ZoomBlurFilter()

  // new PIXI.filters.AlphaFilter(),
  // new PIXI.filters.AsciiFilter(),
  // new PIXI.filters.ConvolutionFilter(),
  // new PIXI.filters.DisplacementFilter(),
  // new PIXI.filters.TiltShiftFilter(),
  // new PIXI.filters.GodrayFilter(),
  // new PIXI.filters.SimpleLightmapFilter(),
  // new PIXI.filters.MultiColorReplaceFilter(),
  // new PIXI.filters.ShockwaveFilter(),
];

const EditPhoto = ({ route, navigation }) => {
  const { photo } = route.params;
  const [image, setImage] = useState(null);

  // for filters:
  const [index, setIndex] = useState(0);
  const [filter, setFilters] = useState(filters[0]);

  function onPageSelected (e)  {
    setIndex(e.nativeEvent.position);
    setFilters(filters[index]);
  };

  return (
    <View style={styles.container}>
 
      <ExpoPixi.FilterImage
        source={photo}
        style={styles.image}
        resizeMode={"contain"}
        filters={filter}
      />
   <ViewPager pageMargin={10} onPageSelected={ (event) => onPageSelected(event)} style={styles.viewPager} initialPage={0}>
      <View style={styles.viewPage} key="1">
        <Text>First page</Text>
      </View>
      <View style={styles.viewPage} key="2">
        <Text>Second page</Text>
      </View>
      
      <View style={styles.viewPage} key="3">
        <Text>3 page</Text>
      </View>
      
      <View style={styles.viewPage} key="4">
        <Text>4 page</Text>
      </View>
      
      <View style={styles.viewPage} key="5">
        <Text>5 page</Text>
      </View>
    </ViewPager>

    </View>
  );
};

export default EditPhoto;
const styles = StyleSheet.create({
  container: {
    marginVertical: 30,
    marginHorizontal: 20,
    flex: 1,
    backgroundColor: "gray"
  },
  touchable: {
    height: 50,
    width: "100%",
    backgroundColor: "green",
    justifyContent: "center"
  },
  image: {
    width: '100%',
    height: '100%',
    flex: 1,
    backgroundColor: 'white',
  },
  viewPager: {
    height: 50,
    
  },
  viewPage: {
    backgroundColor: 'red'
  }
});