import * as actionTypes from '../actions/types';


const initialState = {
    ingredients: {
        salad: 0,
        meat: 0,
        cheese: 0,
        bacon: 0
    },
    totalPrice: 40,
    errror: false,
    orderable: false,
    building: false
};

const burger_price = {
    salad: 40,
    meat: 130,
    cheese: 60,
    bacon: 40
};
const updatedObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

const addIngredient = (state, action) => {
    const updatedIngredient = { [action.ingredientName]: state.ingredients[action.ingredientName] + 1 };
    const updatedIngredients = updatedObject(state.ingredients, updatedIngredient);
    const updatedState = {
        ingredients: updatedIngredients,
        totalPrice: state.totalPrice + burger_price[action.ingredientName],
        building: true
    };
    return updatedObject(state, updatedState);
};

const removeIngredient = (state, action) => {
    const updatedIngredient = { [action.ingredientName]: state.ingredients[action.ingredientName] - 1 };
    const updatedIngredients = updatedObject(state.ingredients, updatedIngredient);
    const updatedState = {
        ingredients: updatedIngredients,
        totalPrice: state.totalPrice - burger_price[action.ingredientName],
        building: true
    };
    return updatedObject(state, updatedState);
};

const setIngredient = (state) => {
    return updatedObject(state, {
        ...state,
        ingredients: {
            salad: 0,
            cheese: 0,
            meat: 0,
            bacon: 0,
        },
        totalPrice: 40,
        error: false,
        orderable: false,
        building: false
    });
};

const fetchIngredientsFailed = (state, action) => {
    return updatedObject(state, { error: true });
};

const burgerPurchasable = (state, action) => {
    return updatedObject(state, { orderable: true });
};

export const burgerReducer = (state = initialState, action) => {

    switch (action.type) {

        case actionTypes.ADD_INGREDIENT:
            return addIngredient(state, action);

        case actionTypes.REMOVE_INGREDIENT:
            return removeIngredient(state, action);

        case actionTypes.SET_INGREDIENTS:
            return setIngredient(state, action);

        case actionTypes.FETCH_INGREDIENTS_FAILED:
            return fetchIngredientsFailed(state, action);

        case actionTypes.BURGER_PURCHASABLE:
            return burgerPurchasable(state, action);

        default:
            return state;
    }
};

