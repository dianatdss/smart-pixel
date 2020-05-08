import React, { useState, useLayoutEffect, useEffect } from "react";
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList, Text
} from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import { AsyncStorage } from "react-native";
import AssetUtils from 'expo-asset-utils';
import * as styleConstants from '../utils/styles'
import { useIsFocused } from '@react-navigation/native';
import { StorageTypes, Routes } from '../utils/enums';

const Gallery = ({navigation}) => {
    const [images, setImages] = useState([]);
    const isFocused = useIsFocused();

    useLayoutEffect(() => {
        async function asyncGetDataFromStorage() {
            await getDataFromStorage();
        }

        asyncGetDataFromStorage();
    }, [isFocused]);

    async function getDataFromStorage() {
        try {

            var value = await AsyncStorage.getItem(StorageTypes.GALLERY);
            if (value !== null) {
                let newValue = value.split(",").map(item => JSON.parse(item))
                    .filter(item => item !== null);
                setImages(newValue);

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
                    navigation.navigate(Routes.GALLERY_EDIT, {photo: uriResolved, indexParam: 0})
                });
            });
        } catch (error) {
            console.log(error);
        }
    }

    async function deleteAll() {
        await AsyncStorage.removeItem(StorageTypes.GALLERY);
        setImages([]);
    }

    return (
        <View style={styles.container}>
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
                    <TouchableOpacity onPress={() => redirectToEditPhoto(item)}>
                        <Image source={{uri: item}} style={styles.image} overlayColor={'#000'} resizeMode={'contain'}/>
                    </TouchableOpacity>
                )}

                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};
export default Gallery;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: styleConstants.padding.sm,
        flex: 1
    },

    flatList: {
        marginHorizontal: -styleConstants.padding.sm
    },

    header: {justifyContent: 'space-between', flexDirection: 'row'},
    headerRight: {flexDirection: 'row', alignItems: 'center'},
    headerRightText: {fontSize: 16, color: styleConstants.colors.secondary, paddingRight: 10},
    image: {
        borderRadius: styleConstants.gridGutterWidth / 3,
        width: (styleConstants.dimensions.fullWidth - 40) / 2,
        height: styleConstants.dimensions.fullWidth / 2,
        margin: styleConstants.padding.sm,
        borderWidth: 2,
        borderColor: styleConstants.colors.primary
    },
    button: {
        backgroundColor: styleConstants.colors.white,
        width: styleConstants.gridGutterWidth * 5,
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
