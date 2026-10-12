import {registerRoot, Composition} from 'remotion';
import {MainComposition} from './compositions/MainComposition';

const WIDTH = 1920;
const HEIGHT = 1080;
const DURATION = 140;
const FPS = 30;

// Register the composition
export const MainCompositionEntry = () => (
  <Composition
    id="MainComposition"
    component={MainComposition}
    durationInFrames={DURATION * FPS}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    defaultProps={{}}
  />
);

registerRoot(MainCompositionEntry);
