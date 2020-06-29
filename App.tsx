import "react-native-gesture-handler";
import React, { Component } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Gallery from './screens/gallery';
import New from './screens/new';
import EditPhoto from './screens/editPhoto';
import EditedGallery from "./screens/editedGallery";
import Personalize from "./screens/personalize";
import { Routes } from './utils/enums';
import { colors } from './utils/styles';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MyTheme = {
  dark: false,
  colors: {
    primary: colors.secondary,
    text: colors.secondary,
    card: colors.dark,
    border: colors.secondary,
    background: colors.dark
  },
};

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

    return (
      <NavigationContainer theme={MyTheme}>
        <Tab.Navigator initialRouteName={Routes.NEW}>
          <Tab.Screen
              name={Routes.NEW}
              component={NewStack}
              options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="home" color={color} size={size} />
                ),
              }}
          />
          <Tab.Screen
              name={Routes.GALLERY}
              component={GalleryStack}
              options={{
                tabBarLabel: 'Gallery',
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="image-multiple" color={color} size={size} />
                ),
              }}
          />
          <Tab.Screen
              name={Routes.EDITED_GALLERY}
              component={EditedGalleryStack}
              options={{
                tabBarLabel: 'Studio',
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="auto-fix" color={color} size={size} />
                ),
              }}
          />
          <Tab.Screen
              name={Routes.PERSONALIZE}
              component={Personalize}
              options={{
                tabBarLabel: 'Personalize',
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="image-filter-vintage" color={color} size={size} />
                ),
              }}
          />
        </Tab.Navigator>
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
      // @ts-ignore
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
