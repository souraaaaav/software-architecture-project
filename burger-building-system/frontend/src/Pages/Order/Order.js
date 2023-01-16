import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import HashLoader from 'react-spinners/HashLoader';
import { toast } from 'react-toastify';
import { setIngredients } from '../../actions/burger';
import Burger from '../../components/Burger/Burger';
import './Order.css';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const Order = ({ ingredients, totalPrice, email, setIngredients }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [orderId, setOrderId] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        toast.success("Your order Id is sent to your email");
        navigate('/all-orders');
    };
    const handleSubmit = (name, transactionId) => {
        setLoading(true);
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const body = JSON.stringify({ 'email': email, 'totalPrice': totalPrice, 'salad': ingredients.salad, 'bacon': ingredients.bacon, 'cheese': ingredients.cheese, 'meat': ingredients.meat, 'transactionId': transactionId });
        axios.post('http://localhost:8000/api/create-order/', body, config)
            .then(response => {
                setOrderId(response.data.orderId);
                setIngredients();
                setLoading(false);
                toast.success("Your order Id is sent to your email and paid by " + name);
                navigate('/all-orders');
            })
            .catch(err => {
                setLoading(false);
                toast.error("Something went wrong.");
            });
    };
    return (
        <>
            {loading ? <HashLoader speedMultiplier={1.5} color={'#262626'} style={{ marginLeft: "50%" }} size={100} /> :
                <div>
                    <div className='order-burger-wrapper'>
                        <Burger ingredients={ingredients} />
                        <div className='card-outer-wrapper beside-burger'>
                            <span className='bolder-text'>Order Details</span>
                            <div className='burger-order-text'>
                                <table class="styled-table">
                                    <thead>
                                        <tr>
                                            <th>Ingredients</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Bun</td>
                                            <td>2</td>
                                            <td>20</td>
                                            <td>40</td>
                                        </tr>
                                        <tr>
                                            <td>Salad</td>
                                            <td>{ingredients.salad}</td>
                                            <td>40</td>
                                            <td>{ingredients.salad * 40}</td>
                                        </tr>
                                        <tr>
                                            <td>Cheese</td>
                                            <td>{ingredients.cheese}</td>
                                            <td>60</td>
                                            <td>{ingredients.cheese * 60}</td>
                                        </tr>
                                        <tr>
                                            <td>Meat</td>
                                            <td>{ingredients.meat}</td>
                                            <td>130</td>
                                            <td>{ingredients.meat * 130}</td>
                                        </tr>
                                        <tr>
                                            <td>Bacon</td>
                                            <td>{ingredients.bacon}</td>
                                            <td>40</td>
                                            <td>{ingredients.bacon * 40}</td>
                                        </tr>
                                        <tr >
                                            <td colSpan={4}>Total Price: {totalPrice}$</td>

                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                        </div>
                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style}>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Order Id
                                </Typography>
                                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                    {orderId}
                                </Typography>
                            </Box>
                        </Modal>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <PayPalScriptProvider options={{ "client-id": "give your paypal id" }}>
                            <PayPalButtons
                                createOrder={(data, actions) => {
                                    return actions.order.create({
                                        purchase_units: [
                                            {
                                                amount: {
                                                    value: totalPrice,
                                                },
                                            },
                                        ],
                                    });
                                }}
                                onApprove={async (data, actions) => {
                                    const details = await actions.order.capture();
                                    console.log(details);
                                    const name = details.payer.name.given_name;
                                    const transactionId = details.purchase_units[0].payments.captures[0].id;
                                    // alert("Transaction completed by " + name);
                                    handleSubmit(name, transactionId);
                                }}
                            />
                        </PayPalScriptProvider>
                    </div>

                    <p style={{ height: 20 }}></p>
                </div>
            }
        </>
    );
};

const mapStateToProps = state => ({
    ingredients: state.burger.ingredients,
    totalPrice: state.burger.totalPrice,
    email: state.auth.user.email

});

export default connect(mapStateToProps, { setIngredients })(Order);