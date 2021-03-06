import { PIXI } from "expo-pixi";

/*
const colorMatrix = [
  {
    name: 'brightness',
    tools: [{ type: 'number', min: 0, max: 1, standard: 0.8 }],
  },
  {
    name: 'greyscale',
    tools: [{ type: 'number', min: 0, max: 1, standard: 0.1 }],
  },
  { name: 'blackAndWhite' },
  { name: 'hue', tools: [{ type: 'number', min: 0, max: 360, standard: 10 }] },
  {
    name: 'contrast',
    tools: [{ type: 'number', min: 0, max: 1, standard: 0.6 }],
  },
  {
    name: 'saturate',
    tools: [{ type: 'number', min: 0, max: 1, standard: 0.5 }],
  },
  { name: 'desaturate' },
  { name: 'negative' },
  { name: 'sepia' },
  { name: 'technicolor', tools: [{ type: 'boolean', standard: true }] },
  { name: 'polaroid' },
  { name: 'toBGR' },
  { name: 'kodachrome', tools: [{ type: 'boolean', standard: true }] },
  { name: 'browni', tools: [{ type: 'boolean', standard: true }] },
  { name: 'vintage', tools: [{ type: 'boolean', standard: true }] },
  {
    name: 'colorTone',
    tools: [
      { type: 'number', min: 0, max: 1, standard: 0.5 },
      { type: 'number', min: 0, max: 1, standard: 0.5 },
      { type: 'color', standard: 0xff0000 },
      { type: 'color', standard: 0x000011 },
    ],
  },
  { name: 'night', tools: [{ type: 'number', min: 0, max: 1, standard: 0.5 }] },
  {
    name: 'predator',
    tools: [{ type: 'number', min: 0, max: 1, standard: 0.5 }],
  },
  { name: 'lsd' },
];
const filter = filters => {
  const output = new PIXI.filters.ColorMatrixFilter();
  
  if (Array.isArray(filters)) {
    filters.map(item => {
      if (typeof item === 'string') {
        output[item]();
      } else {
        const { name, props } = item;
        output[name](...props);
      }
    });
  } else {
    return filter([filters]);
  }
  return output;
};
export const parsedColorMatrix = colorMatrix.map(({ name, tools }) => {
  return {
  "name": name,
  "filter": filter({
    name: name,
    props: (tools || []).map(tool => tool.standard),
  }),
  "hasSlider": tools && tools.length == 1
}});*/
/*
const contrastFilter = new PIXI.filters.ColorMatrixFilter();
// contrastFilter.contrast(0.1);


const brightnessFilter = new PIXI.filters.ColorMatrixFilter();
brightnessFilter.brightness(1);

const greyscale = new PIXI.filters.ColorMatrixFilter();
greyscale.greyscale(1);


const hueFilter = new PIXI.filters.ColorMatrixFilter();
hueFilter.hue(180);
*/
const negativeFilter = new PIXI.filters.ColorMatrixFilter();
negativeFilter.negative();
const nightFilter = new PIXI.filters.ColorMatrixFilter();
nightFilter.night(0.5);
const browniFilter = new PIXI.filters.ColorMatrixFilter();
browniFilter.browni(1);

const browniSepia = new PIXI.filters.ColorMatrixFilter();
browniSepia._loadMatrix([
        0.25, 0.5, 0.125, 0, 0,
        0.15, 0.3, 0.07, 0, 0,
        0.04, 0.06, 0.02, 0, 0,
        0, 0, 0, 1, 0
    ]
);
const reddishSepia = new PIXI.filters.ColorMatrixFilter();
reddishSepia._loadMatrix([
        0.36, 0.72, 0.18, 0, 0,
        0.08, 0.16, 0.04, 0, 0,
        0.08, 0.16, 0.04, 0, 0,
        0, 0, 0, 1, 0
    ]
);
const goldenSepia = new PIXI.filters.ColorMatrixFilter();
goldenSepia._loadMatrix([
        0.5, 1, 0.25, 0, 0,
        0.38, 0.76, 0.19, 0, 0,
        0.05, 0.1, 0.025, 0, 0,
        0, 0, 0, 1, 0
    ]
);

/*export const filters = [
  { "name": "None", "filter": {}, "hasSlider": false },

  { "name": "Contrast", "filter": {}, "hasSlider": true},
  { "name": "Brightness", "filter": {}, "hasSlider": true},
  { "name": "Greyscale", "filter": {}, "hasSlider": true},
  { "name": "Hue", "filter": {}, "hasSlider": true, "multiplyValue": 360},


  { "name": "Browni", "filter": browniFilter, "hasSlider": false},
  { "name": "Dots", "filter": new PIXI.filters.DotFilter(0), "hasSlider": true },
  { "name": "Emboss", "filter": new PIXI.filters.EmbossFilter(), "multiplyValue": 20, "hasSlider": true },
  { "name": "Pixelate", "filter": new PIXI.filters.PixelateFilter(1), "multiplyValue": 40, "hasSlider": true },
  { "name": "Cross Hatch", "filter": new PIXI.filters.CrossHatchFilter(), "hasSlider": false },
  { "name": "Noise", "filter": new PIXI.filters.NoiseFilter(0), "hasSlider": true },

  { "name": "Old Film", "filter": new PIXI.filters.OldFilmFilter(), "hasSlider": false },
  { "name": "RGB Split", "filter": new PIXI.filters.RGBSplitFilter([-10,0],[10,0],[10,20]), "hasSlider": false }, //
  { "name": "Bulge Pinch", "filter": new PIXI.filters.BulgePinchFilter([0.5, 0.5], 300, 1), "hasSlider": true, "hasSecondSlider": true },
  { "name": "Motion Blur", "filter": new PIXI.filters.MotionBlurFilter([54, 40], 15, 0), "hasSlider": false },
  { "name": "Advanced Bloom", "filter": new PIXI.filters.AdvancedBloomFilter({"brightness": 1, "quality": 20}), "multiplyValue": 1.5, "hasSlider": true},
  
  { "name": "Blur", "filter": new PIXI.filters.BlurFilter(), "hasSlider": true, "multiplyValue": 50 },
  { "name": "Twist", "filter": new PIXI.filters.TwistFilter(500, 20, 90), "hasSlider": false },
  { "name": "Bloom", "filter": new PIXI.filters.BloomFilter(), "hasSlider": false },
  { "name": "Zoom Blur", "filter": new PIXI.filters.ZoomBlurFilter(0.05), "hasSlider": true, "multiplyValue": 0.1 }

  

  // ...parsedColorMatrix,

  // new PIXI.filters.AlphaFilter(),
  // new PIXI.filters.AsciiFilter(),
  // new PIXI.filters.ConvolutionFilter(),
  // new PIXI.filters.DisplacementFilter(),
  // new PIXI.filters.TiltShiftFilter(),
  // new PIXI.filters.GodrayFilter(),
  // new PIXI.filters.SimpleLightmapFilter(),
  // new PIXI.filters.MultiColorReplaceFilter(),
  // new PIXI.filters.ShockwaveFilter(),
];*/
export const importedBasicFilters = [
    {"name": "None", "filter": {}, "hasSlider": false},
    {"name": "Contrast", "filter": {}, "hasSlider": true},
    {"name": "Brightness", "filter": {}, "hasSlider": true},
    {"name": "Greyscale", "filter": {}, "hasSlider": true},
    {"name": "Hue", "filter": {}, "hasSlider": true, "multiplyValue": 360},
    {"name": "Saturation", "filter": {}, "hasSlider": true},
];

export const importedCustomFilters = [
    {"name": "None", "filter": {}, "hasSlider": false},
    {"name": "Browni", "filter": browniFilter, "hasSlider": false},
    {"name": "Dots", "filter": new PIXI.filters.DotFilter(0.1), "hasSlider": true},
    {"name": "Emboss", "filter": new PIXI.filters.EmbossFilter()},
    {"name": "Pixelate", "filter": new PIXI.filters.PixelateFilter(1), "multiplyValue": 40, "hasSlider": true},
    {"name": "Cross Hatch", "filter": new PIXI.filters.CrossHatchFilter(), "hasSlider": false},

    {"name": "Noise", "filter": new PIXI.filters.NoiseFilter(0), "hasSlider": true},
    {"name": "Old Film", "filter": new PIXI.filters.OldFilmFilter(), "hasSlider": false},
    {"name": "RGB Split", "filter": new PIXI.filters.RGBSplitFilter([-10, 0], [10, 0], [10, 20]), "hasSlider": false}, //
    {
        "name": "Bulge Pinch",
        "filter": new PIXI.filters.BulgePinchFilter([0.5, 0.5], 300, 1),
        "hasSlider": true,
        "hasSecondSlider": true
    },
    {"name": "Motion Blur", "filter": new PIXI.filters.MotionBlurFilter([54, 40], 15, 0), "hasSlider": false},

    {
        "name": "Advanced Bloom",
        "filter": new PIXI.filters.AdvancedBloomFilter({"brightness": 1, "quality": 20}),
        "multiplyValue": 1.5,
        "hasSlider": true
    },
    {"name": "Negative", "filter": negativeFilter, "hasSlider": false},

    {"name": "Blur", "filter": new PIXI.filters.BlurFilter(), "hasSlider": true, "multiplyValue": 50},
    {"name": "Night", "filter": {}, "hasSlider": true},
    {"name": "Browni Sepia", "filter": browniSepia, "hasSlider": false},

    {"name": "Reddish Sepia", "filter": reddishSepia, "hasSlider": false},

    {"name": "Golden Sepia", "filter": goldenSepia, "hasSlider": false},

];
