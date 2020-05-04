import React, { useState } from "react";
import { AsyncStorage } from "react-native";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import * as ImagePicker from "expo-image-picker";
import AssetUtils from 'expo-asset-utils';
import * as styleConstants from '../utils/styles'
import FullWidthImage from 'react-native-fullwidth-image'
import { StorageTypes, Routes } from '../utils/enums';

const New = ({navigation}) => {
    const [image, setImage] = useState(null);

    async function storeDataToStorage(image) {
        try {
            // await AsyncStorage.removeItem(StorageTypes.GALLERY);
            let storedValue = await AsyncStorage.getItem(StorageTypes.GALLERY);
            const newImage = JSON.stringify(image);
            let result = storedValue ? storedValue.concat(",").concat(newImage) : newImage;
            await AsyncStorage.setItem(StorageTypes.GALLERY, result);

        } catch (error) {
            console.log(error);
        }
    };

    async function pickImageFromGallery() {
        try {
            let permission = await ImagePicker.getCameraRollPermissionsAsync();

            if (permission.granted == false) {
                ImagePicker.requestCameraRollPermissionsAsync();
                permission = await ImagePicker.getCameraRollPermissionsAsync();
            }

            if (permission.granted == true) {
                let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    quality: 1
                });

                if (!result.cancelled) {
                    setImage(result);
                    storeDataToStorage(result.uri);
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    async function pickImageFromCamera() {

        try {
            let permission = await ImagePicker.getCameraPermissionsAsync();

            if (permission.granted == false) {
                ImagePicker.requestCameraPermissionsAsync();
                permission = await ImagePicker.getCameraPermissionsAsync();
            }

            if (permission.granted == true) {
                let result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    quality: 1
                });

                if (!result.cancelled) {
                    setImage(result);
                    storeDataToStorage(result.uri);
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    async function redirectToEditPhoto() {

        try {
            AssetUtils.fromUriAsync(image.uri).then(fromUri => {
                fromUri.localUri = fromUri.uri;
                AssetUtils.resolveAsync(fromUri).then(uriResolved => {
                    navigation.navigate(Routes.NEW_EDIT, {photo: uriResolved})
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
                size={35}
                color={styleConstants.colors.secondary}
                onPress={() => navigation.toggleDrawer()}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => pickImageFromGallery()}>
                    <Text style={styles.buttonText}>Import from gallery </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => pickImageFromCamera()}>
                    <Text style={styles.buttonText}>Import from camera </Text>
                </TouchableOpacity>
            </View>

            {image && (
                <TouchableOpacity onPress={() => redirectToEditPhoto()}>
                    <FullWidthImage
                        overlayColor={'#fff'}
                        resizeMode={'contain'}
                        style={styles.image}
                        source={{uri: image.uri}}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};
export default New;

const styles = StyleSheet.create({
    container: {
        marginVertical: 30,
        marginHorizontal: 20
    },
    buttonContainer: {
        flexDirection: 'row',
        marginHorizontal: -3
    },
    image: {
        borderRadius: styleConstants.gridGutterWidth / 3,
        marginVertical: styleConstants.padding.md,
        borderColor: styleConstants.colors.primary,
        borderWidth: 2,
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
