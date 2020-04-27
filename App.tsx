import "react-native-gesture-handler";
import React, { Component } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import Gallery from './components/gallery';
import New from './components/new';
import EditPhoto from './components/editPhoto';
import EditedGallery from "./components/editedGallery";
import { Routes }from './utils/enums';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

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
        <Drawer.Navigator initialRouteName={Routes.GALLERY}>
          <Drawer.Screen name={Routes.GALLERY} component={GalleryStack} />
          <Drawer.Screen name={Routes.EDITED_GALLERY} component={EditedGalleryStack} />
          <Drawer.Screen name={Routes.NEW} component={NewStack} />
        </Drawer.Navigator>
      </NavigationContainer>

    );
  }
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}


function GalleryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen  name={Routes.GALLERY_MAIN} component={Gallery} />
      <Stack.Screen name={Routes.GALLERY_EDIT} component={EditPhoto} />
    </Stack.Navigator>
  );
}


function EditedGalleryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen  name={Routes.EDITED_GALLERY_MAIN} component={EditedGallery} />
      <Stack.Screen name={Routes.EDITED_GALLERY_EDIT} component={EditPhoto} />
    </Stack.Navigator>
  );
}


function NewStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen  name={Routes.NEW_MAIN} component={New} />
      <Stack.Screen name={Routes.NEW_EDIT} component={EditPhoto} />
    </Stack.Navigator>
  );
}