import { PIXI } from "expo-pixi";

export const filters = [
    { "name": "None","filter": {}},
    { "name": "Color replace", "filter": new PIXI.filters.ColorReplaceFilter(0x000000, 0xff0000)},
    { "name": "Dots", "filter": new PIXI.filters.DotFilter(0.5)},
    { "name": "Emboss", "filter": new PIXI.filters.EmbossFilter()},
    { "name": "Pixelate", "filter": new PIXI.filters.PixelateFilter()},
    { "name": "Cross Hatch", "filter": new PIXI.filters.CrossHatchFilter()},
    { "name": "Noise", "filter": new PIXI.filters.NoiseFilter()},
    { "name": "Old Film", "filter": new PIXI.filters.OldFilmFilter()},
    { "name": "RGB Split", "filter": new PIXI.filters.RGBSplitFilter()},
  
    { "name": "Glow", "filter": new PIXI.filters.GlowFilter(30, 2, 0.5, 0xff0000)},
    { "name": "Bulge Pinch", "filter": new PIXI.filters.BulgePinchFilter([0.5, 0.2], 300, 1)},
    { "name": "Motion Blur", "filter": new PIXI.filters.MotionBlurFilter([54, 40], 15, 0)},
    { "name": "Drop Shadow", "filter": new PIXI.filters.DropShadowFilter()},
    { "name": "Advanced Bloom", "filter": new PIXI.filters.AdvancedBloomFilter()},
    { "name": "Blur", "filter": new PIXI.filters.BlurFilter()},
    { "name": "Twist", "filter": new PIXI.filters.TwistFilter(500, 20, 90)},
    { "name": "Bloom", "filter": new PIXI.filters.BloomFilter()},
    { "name": "Outline", "filter": new PIXI.filters.OutlineFilter(20, 0x00fc00, 1)},
    { "name": "Zoom Blur", "filter": new PIXI.filters.ZoomBlurFilter()},
  
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