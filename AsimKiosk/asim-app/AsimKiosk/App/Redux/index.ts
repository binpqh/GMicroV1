import { combineReducers } from 'redux';
import configureStore from './CreateStore';
import { languageState } from './LanguageRedux';
declare global {
    interface NodeModule {
        hot: any
    }
}
/* ------------- Assemble The Reducers ------------- */

export interface StateApp {
    language: languageState,
}

export const reducers = combineReducers<StateApp>({
    language: require('./LanguageRedux').reducer
})

export default () => {
    let finalReducers: any = reducers
    let { store } = configureStore(finalReducers)
    return store
}
