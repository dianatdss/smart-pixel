import React, { useState } from "react";
import { AsyncStorage, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
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
                    // @ts-ignore
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
                    // @ts-ignore
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
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.header}>

                    <TouchableOpacity onPress={() => setShowOptions(!showOptions)}>
                        <Icon
                            name="add-box"
                            size={(showOptions || image) ? 35 : 70}
                            color={showOptions ? styleConstants.colors.primary : styleConstants.colors.secondary}
                        />
                    </TouchableOpacity>
                </View>
                {showOptions &&
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => pickImageFromGallery()}>
                        <Icon
                            name="image"
                            size={70}
                            color={styleConstants.colors.primary}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => pickImageFromCamera()}>
                        <Icon
                            name="add-a-photo"
                            size={70}
                            color={styleConstants.colors.primary}
                        />
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
            </View>
        </ScrollView>
    );
};
export default New;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20
    },
    header: {justifyContent: 'flex-end', flexDirection: 'row'},
    buttonContainer: {
        marginHorizontal: -3,
        alignItems: 'flex-end',
    },
    image: {
        borderRadius: styleConstants.borderRadius,
        marginVertical: styleConstants.padding.lg,
        borderColor: styleConstants.colors.primary,
        borderWidth: 2,
    },
    button: {
        backgroundColor: styleConstants.colors.white,
        width: styleConstants.gridGutterWidth * 5,
        borderRadius: styleConstants.borderRadius,
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
    },
    icon: {
        borderWidth: 1,
        borderColor: styleConstants.colors.primary,
        padding: styleConstants.gridGutterWidth / 3,
        borderRadius: styleConstants.borderRadius
    },
});
