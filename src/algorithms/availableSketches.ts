import { SketchType } from './Sketch';
import BaseSketch from './base/BaseSketch';
import BloomSketch from './bloom/BloomSketch';
import DiamondSquareSketch from './diamond-square/DiamondSquareSketch';
import GlitchyVHSSketch from './glitchy-vhs/GlitchyVHSSketch';
import HeightMapSketch from './height-map/HeightMapSketch';
import PyriteSketch from './pyrite/PyriteSketch';
import RedFlowersSketch from './red-flowers/RedFlowersSketch';
import SmokeCloudSketch from './smoke-cloud/SmokeCloudSketch';
import SortedFaceSketch from './sorted-face/SortedFaceSketch';
import SquareCloudsSketch from './square-clouds/SquareCloudsSketch';
import TendrilsSketch from './tendrils/TendrilsSketch';
import TheRiverSketch from './the-river/TheRiverSketch';
import TheRoomSketch from './the-room/TheRoomSketch';
import UnknownPleasuresSketch from './unknown-pleasures/UnknownPleasuresSketch';
import WarpedSketch from './warped/WarpedSketch';
import WatercolorSketch from './watercolor/WatercolorSketch';

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
    UnknownPleasuresSketch,
    WatercolorSketch,
    RedFlowersSketch,
    PyriteSketch,
];


// The sketch displayed when the app loads
export const defaultSketch: SketchType = RedFlowersSketch;
