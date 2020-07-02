import React, { useState } from "react";
import { AsyncStorage, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import AssetUtils from 'expo-asset-utils';
import * as styleConstants from '../utils/styles'
import { colors } from '../utils/styles'
import ExpoPixi, { PIXI } from "expo-pixi";
import { Routes, StorageTypes } from '../utils/enums';
import UIStepper from 'react-native-ui-stepper';
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from 'expo-media-library';

// TODO: add reset button
const Personalize = ({navigation}) => {
    const [image, setImage] = useState(null);
    const [filteredImage, setFilteredImage] = useState(null);
    const [filter, setFilter] = useState(null);
    const [showOptions, setShowOptions] = useState(false);

    // used to save the photo
    const [ref, setRef] = useState();

    const [update, setUpdate] = useState(1);

    const [matrix, setMatrixState] = useState([1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]);

    async function storeDataToStorage(image, key) {
        try {
            /*     await AsyncStorage.removeItem(StorageTypes.GALLERY);
                 await AsyncStorage.removeItem(StorageTypes.EDITED_PHOTOS);
            */
            let storedValue = await AsyncStorage.getItem(key);
            const newImage = JSON.stringify(image);
            let result = storedValue ? storedValue.concat(",").concat(newImage) : newImage;
            await AsyncStorage.setItem(key, result);

        } catch (error) {
            console.log(error);
        }
    };

    function setFilterImageRef(c) {
        setRef(c);
    }

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
                    // @ts-ignore
                    await storeDataToStorage(result.uri, StorageTypes.GALLERY);

                    await convertImageToFilteredImage(result);
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
                    await storeDataToStorage(result.uri, StorageTypes.GALLERY);
                    await convertImageToFilteredImage(result);
                    setShowOptions(false);
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    async function convertImageToFilteredImage(img) {
        if (img) {
            try {
                AssetUtils.fromUriAsync(img.uri).then(fromUri => {
                    fromUri.localUri = fromUri.uri;
                    AssetUtils.resolveAsync(fromUri).then(uriResolved => {
                        setFilteredImage(uriResolved);
                    });
                });
            } catch (error) {
                console.log(error);
            }
        }
    }

    async function _saveToCameraRollAsync() {
        try {
            let result = await captureRef(ref, {
                format: 'png',
            });

            // TODO: refactor permission
            MediaLibrary.requestPermissionsAsync();
            await MediaLibrary.saveToLibraryAsync(result);
            await storeDataToStorage(result, StorageTypes.EDITED_PHOTOS);
             navigateToStudio();
        } catch (snapshotError) {
            console.error(snapshotError);
        }
    };

    function navigateToStudio() {
        setMatrixState([1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]);
        setImage(null);
        setFilteredImage(null);
        setFilter(null);
        navigation.navigate(Routes.EDITED_GALLERY);

    }
    function updateMatrix(value, index) {
        console.log(value)
        matrix[index] = value;
        setMatrixState(matrix);
        setUpdate(update + 1);

        const localFilter = new PIXI.filters.ColorMatrixFilter();
        localFilter._loadMatrix(matrix);

        setFilter(localFilter);
    }

    function resetMatrix() {
        setMatrixState([1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]);
        setUpdate(0);
        setTimeout( () => setUpdate(1), 50);
        const localFilter = new PIXI.filters.ColorMatrixFilter();
        localFilter._loadMatrix([1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]);
        setFilter(localFilter);
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
                </View>


                {filteredImage && (
                    <View style={styles.imageContainer}>
                        <ExpoPixi.FilterImage
                            source={filteredImage}
                            ref={(c) => setFilterImageRef(c)}
                            style={styles.image}
                            resizeMode={"cover"}
                            filters={filter}
                        />
                        <View style={styles.matrix}>

                            {update > 0 && matrix && matrix.map((item, index) => {
                                return (
                                    <View style={styles.matrixItem} key={index}>
                                        <UIStepper
                                            onValueChange={(value) => updateMatrix(value / 10, index)}
                                            steps={1}
                                            initialValue={ index % 6 == 0 ? 10 : 0}
                                            minimumValue={0}
                                            maximumValue={20}
                                            width={60}
                                            height={30}
                                            tintColor={colors.primary}
                                            borderColor={colors.primary}
                                        />
                                        <Text style={styles.value}> {item} </Text>
                                    </View>);
                            })}
                        </View>

                        <View style={styles.btnContainer}>
                            <TouchableOpacity style={styles.button} onPress={() => _saveToCameraRollAsync()}>
                                <Text style={styles.buttonText}>Save </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => resetMatrix()}>
                                <Text style={styles.buttonText}>Reset </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                )}
            </View>
        </ScrollView>
    );
};
export default Personalize;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginTop: styleConstants.padding.lg,

    },
    header: {
        position: 'relative',
        justifyContent: 'flex-end',
        flexDirection: 'column',
        alignItems: 'flex-end',
        zIndex: 5,
        overflow: 'visible'
    },
    buttonContainer: {

    },
    // image: {
    //     borderRadius: styleConstants.borderRadius,
    //     marginVertical: styleConstants.padding.lg,
    //     borderColor: styleConstants.colors.primary,
    //     borderWidth: 2,
    // },
    imageContainer: {
        alignItems: 'center'
    },
    image: {
        flex: 1,
        height: 300,
        width: 300
    },
    button: {
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
    matrix: {
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
    matrixItem: {
        textAlign: 'center',
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: styleConstants.padding.sm
    },
    value: {
        color: styleConstants.colors.primary,
        fontSize: styleConstants.fonts.md,
    },
    btnContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});
