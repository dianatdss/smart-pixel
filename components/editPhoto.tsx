/*
create on localStorage an 'current Edited Photo' key and always change that value,
according to what you select from new/gallery
make sure that when you do that, you remove that photo from gallery storage
on this component, extract that image and start editing it
after that, you have two options --create 2 buttons -- : 
- save it to gallery & remove from current Edited Photo
- don't save it: readd the unedited photo to gallery
and also remove it from current Edited Photo
*/

/*
* vor fi doua tipuri de filre: filtre basic si filtre custom
* filtrele basic sunt salvate intr-un array
* filtrul basic e doar unul
*
* vor fi doua butoane:
*  - unul pentru sliderul care deschide filtre basic carousel
*  - unul pentru sliderul care deschide filtre custom carousel
* un buton face trigger celuilalt
*
*
* */
import React, { useState } from "react";
import { AsyncStorage, Button, Slider, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ExpoPixi, { PIXI } from "expo-pixi";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { importedBasicFilters, importedCustomFilters } from '../utils/filters'
import * as styleConstants from '../utils/styles'
import { StorageTypes } from '../utils/enums';
import Icon from "react-native-vector-icons/Octicons";
import { Dimensions } from 'react-native';
const screenWidth = Math.round(Dimensions.get('window').width) - 40;

const EditPhoto = ({route, navigation}) => {
        const {photo} = route.params;

        const [basicIndex, setBasicIndex] = useState(0);
        const [customIndex, setCustomIndex] = useState(0);

        const [filter, setFilters] = useState([importedCustomFilters[0].filter]);
        const [basicFilter, setBasicFilters] = useState(importedBasicFilters.map(filter => filter.filter));
        const [customFilter, setCustomFilter] = useState(importedCustomFilters[0].filter);

        const [firstBulgeParameter, setFirstBulgeParameter] = useState(500);
        const [secondBulgeParameter, setSecondBulgeParameter] = useState(1);

        const [ref, setRef] = useState();
        const [basicCarouselRef, setBasicCarouselRef] = useState();
        const [customCarouselRef, setCustomCarouselRef] = useState();

        const [isBasicFilterDisplayed, setFilterDisplay] = useState(true);

        function setFilterImageRef(c) {
            setRef(c);
        };

        function changeValue(value, isBasicFilters = false) {
            if (isBasicFilters) {
                switch (basicIndex) {
                    case 1: {
                        const colorMatrixFilter = new PIXI.filters.ColorMatrixFilter();
                        colorMatrixFilter.contrast(value);
                        // TODO: setBasicFilters actually add to the array
                        var tempBasicFilter = basicFilter;
                        tempBasicFilter[basicIndex] = colorMatrixFilter;
                        setBasicFilters(tempBasicFilter);

                        updateFilters();
                        return;
                    }
                    case 2: {
                        const colorMatrixFilter = new PIXI.filters.ColorMatrixFilter();
                        colorMatrixFilter.brightness(value + 1);
                        var tempBasicFilter = basicFilter;
                        tempBasicFilter[basicIndex] = colorMatrixFilter;
                        setBasicFilters(tempBasicFilter);
                        updateFilters();
                        return;
                    }
                    case 3: {
                        const colorMatrixFilter = new PIXI.filters.ColorMatrixFilter();
                        colorMatrixFilter.greyscale(value);
                        var tempBasicFilter = basicFilter;
                        tempBasicFilter[basicIndex] = colorMatrixFilter;
                        tempBasicFilter[4] = {};
                        setBasicFilters(tempBasicFilter);
                        updateFilters();
                        return;
                    }
                    case 4: {
                        const colorMatrixFilter = new PIXI.filters.ColorMatrixFilter();
                        colorMatrixFilter.hue(value * 360);
                        var tempBasicFilter = basicFilter;
                        tempBasicFilter[3] = {};
                        tempBasicFilter[basicIndex] = colorMatrixFilter;
                        setBasicFilters(tempBasicFilter);
                        updateFilters();
                        return;
                    }
                    case 5: {
                        const colorMatrixFilter = new PIXI.filters.ColorMatrixFilter();
                        colorMatrixFilter.saturate(value);
                        var tempBasicFilter = basicFilter;
                        tempBasicFilter[basicIndex] = colorMatrixFilter;
                        setBasicFilters(tempBasicFilter);
                        updateFilters();
                        return;
                    }
                    case 6: {
                        const colorMatrixFilter = new PIXI.filters.ColorMatrixFilter();
                        colorMatrixFilter.night(value);
                        var tempBasicFilter = basicFilter;
                        tempBasicFilter[basicIndex] = colorMatrixFilter;
                        setBasicFilters(tempBasicFilter);
                        updateFilters();
                        return;
                    }
                    default:
                        return;
                }
            } else {
                switch (customIndex) {
                    case 2: {
                        setCustomFilter(new PIXI.filters.DotFilter(value));
                        updateFilters();
                        return;
                    }
                    case 3: {
                        setCustomFilter(new PIXI.filters.EmbossFilter(value * importedCustomFilters[customIndex].multiplyValue + 1));
                        updateFilters();
                        return;
                    }
                    case 4: {
                        setCustomFilter(new PIXI.filters.PixelateFilter(value * importedCustomFilters[customIndex].multiplyValue + 1));
                        updateFilters();
                        return;
                    }
                    case 6: {
                        setCustomFilter(new PIXI.filters.NoiseFilter(value));
                        updateFilters();
                        return;
                    }
                    case 9: {
                        setFirstBulgeParameter(value * 500);
                        setCustomFilter(new PIXI.filters.BulgePinchFilter([0.5, 0.5], firstBulgeParameter, secondBulgeParameter));
                        updateFilters();
                        return;
                    }
                    case 11: {
                        setCustomFilter(new PIXI.filters.AdvancedBloomFilter({"brightness": value * importedCustomFilters[customIndex].multiplyValue}));
                        updateFilters();
                        return;
                    }
                    case 12: {
                        setCustomFilter(new PIXI.filters.BlurFilter(value * importedCustomFilters[customIndex].multiplyValue + 1));
                        updateFilters();
                        return;
                    }
                    case 15: {
                        setCustomFilter(new PIXI.filters.ZoomBlurFilter(value * importedCustomFilters[customIndex].multiplyValue));
                        updateFilters();
                        return;
                    }
                    default:
                        return;
                }
            }

        }

        function removeFilter() {
            var tempBasicFilter = basicFilter;
            tempBasicFilter[basicIndex] = {};
            setBasicFilters(tempBasicFilter);
            updateFilters();
        }

        function updateFilters() {
            const resultedFilter = basicFilter.concat(customFilter);
            setFilters(resultedFilter);
        }

        function changeSecondValue(value) {
            switch (customIndex) {
                case 9: {
                    setSecondBulgeParameter(value);
                    setCustomFilter(new PIXI.filters.BulgePinchFilter([0.5, 0.5], firstBulgeParameter, secondBulgeParameter));
                    updateFilters();
                }
                default: {
                    return;
                }
            }
        }

        function navigateBackToGallery() {
            if (basicCarouselRef) basicCarouselRef.snapToItem(0);
            if (customCarouselRef) customCarouselRef.snapToItem(0);

            setBasicFilters(importedBasicFilters.map(filter => filter.filter));
            setCustomFilter(importedCustomFilters[0].filter);
            setFilters([importedCustomFilters[0].filter]);

            setCustomIndex(0);
            setBasicIndex(0);

            navigation.goBack();
        }

        async function storeDataToStorage(image) {
            try {
                //  await AsyncStorage.removeItem(StorageTypes.EDITED_PHOTOS);
                let storedValue = await AsyncStorage.getItem(StorageTypes.EDITED_PHOTOS);
                const newImage = JSON.stringify(image);
                let result = storedValue ? storedValue.concat(",").concat(newImage) : newImage;
                await AsyncStorage.setItem(StorageTypes.EDITED_PHOTOS, result);

            } catch (error) {
                console.log(error);
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
                await storeDataToStorage(result);
                navigateBackToGallery();
            } catch (snapshotError) {
                console.error(snapshotError);
            }
        };

        async function onNextPage(basic = true) {
            if (basic) {
                setBasicIndex(basicCarouselRef.currentIndex);
            } else {
                setCustomFilter(importedCustomFilters[customCarouselRef.currentIndex].filter);
                setCustomIndex(customCarouselRef.currentIndex);
                const resultedFilter = basicFilter.concat(importedCustomFilters[customCarouselRef.currentIndex].filter);
                setFilters(resultedFilter);
            }
        }

        function setFilterDisplayValue(value) {
            setFilterDisplay(value);
            setCustomIndex(0);
            setBasicIndex(0);
        }

        const _renderItem = ({item}) => {
            return (
                <View>
                    <TouchableOpacity style={styles.viewButton}>
                        <Text style={styles.buttonText}>{item.name}  </Text>
                    </TouchableOpacity>
                </View>
            );
        };

        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
                    <TouchableOpacity style={[styles.button, isBasicFilterDisplayed ? styles.buttonSelected : {}]}
                                      onPress={() => setFilterDisplayValue(true)}>
                        <Text
                            style={[styles.buttonText, isBasicFilterDisplayed ? styles.buttonTextSelected : {}]}>Basic</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, !isBasicFilterDisplayed ? styles.buttonSelected : {}]}
                                      onPress={() => setFilterDisplayValue(false)}>
                        <Text
                            style={[styles.buttonText, !isBasicFilterDisplayed ? styles.buttonTextSelected : {}]}>Custom</Text>
                    </TouchableOpacity>
                </View>
                <ExpoPixi.FilterImage
                    source={photo}
                    ref={(c) => setFilterImageRef(c)}
                    style={styles.image}
                    resizeMode={"cover"}
                    filters={filter}
                />
                {isBasicFilterDisplayed &&
                <View>
                    <View>
                        <Carousel
                            ref={(c) => setBasicCarouselRef(c)}
                            data={importedBasicFilters}
                            renderItem={_renderItem}
                            sliderWidth={screenWidth}
                            itemWidth={screenWidth}
                            firstItem={0}
                            containerCustomStyle={{flexGrow: 0}}
                            onSnapToItem={() => onNextPage(true)}
                        />
                        <Pagination
                            dotsLength={importedBasicFilters.length}
                            activeDotIndex={basicIndex}
                            containerStyle={{marginVertical: -10}}
                            dotStyle={{
                                width: 5,
                                height: 5,
                                borderRadius: 5,
                                marginHorizontal: 8,
                                backgroundColor: styleConstants.colors.secondary
                            }}
                            inactiveDotOpacity={0.4}
                            inactiveDotScale={0.6}
                        />
                    </View>

                    <View style={{height: 60, flexDirection: "row", alignItems: "center"}}>
                        {importedBasicFilters[basicIndex].hasSlider &&
                        <Slider
                            style={{flex: 1, height: 30}}
                            minimumValue={0}
                            maximumValue={1}
                            minimumTrackTintColor={styleConstants.colors.secondary}
                            maximumTrackTintColor={styleConstants.colors.dark}
                            thumbTintColor={styleConstants.colors.secondary}
                            onValueChange={(value) => changeValue(value, true)}
                        />}
                        {basicIndex !== 0 &&

                        <Icon
                            name="trashcan"
                            size={35}
                            color={styleConstants.colors.secondary}
                            onPress={() => removeFilter()}
                        />}
                    </View>

                </View>}
                {!isBasicFilterDisplayed &&
                <View>
                    <View>
                        <Carousel
                            ref={(c) => setCustomCarouselRef(c)}
                            data={importedCustomFilters}
                            renderItem={_renderItem}
                            sliderWidth={screenWidth}
                            itemWidth={screenWidth}
                            firstItem={0}
                            containerCustomStyle={{flexGrow: 0}}
                            onSnapToItem={() => onNextPage(false)}
                        />
                        <Pagination
                            dotsLength={importedCustomFilters.length}
                            activeDotIndex={customIndex}
                            containerStyle={{marginVertical: -10}}
                            dotStyle={{
                                width: 5,
                                height: 5,
                                borderRadius: 5,
                                marginHorizontal: -5,
                                backgroundColor: styleConstants.colors.secondary
                            }}
                            inactiveDotOpacity={0.4}
                            inactiveDotScale={0.6}
                        />
                    </View>

                    <View style={{height: 60}}>
                        {importedCustomFilters[customIndex].hasSlider &&
                        /* maybe render multiple sliders with a for and display the one with the index*/

                        <Slider
                            style={ {height: 30}}
                            minimumValue={0}
                            maximumValue={1}
                            minimumTrackTintColor={styleConstants.colors.secondary}
                            maximumTrackTintColor={styleConstants.colors.dark}
                            thumbTintColor={styleConstants.colors.secondary}
                            onValueChange={(value) => changeValue(value, false)}
                        />}

                        {importedCustomFilters[customIndex].hasSecondSlider &&
                        <Slider
                            style={{height: 30}}
                            minimumValue={0}
                            maximumValue={1}
                            minimumTrackTintColor={styleConstants.colors.secondary}
                            maximumTrackTintColor={styleConstants.colors.dark}
                            thumbTintColor={styleConstants.colors.secondary}
                            onValueChange={(value) => changeSecondValue(value)}
                        />}
                    </View>
                </View>
                }
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => _saveToCameraRollAsync()}>
                        <Text style={styles.buttonText}>Save </Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
;

export default EditPhoto;
const styles = StyleSheet.create({
    container: {
        marginVertical: styleConstants.padding.sm,
        marginHorizontal: styleConstants.padding.md,
        flex: 1
    },
    image: {
        flex: 1,
    },
    viewPager: {
        height: 200
    },
    viewButton: {
        backgroundColor: styleConstants.colors.white,
        borderRadius: styleConstants.gridGutterWidth,
        borderColor: styleConstants.colors.primary,
        borderWidth: 2,
        paddingVertical: styleConstants.gridGutterWidth / 3,
        marginVertical: styleConstants.gridGutterWidth / 3,
        justifyContent: "center"
    },
    removeButton: {
        backgroundColor: styleConstants.colors.white,
        borderRadius: styleConstants.gridGutterWidth,
        borderColor: styleConstants.colors.secondary,
        borderWidth: 2,
        paddingVertical: styleConstants.gridGutterWidth / 6,
        marginVertical: styleConstants.gridGutterWidth / 6,
        justifyContent: "center"
    },
    buttonContainer: {
        alignItems: 'center'
    },
    button: {
        backgroundColor: styleConstants.colors.white,
        width: "40%",
        borderRadius: styleConstants.gridGutterWidth,
        borderColor: styleConstants.colors.primary,
        borderWidth: 2,
        height: styleConstants.gridGutterWidth * 1.5,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: styleConstants.padding.sm / 2,
    },
    buttonSelected: {
        borderColor: styleConstants.colors.secondary,
    },
    buttonText: {
        fontSize: styleConstants.fonts.md,
        color: styleConstants.colors.primary,
        textAlign: 'center'
    },
    buttonTextSelected: {
        color: styleConstants.colors.secondary
    },
    removeButtonText: {
        fontSize: styleConstants.fonts.sm,
        color: styleConstants.colors.secondary,
        textAlign: 'center'
    }
});
