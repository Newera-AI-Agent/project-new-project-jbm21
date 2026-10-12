import {registerRoot, Composition} from 'remotion';
import {MainComposition} from './compositions/MainComposition';
import {VerticalComposition} from './compositions/VerticalComposition';
import {PosterFrame} from './compositions/PosterFrame';

const WIDTH = 1920;
const HEIGHT = 1080;
const VERTICAL_WIDTH = 1080;
const VERTICAL_HEIGHT = 1920;
const DURATION = 140;
const FPS = 30;

// Register all compositions in a single root
export const RemotionRoot = () => (
  <>
    <Composition
      id="MainComposition"
      component={MainComposition}
      durationInFrames={DURATION * FPS}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{}}
    />
    <Composition
      id="VerticalComposition"
      component={VerticalComposition}
      durationInFrames={DURATION * FPS}
      fps={FPS}
      width={VERTICAL_WIDTH}
      height={VERTICAL_HEIGHT}
      defaultProps={{}}
    />
    <Composition
      id="PosterFrame"
      component={PosterFrame}
      durationInFrames={1}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{}}
    />
  </>
);

registerRoot(RemotionRoot);
