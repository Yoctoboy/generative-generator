import { SketchType } from './Sketch';
import BaseSketch from './base/BaseSketch';
import BloomSketch from './bloom/BloomSketch';
import DiamondSquareSketch from './diamond-square/DiamondSquareSketch';
import GlitchyVHSSketch from './glitchy-vhs/GlitchyVHSSketch';
import HeightMapSketch from './height-map/HeightMapSketch';
import SmokeCloudSketch from './smoke-cloud/SmokeCloudSketch';
import SortedFaceSketch from './sorted-face/SortedFaceSketch';
import SquareCloudsSketch from './square-clouds/SquareCloudsSketch';
import TendrilsSketch from './tendrils/TendrilsSketch';
import TheRiverSketch from './the-river/TheRiverSketch';
import TheRoomSketch from './the-room/TheRoomSketch';
import WarpedSketch from './warped/WarpedSketch';

export const availableSketches = [
    BaseSketch,
    DiamondSquareSketch,
    SortedFaceSketch,
    SquareCloudsSketch,
    GlitchyVHSSketch,
    WarpedSketch,
    TendrilsSketch,
    SmokeCloudSketch,
    BloomSketch,
    HeightMapSketch,
    TheRiverSketch,
    TheRoomSketch,
];

// The sketch displayed when the app loads
export const defaultSketch: SketchType = TheRoomSketch;
