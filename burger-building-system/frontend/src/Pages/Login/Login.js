import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { connect } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { login } from '../../actions/auth';
import '../../assets/css/NeumorphismForm.css';
const Login = ({ login, isAuthenticated, isLoading, token, user }) => {
    const [userFormDetails, setUserFormDetails] = useState({
        email: "",
        password: ""
    });
    const { email, password } = userFormDetails;

    const loginChange = (e) => {
        setUserFormDetails({
            ...userFormDetails,
            [e.target.name]: e.target.value
        });
    };
    const handleLoginSubmit = (e) => {
        e.preventDefault();

        login({ email, password });
    };
    if (isAuthenticated && user && user.isVerified && user.is_superuser === false) {
        return <Navigate to="/" />;
    }
    else if (isAuthenticated && user && user.isVerified && user.is_superuser === true) {
        return <Navigate to="/admin-dashboard" />;
    }
    else if (isAuthenticated && user && !user.isVerified) {
        return <Navigate to="/user/email-confirm" />;
    }

    else {
        return (
            <React.Fragment>
                <p style={{ height: '20px' }}></p>

                <div className="form-container" style={{ height: '620px' }}>
                    <div className="avatar"></div>
                    <div className="title">Burger Builder</div>
                    <div className="sub-title">CR3W</div>
                    <form onSubmit={(e) => handleLoginSubmit(e)}>
                        <div className="username">
                            <i className="fa fa-envelope"></i>
                            <input type="text"
                                className="name-input"
                                onChange={e => loginChange(e)}
                                placeholder="E-mail"
                                name="email"
                                value={email}
                            />
                        </div>
                        <div className="password">
                            <i className="fa fa-key"></i>
                            <input
                                className="password-input"
                                type="password"
                                onChange={e => loginChange(e)}
                                placeholder="Password"
                                name="password" value={password}
                            />
                        </div>
                        <input type="submit" value="Log In" className="submit-input" />
                        <Link to="/forget-password">
                            <p style={{ 'textAlign': 'center', 'marginTop': '15px' }}>Forgotten Password ?</p>
                        </Link>
                        {/* <Link to="/registration">
                            <input type="submit" value="Create Account" id="submit-registration" />
                        </Link> */}

                    </form>
                </div>
                <p style={{ height: '20px' }}></p>
            </React.Fragment>

        );
    }
};
Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    token: PropTypes.string,
    user: PropTypes.object
};
const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading,
    token: state.auth.token,
    user: state.auth.user
});

export default connect(mapStateToProps, { login })(Login);