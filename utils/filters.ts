import { PIXI } from "expo-pixi";

export const filters = [
  { "name": "None", "filter": {}, "hasSlider": false },
  { "name": "Color replace", "filter": new PIXI.filters.ColorReplaceFilter(), "hasSlider": false },
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
  { "name": "Outline", "filter": new PIXI.filters.OutlineFilter(20, 0x00fc00, 1), "hasSlider": false },
  
  { "name": "Zoom Blur", "filter": new PIXI.filters.ZoomBlurFilter(0.05), "hasSlider": true, "multiplyValue": 0.1 },

  // new PIXI.filters.AlphaFilter(),
  // new PIXI.filters.AsciiFilter(),
  // new PIXI.filters.ConvolutionFilter(),
  // new PIXI.filters.DisplacementFilter(),
  // new PIXI.filters.TiltShiftFilter(),
  // new PIXI.filters.GodrayFilter(),
  // new PIXI.filters.SimpleLightmapFilter(),
  // new PIXI.filters.MultiColorReplaceFilter(),
  // new PIXI.filters.ShockwaveFilter(),
];