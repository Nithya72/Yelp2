import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import CustomerEvents from './Customer/CustomerEvents';
import CustomerLogin from './Customer/CustomerLogin';
import CustomerOrders from './Customer/CustomerOrders';
import CustomerProfile from './Customer/CustomerProfile';
import CustomerSignUp from './Customer/CustomerSignUp';
import CustResLanding from './Customer/CustResLanding';
import EventDetails from './Customer/EventDetails';
import PostReviews from './Customer/PostReviews';
import UpdateCustomerProfile from './Customer/UpdateCustomerProfile';

import LandingPage from './LandingPage/LandingPage';

import AddUpdateMenu from './Restaurant/AddUpdateMenu';
import PostEvents from './Restaurant/PostEvents';
import RestaurantEvents from './Restaurant/RestaurantEvents';
import {RestaurantLogin} from './Restaurant/RestaurantLogin';
import RestaurantMenu from './Restaurant/RestaurantMenu';
import RestaurantOrders from './Restaurant/RestaurantOrders';
import {RestaurantProfile} from './Restaurant/RestaurantProfile';
import Restaurants from './Restaurant/Restaurants';
import {RestaurantSignUp} from './Restaurant/RestaurantSignUp';
import {UpdateRestProfile} from './Restaurant/UpdateRestProfile';

import { history } from '../helpers';
import { connect } from 'react-redux';
import {alertActions} from '../actions';

//Create a Main Component
export default class Main extends Component {
    constructor(props) {
        console.log("WIth constructor: ", props)
        super(props);
        // this.handleLogout = this.handleLogout.bind(this);

        // history.listen((location, action) => {

        //     props.clearAlerts();
        // });

        console.log("this.props: ", this.props)
    }
    //handle logout to destroy the cookie
    // handleLogout = () => {
    //     cookie.remove('cookie', { path: '/' })
    // }

    render() {
        // const { alert } = this.props;
        return (
            <div>
                {/* {alert.message && <div >{alert.message}</div>} */}
                <Router history={history}>
                    <Switch>
                    
                        <Route exact path="/customerEvents" component={CustomerEvents} />
                        <Route exact path="/customerLogin" component={CustomerLogin} />
                        <Route exact path="/customerOrders" component={CustomerOrders} />
                        <Route exact path="/customerProfile" component={CustomerProfile} />
                        <Route exact path="/customerSignUp" component={CustomerSignUp} />
                        <Route exact path="/custResLanding" component={CustResLanding} />
                        <Route exact path="/eventDetails" component={EventDetails} /> 
                        <Route exact path="/postReviews" component={PostReviews} />
                        <Route exact path="/updateCustomerProfile" component={UpdateCustomerProfile} />

                        <Route exact path="/addUpdateMenu" component={AddUpdateMenu} />
                        <Route exact path="/postEvents" component={PostEvents} />
                        <Route exact path="/restaurantEvents" component={RestaurantEvents} />
                        <Route exact path="/restaurantLogin" component={RestaurantLogin} />
                        <Route exact path="/restaurantMenu" component={RestaurantMenu} />
                        <Route exact path="/restaurantOrders" component={RestaurantOrders} />
                        <Route exact path="/restaurantProfile" component={RestaurantProfile} />
                        <Route exact path="/restaurants" component={Restaurants} />
                        <Route exact path="/restaurantSignUp" component={RestaurantSignUp} />
                        <Route exact path="/updateRestProfile" component={UpdateRestProfile} />

                        <Route path="/" component={LandingPage} />
                    </Switch>
                </Router>
            </div>
        )
    }
}
//Export The Main Component
// export default Main;

function mapState(state) {
    const { alert } = state;
    return { alert };
}

const actionCreators = {
    clearAlerts: alertActions.clear
};

const connectedApp = connect(mapState, actionCreators)(Main);
export { connectedApp as Main };