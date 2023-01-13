import React from 'react';
import { connect } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { addIngredient, removeIngredient } from '../../actions/burger';
import Burger from '../../components/Burger/Burger';
import './Dashboard.css';

const Dashboard = ({ addIngredient, removeIngredient, ingredients, totalPrice }) => {
    let navigate = useNavigate();

    const handleOrder = () => {
        navigate('/order');
    };
    return (
        <>
            <Burger ingredients={ingredients} />
            <div className='control-outer-wrapper'>
                <span>Total price is : <b> {totalPrice} $</b></span>
            </div>
            <div className='control-outer-wrapper'>
                <div className='control-inner-wrapper' >
                    <span className='control-ingredient-name' >Salad : </span>
                    <div className='button-gap'>
                        <button class="addButton" onClick={() => addIngredient('salad')}>Add</button>
                        <button class="removeButton" disabled={ingredients.salad <= 0} onClick={() => removeIngredient('salad')}>Remove</button>
                    </div>
                </div>
                <div className='control-inner-wrapper' >
                    <span className='control-ingredient-name' >Meat : </span>
                    <div className='button-gap'>
                        <button class="addButton" onClick={() => addIngredient('meat')}>Add</button>
                        <button class="removeButton" disabled={ingredients.meat <= 0} onClick={() => removeIngredient('meat')}>Remove</button>
                    </div>
                </div>
                <div className='control-inner-wrapper' >
                    <span className='control-ingredient-name' >Cheese : </span>
                    <div className='button-gap'>
                        <button class="addButton" onClick={() => addIngredient('cheese')}>Add</button>
                        <button class="removeButton" disabled={ingredients.cheese <= 0} onClick={() => removeIngredient('cheese')}>Remove</button>
                    </div>
                </div>
                <div className='control-inner-wrapper' >
                    <span className='control-ingredient-name' >Bacon : </span>
                    <div className='button-gap'>
                        <button class="addButton" onClick={() => addIngredient('bacon')}>Add</button>
                        <button class="removeButton" disabled={ingredients.bacon <= 0} onClick={() => removeIngredient('bacon')}>Remove</button>
                    </div>
                </div>
            </div>
            <div className='button-wrapper'>
                <button class="orderButton" disabled={totalPrice === 40} onClick={handleOrder}>Order</button>

            </div>

        </>
    );
};
const mapStateToProps = state => ({
    ingredients: state.burger.ingredients,
    totalPrice: state.burger.totalPrice

});

export default connect(mapStateToProps, { addIngredient, removeIngredient })(Dashboard);