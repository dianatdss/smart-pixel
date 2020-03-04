import "react-native-gesture-handler";
import React, { Component } from "react";
import ExpoPixi, { PIXI } from "expo-pixi";
import { NavigationContainer } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  PixelRatio
} from "react-native";
import { createDrawerNavigator } from '@react-navigation/drawer';
import Gallery from './components/gallery';
import New from './components/new';

import EditPhoto from './components/editPhoto';
const Drawer = createDrawerNavigator();
const { width, height } = Dimensions.get("window");
const scale = PixelRatio.get();

const colorMatrix = [
  { name: "reset" },
  {
    name: "brightness",
    tools: [{ type: "number", min: 0, max: 1, standard: 0.3 }]
  },
  {
    name: "greyscale",
    tools: [{ type: "number", min: 0, max: 1, standard: 0.6 }]
  },
  { name: "blackAndWhite" },
  { name: "hue", tools: [{ type: "number", min: 0, max: 360, standard: 180 }] },
  {
    name: "contrast",
    tools: [{ type: "number", min: 0, max: 1, standard: 0.8 }]
  },
  {
    name: "saturate",
    tools: [{ type: "number", min: 0, max: 1, standard: 0.8 }]
  },
  { name: "desaturate" },
  { name: "negative" },
  { name: "sepia" },
  { name: "technicolor", tools: [{ type: "boolean", standard: true }] },
  { name: "polaroid" },
  { name: "toBGR" },
  { name: "kodachrome", tools: [{ type: "boolean", standard: true }] },
  { name: "browni", tools: [{ type: "boolean", standard: true }] },
  { name: "vintage", tools: [{ type: "boolean", standard: true }] },
  {
    name: "colorTone",
    tools: [
      { type: "number", min: 0, max: 1, standard: 0.5 },
      { type: "number", min: 0, max: 1, standard: 0.5 },
      { type: "color", standard: 0xff0000 },
      { type: "color", standard: 0x000011 }
    ]
  },
  { name: "night", tools: [{ type: "number", min: 0, max: 1, standard: 0.5 }] },
  {
    name: "predator",
    tools: [{ type: "number", min: 0, max: 1, standard: 0.5 }]
  },
  { name: "lsd" }
];

export default class HelloWorldApp extends Component {
  state = {
    index: 0,
    filters: 0
  };

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {

    // to hide ÉditPhoto menu option
    return (
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Gallery">
          <Drawer.Screen name="Gallery" component={Gallery} />
          <Drawer.Screen name="New" component={New} />
          <Drawer.Screen name="Edit" component={EditPhoto} />
        </Drawer.Navigator>
      </NavigationContainer>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "orange"
  },
  touchable: {
    flex: 1,
    backgroundColor: "green"
  },
  image: {
    width: "100%",
    height: "100%",
    flex: 1,
    backgroundColor: "white"
  }
});

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
   // console.log(error, info);
  }
  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
