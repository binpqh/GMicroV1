import { createStore, applyMiddleware, compose } from 'redux';
import Config from '../Config/DebugConfig';
declare global {
    interface Console {
        tron: any
    }
}
// creates the store
export default (rootReducer: any,) => {
    /* ------------- Redux Configuration ------------- */

    const middleware = []
    const enhancers = []

    if (process.env.NODE_ENV === `development`) {
        const { logger } = require(`redux-logger`);
        middleware.push(logger);
    }
    /* ------------- Assemble Middleware ------------- */

    enhancers.push(applyMiddleware(...middleware))

    // if Reactotron is enabled (default for _DEV_), we'll create the store through Reactotron
    const createAppropriateStore = Config.useReactotron ? console.tron.createStore : createStore
    const store = createAppropriateStore(rootReducer, compose(...enhancers))
    return {
        store
    }
}