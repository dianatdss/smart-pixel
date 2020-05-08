import React, { useLayoutEffect, useState } from "react";
import { AsyncStorage, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import AssetUtils from 'expo-asset-utils';
import * as styleConstants from '../utils/styles'
import { useIsFocused } from '@react-navigation/native';
import { Routes, StorageTypes } from '../utils/enums';
import * as Sharing from 'expo-sharing';

const EditedGallery = ({navigation}) => {
    const [images, setImages] = useState([]);
    const isFocused = useIsFocused();
    const [selectedImage, setSelectedImage] = useState(null);
    useLayoutEffect(() => {
        async function asyncGetDataFromStorage() {
            await getDataFromStorage();
        }

        asyncGetDataFromStorage();
    }, [isFocused]);

    async function getDataFromStorage() {

        try {
            var value = await AsyncStorage.getItem(StorageTypes.EDITED_PHOTOS);
            if (value !== null) {
                let newValue = value.split(",").map(item => JSON.parse(item))
                    .filter(item => item !== null);
                setImages(newValue);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function deletePhoto() {
        try {
            let img = images.filter(item => item !== selectedImage);
            setImages(img);
            let string = img.length ? JSON.stringify(img) : null;
            string = string.substring(1, (string.length - 1));
            await AsyncStorage.setItem(StorageTypes.EDITED_PHOTOS, string);
            setSelectedImage(null);
        } catch (error) {
            console.log(error);
        }
    }

    async function redirectToEditPhoto() {

        try {
            AssetUtils.fromUriAsync(selectedImage).then(fromUri => {
                fromUri.localUri = fromUri.uri;
                AssetUtils.resolveAsync(fromUri).then(uriResolved => {
                    navigation.navigate(Routes.EDITED_GALLERY_EDIT, {photo: uriResolved, indexParam: 0})
                });
            });
        } catch (error) {
            console.log(error);
        }
    }

    async function sharePhoto() {
        try {
            Sharing.shareAsync(selectedImage);
        } catch (error) {
            console.log(error);
        }
    }

    async function deleteAll() {
        await AsyncStorage.removeItem(StorageTypes.EDITED_PHOTOS);
        setSelectedImage(null);
        setImages([]);
    }

    return (
        <View style={styles.container}>
            <View style={styles.c1}>
                <View style={styles.header}>
                    <Icon
                        name="three-bars"
                        size={35}
                        color={styleConstants.colors.secondary}
                        onPress={() => navigation.toggleDrawer()}
                    />
                    <View style={styles.headerRight}>
                        <Text style={styles.headerRightText}>Remove
                            all</Text>
                        <Icon
                            name="trashcan"
                            size={35}
                            color={styleConstants.colors.secondary}
                            onPress={() => deleteAll()}
                        />
                    </View>
                </View>
                <FlatList
                    style={styles.flatList}
                    data={images}
                    numColumns={2}
                    renderItem={({item}) => (
                        <TouchableOpacity onPress={() => {
                            setSelectedImage(item)
                        }}>
                            <Image source={{uri: item}}
                                   overlayColor={'#000'}
                                   style={[styles.image, item == selectedImage ? styles.selectedImage : {}]}
                                   resizeMode={'contain'}/>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>

            <View style={styles.c2}>
                {selectedImage &&
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => redirectToEditPhoto()}>
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => deletePhoto()}>
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => sharePhoto()}>
                        <Text style={styles.buttonText}>Share</Text>
                    </TouchableOpacity>
                </View>
                }
            </View>
        </View>

    );
};
export default EditedGallery;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: styleConstants.padding.sm,
        flex: 1
    },
    header: {justifyContent: 'space-between', flexDirection: 'row'},
    headerRight: {flexDirection: 'row', alignItems: 'center'},
    headerRightText: {fontSize: 16, color: styleConstants.colors.secondary, paddingRight: 10},
    c1: {
        flex: .9
    },
    c2: {
        flex: .1
    },
    flatList: {
        marginHorizontal: -styleConstants.padding.sm
    },
    image: {
        borderRadius: styleConstants.gridGutterWidth / 3,
        width: (styleConstants.dimensions.fullWidth - 40) / 2,
        height: styleConstants.dimensions.fullWidth / 2,
        margin: styleConstants.padding.sm,
        borderWidth: 2,
        borderColor: styleConstants.colors.primary
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: styleConstants.colors.white,
        width: styleConstants.gridGutterWidth * 3.5,
        borderRadius: styleConstants.gridGutterWidth,
        borderColor: styleConstants.colors.primary,
        borderWidth: 2,
        height: styleConstants.gridGutterWidth * 1.5,
        justifyContent: "center",
        padding: styleConstants.gridGutterWidth / 2,
    },
    buttonText: {
        fontSize: styleConstants.fonts.md,
        color: styleConstants.colors.primary,
        textAlign: 'center'
    },
    selectedImage: {
        borderColor: styleConstants.colors.secondary
    },
});
