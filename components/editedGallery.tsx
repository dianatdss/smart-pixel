import React, { useState, useLayoutEffect, useEffect } from "react";
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Text,
    FlatList
} from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import { AsyncStorage } from "react-native";
import AssetUtils from 'expo-asset-utils';
import * as styleConstants from '../utils/styles'
import { useIsFocused } from '@react-navigation/native';
import { StorageTypes, Routes } from '../utils/enums';
import * as Sharing from 'expo-sharing';

const EditedGallery = ({ navigation }) => {
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
            const value = await AsyncStorage.getItem(StorageTypes.EDITED_PHOTOS);

            if (value !== null) {
                let newValue = value.split(",").map(item => JSON.parse(item)).filter(item => item !== null);
                setImages(newValue);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function deletePhoto(image) {
        try {
            const value = await AsyncStorage.getItem(StorageTypes.EDITED_PHOTOS);

            if (value !== null) {
                let newValue = value.split(",").map(item => JSON.parse(item)).filter(item => item !== image);
                setImages(newValue);
                AsyncStorage.setItem(StorageTypes.EDITED_PHOTOS, JSON.stringify(newValue));
                setSelectedImage(null);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function redirectToEditPhoto(image) {

        try {
            AssetUtils.fromUriAsync(image).then(fromUri => {
                fromUri.localUri = fromUri.uri;
                AssetUtils.resolveAsync(fromUri).then(uriResolved => {
                    navigation.navigate(Routes.EDIT, { photo: uriResolved, indexParam: 0 })
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

    return (
        <View style={styles.container}>
            <Icon
                name="three-bars"
                size={35}
                color={styleConstants.colors.secondary}
                onPress={() => navigation.toggleDrawer()}
            />
            <FlatList
                data={images}
                numColumns={2}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => { setSelectedImage(item) }}>
                        <Image source={{ uri: item }}
                        style={[styles.image, item == selectedImage ? styles.selectedImage : {}]}
                            overlayColor={'#fff'} resizeMode={'contain'} />
                    </TouchableOpacity>
                )}

                keyExtractor={(item, index) => index.toString()}
            />
            {selectedImage &&
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => redirectToEditPhoto(selectedImage)} >
                        <Text style={styles.buttonText}>Edit photo </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => deletePhoto(selectedImage)} >
                        <Text style={styles.buttonText}>Delete photo  </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => sharePhoto()} >
                        <Text style={styles.buttonText}>Share photo  </Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    );
};
export default EditedGallery;

const styles = StyleSheet.create({
    container: {
        marginVertical: styleConstants.padding.lg,
        marginHorizontal: styleConstants.padding.sm
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    image: {
        borderRadius: styleConstants.gridGutterWidth / 3,
        width: (styleConstants.dimensions.fullWidth - 60) / 2,
        height: styleConstants.dimensions.fullWidth / 2,
        margin: styleConstants.padding.sm,
        borderWidth: 2,
        borderColor: styleConstants.colors.primary
    },
    selectedImage: {
        borderColor: styleConstants.colors.secondary
    },
    button: {
        backgroundColor: styleConstants.colors.white,
        width: styleConstants.gridGutterWidth * 3,
        borderRadius: styleConstants.gridGutterWidth,
        borderColor: styleConstants.colors.primary,
        borderWidth: 2,
        height: styleConstants.gridGutterWidth * 1.5,
        justifyContent: "center"
    },
    buttonText: {
        fontSize: styleConstants.fonts.md,
        color: styleConstants.colors.primary,
        textAlign: 'center'
    }
});
