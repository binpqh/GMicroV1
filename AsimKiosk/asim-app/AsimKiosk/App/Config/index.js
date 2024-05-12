import DebugConfig from './DebugConfig';
import Constants from "./Constants";
import AppConfig from './AppConfig';
if(__DEV__){
    // If ReactNative's yellow box warnings are too much, it is possible to turn
    // it off, but the healthier approach is to fix the warnings.  🙂
    console.disableYellowBox = !DebugConfig.yellowBox
}
export{AppConfig,Constants}