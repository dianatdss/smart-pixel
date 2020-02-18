import React, { useState } from "react";

import { Text, View, Button } from "react-native";

const New = ({ navigation }) => {

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Page New</Text>
      <Button
        title="Open drawer"
        onPress={() => navigation.toggleDrawer()}
      />
    </View>
  );
};
export default New;
