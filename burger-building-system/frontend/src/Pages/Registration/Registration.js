import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { connect } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { create_student_user } from '../../actions/auth';
import '../../assets/css/NeumorphismForm.css';

const Registration = ({ create_student_user, isAuthenticated, isLoading, token, user }) => {
    const [student, setStudent] = useState({
        fullname: '',
        email: '',
        password: '',
        password2: ''
    });
    const handleChange = (e) => setStudent({
        ...student,
        [e.target.name]: e.target.value
    });
    const { fullname, email, password, password2 } = student;
    const handleSubmit = (e) => {
        e.preventDefault();
        create_student_user({ fullname, email, password, password2 });
    };
    if (user) {
        if (isAuthenticated && !user.is_verified) {
            return <Navigate to="/user/email-confirm" />;
        }
        else if (isAuthenticated && user.is_verified) {
            return <Navigate to="/" />;
        }
    }
    else {
        return (
            <React.Fragment>
                <p style={{ height: '20px' }}></p>
                <div class="form-container">

                    <div class="title">Burger Builder</div>

                    <form onSubmit={e => handleSubmit(e)}>
                        <div class="username">
                            <i class="fa fa-user"></i>
                            <input class="name-input"
                                type="text"
                                placeholder="Name"
                                name='fullname'
                                value={fullname}
                                onChange={(e) => handleChange(e)}
                            />
                        </div>
                        <div class="username">
                            <i class="fa fa-envelope"></i>
                            <input class="name-input"
                                type="text"
                                placeholder="E-mail"
                                name='email'
                                value={email}
                                onChange={(e) => handleChange(e)} />
                        </div>
                        <div class="password">
                            <i class="fa fa-key"></i>
                            <input class="password-input"
                                type="password"
                                placeholder="Password"
                                name='password'
                                value={password}
                                onChange={(e) => handleChange(e)} />
                        </div>
                        <div class="password">
                            <i class="fa fa-key"></i>
                            <input class="password-input"
                                type="password"
                                placeholder="Confirm Password"
                                name='password2'
                                value={password2}
                                onChange={(e) => handleChange(e)} />
                        </div>
                        <input type="submit" value="Create Account" class="submit-input" />
                        <p style={{ 'textAlign': 'center', 'marginTop': '15px', textDecoration: 'none', cursor: 'default', marginBottom: '10px' }}>Already have an account?</p>
                        <Link to="/login"> <input type="submit" value="Login" id="login-registration" /></Link>
                    </form>
                </div>
            </React.Fragment>
        );
    }
};
Registration.propTypes = {
    create_student_user: PropTypes.func.isRequired,
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
export default connect(mapStateToProps, { create_student_user })(Registration);