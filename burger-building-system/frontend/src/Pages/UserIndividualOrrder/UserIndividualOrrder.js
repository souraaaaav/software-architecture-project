import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import HashLoader from 'react-spinners/HashLoader';
import { toast } from 'react-toastify';
import Burger from '../../components/Burger/Burger';
import './UserIndividualOrrder.css';

const UserIndividualOrrder = ({ email }) => {
    const params = useParams();
    const [loading, setLoading] = React.useState(false);
    const [burgerData, setBurgerData] = React.useState(null);
    const getData = React.useCallback(async () => {
        setLoading(true);
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const body = JSON.stringify({ 'email': email });

        axios.post(`http://localhost:8000/api/order/${params.id}/`, body, config)
            .then(res => {
                setBurgerData(res.data.orders);
                setLoading(false);
            })
            .catch(err => {
                toast.error("something went wrong");
                setLoading(false);

            });

    }, [email, params]);
    React.useEffect(() => {
        getData();
    }, [getData]);
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    return (
        <>
            {loading ? <HashLoader speedMultiplier={1.5} color={'#262626'} style={{ marginLeft: "50%" }} size={100} /> :
                burgerData && <div>
                    <div className='order-burger-wrapper'>
                        <Burger ingredients={burgerData.burger} />
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
                                            <td>{burgerData.burger.salad}</td>
                                            <td>40</td>
                                            <td>{burgerData.burger.salad * 40}</td>
                                        </tr>
                                        <tr>
                                            <td>Cheese</td>
                                            <td>{burgerData.burger.cheese}</td>
                                            <td>60</td>
                                            <td>{burgerData.burger.cheese * 60}</td>
                                        </tr>
                                        <tr>
                                            <td>Meat</td>
                                            <td>{burgerData.burger.meat}</td>
                                            <td>130</td>
                                            <td>{burgerData.burger.meat * 130}</td>
                                        </tr>
                                        <tr>
                                            <td>Bacon</td>
                                            <td>{burgerData.burger.bacon}</td>
                                            <td>40</td>
                                            <td>{burgerData.burger.bacon * 40}</td>
                                        </tr>
                                        <tr >
                                            <td colSpan={4}>Total Price: {burgerData.total_price}$</td>

                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className='card-extra-wrapper'>
                        <span><b>Order Id:</b> {burgerData.order_id}</span>
                        <span><b>Order Date:</b> {new Date(burgerData.order_time).toLocaleDateString("en-US", options)}</span>
                    </div>
                </div>}
        </>
    );
};
const mapStateToProps = state => ({
    email: state.auth.user.email,
});
export default connect(mapStateToProps,)(UserIndividualOrrder);