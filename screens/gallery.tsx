import React, { useLayoutEffect, useState } from "react";
import { AsyncStorage, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AssetUtils from 'expo-asset-utils';
import * as styleConstants from '../utils/styles'
import { useIsFocused } from '@react-navigation/native';
import { Routes, StorageTypes } from '../utils/enums';

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
                <View style={styles.headerRight}>
                    <Text style={styles.headerRightText}>Remove
                        all</Text>
                    <TouchableOpacity onPress={() => deleteAll()}>
                        <Icon
                            name="delete"
                            size={35}
                            color={styleConstants.colors.secondary}
                        />
                    </TouchableOpacity>

                </View>
            </View>
            <FlatList
                style={styles.flatList}
                data={images}
                numColumns={2}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                    <TouchableOpacity onPress={() => redirectToEditPhoto(item)}>
                        <Image source={{uri: item}} style={styles.image} overlayColor={'#000'} resizeMode={'contain'}/>
                    </TouchableOpacity>
                )}
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
    header: {
        justifyContent: 'flex-end',
        flexDirection: 'row'
    },
    headerRight: {
        flexDirection: 'row', alignItems: 'center'
    },
    headerRightText: {
        fontSize: 16,
        color: styleConstants.colors.secondary,
        paddingRight: 10
    },
    image: {
        borderRadius: styleConstants.borderRadius,
        width: (styleConstants.dimensions.fullWidth - 40) / 2,
        height: styleConstants.dimensions.fullWidth / 2,
        margin: styleConstants.padding.sm,
        borderWidth: 2,
        borderColor: styleConstants.colors.primary
    }
});
