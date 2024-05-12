import { createReducer, createActions } from 'reduxsauce'
import Immutable, { ImmutableObject } from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

export type languageType = 'vi' | 'en'

export interface languageState {
    language: languageType
}

interface changeLanguageInterface {
    (
        state: ImmutableObject<languageState>,
        action: { language: languageType }
    ): ImmutableObject<languageState>
}

// ========================================================

const { Types, Creators } = createActions({
    changeLanguage: ['language'],
})

export const LanguageTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE: ImmutableObject<languageState> = Immutable({
    language: 'en',
})

/* ------------- Reducers ------------- */

// * START api change language
export const changeLanguage: changeLanguageInterface = (state, { language }) => state.merge({ language })

/* ------------- Hookup Reducers To Types ------------- */

export const LanguageActions = {
    [Types.CHANGE_LANGUAGE]: changeLanguage,
}

export const reducer = createReducer<ImmutableObject<languageState>>(INITIAL_STATE, LanguageActions)


