import {Config} from '@remotion/cli/config';

// Hemat disk & RAM: H.264, CRF 23, frame JPEG, 1 thread.
Config.setCodec('h264');
Config.setPixelFormat('yuv420p');
Config.setCrf(23);
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(90);
Config.setConcurrency(1);
Config.setOverwriteOutput(true);
