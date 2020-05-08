import React, { useState } from "react";
import { AsyncStorage, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import * as ImagePicker from "expo-image-picker";
import AssetUtils from 'expo-asset-utils';
import * as styleConstants from '../utils/styles'
import FullWidthImage from 'react-native-fullwidth-image'
import { Routes, StorageTypes } from '../utils/enums';

const New = ({navigation}) => {
    const [image, setImage] = useState(null);
    const [showOptions, setShowOptions] = useState(false);

    async function storeDataToStorage(image) {
        try {
            /*     await AsyncStorage.removeItem(StorageTypes.GALLERY);
                 await AsyncStorage.removeItem(StorageTypes.EDITED_PHOTOS);
            */
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
                    setShowOptions(false);
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
                    setShowOptions(false);
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
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Icon
                    name="three-bars"
                    size={35}
                    color={styleConstants.colors.secondary}
                    onPress={() => navigation.toggleDrawer()}
                />
                <Icon
                    name="diff-added"
                    size={(showOptions || image) ? 35 : 70}
                    color={showOptions ? styleConstants.colors.primary : styleConstants.colors.secondary}
                    onPress={() => setShowOptions(!showOptions)}
                />
            </View>
            {showOptions &&
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => pickImageFromGallery()}>
                    <Text style={styles.buttonText}>Open gallery </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => pickImageFromCamera()}>
                    <Text style={styles.buttonText}>Open camera </Text>
                </TouchableOpacity>
            </View>
            }
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
        </ScrollView>
    );
};
export default New;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20
    },
    header: {justifyContent: 'space-between', flexDirection: 'row'},
    buttonContainer: {
        flexDirection: 'row',
        marginHorizontal: -3
    },
    image: {
        borderRadius: styleConstants.gridGutterWidth / 3,
        marginVertical: styleConstants.padding.lg,
        borderColor: styleConstants.colors.primary,
        borderWidth: 2,
    },
    button: {
        backgroundColor: styleConstants.colors.white,
        width: styleConstants.gridGutterWidth * 5,
        borderRadius: styleConstants.gridGutterWidth,
        borderColor: styleConstants.colors.primary,
        borderWidth: 2,
        paddingVertical: styleConstants.padding.sm,
        justifyContent: "center",
        marginHorizontal: styleConstants.padding.sm / 2
    },
    buttonText: {
        fontSize: styleConstants.fonts.md,
        color: styleConstants.colors.primary,
        textAlign: 'center'
    }
});
