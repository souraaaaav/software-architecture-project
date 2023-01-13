import * as actionTypes from './types';

export const addIngredient = (name) => {
    return {
        type: actionTypes.ADD_INGREDIENT,
        ingredientName: name
    };
};

export const removeIngredient = (name) => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        ingredientName: name
    };
};

export const setIngredients = () => {
    return {
        type: actionTypes.SET_INGREDIENTS,

    };
};

export const fetchIngredientsFailed = () => {
    return {
        type: actionTypes.FETCH_INGREDIENTS_FAILED
    };
};


export const burgerPurchasable = () => {
    return {
        type: actionTypes.BURGER_PURCHASABLE
    };
};
