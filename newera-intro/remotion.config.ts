import {Config} from '@remotion/cli/config';
import './src/index.css';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(90);
Config.setChromiumOpenGlRenderer('swiftshader');
Config.setAudioBitrate('128k');

// Disable parallelism for more stable rendering
Config.setConcurrency(4);
