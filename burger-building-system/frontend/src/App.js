import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { connect } from "react-redux";
import { Route, Routes } from "react-router-dom";

import { check_continuous_auth } from './actions/auth';

import Layout from './hoc/Layout/Layout';
import Login from "./Pages/Login/Login";

import ForgetPasswordConfirm from './Pages/ForgetPassword/ForgetPasswordConfirm/ForgetPasswordConfirm.js';
import ForgetPasswordStart from './Pages/ForgetPassword/ForgetPasswordStart/ForgetPasswordStart';

import AllOrders from "./Pages/AllOrders/AllOrders";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Order from "./Pages/Order/Order";
import Registration from "./Pages/Registration/Registration";
import UserEmailConfirm from "./Pages/UserEmailConfirm/UserEmailConfirm";
import UserIndividualOrrder from "./Pages/UserIndividualOrrder/UserIndividualOrrder";
import { UserPrivateRoute } from "./private/PrivateRoute";


const App = ({ check_continuous_auth }) => {
  useEffect(() => {
    check_continuous_auth();
  }, [check_continuous_auth]);


  return (
    <Layout>
      <div className="App">
        <Routes>
          <Route exact path='/registration' element={<Registration />} />
          <Route exact path='/user/email-confirm' element={<UserEmailConfirm />} />
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/forget-password' element={<ForgetPasswordStart />} />
          <Route exact path='/forget-password/confirm' element={<ForgetPasswordConfirm />} />

          <Route exact path='/order' element={
            <UserPrivateRoute>
              <Order />
            </UserPrivateRoute>} />
          <Route exact path='/all-orders' element={
            <UserPrivateRoute>
              <AllOrders />
            </UserPrivateRoute>} />
          <Route exact path='/user-order/:id/detail' element={
            <UserPrivateRoute>
              <UserIndividualOrrder />
            </UserPrivateRoute>} />
          <Route exact path='/' element={
            <UserPrivateRoute>
              <Dashboard />
            </UserPrivateRoute>} />



        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>

    </Layout>
  );

};
App.propTypes = {
  check_continuous_auth: PropTypes.func.isRequired,
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
export default connect(mapStateToProps, { check_continuous_auth })(App);
