import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import {restaurantLogout} from '../../actions/authActions/resLogoutActions';

class RestaurantLogout extends Component {
    constructor(props) {
        super(props);

        this.props.restaurantLogout("logout");
    }

    render() {
        console.log("Logout render");
        var redirectVar = <Redirect to={{ pathname: "/restaurantLogin" }} />
        return (
            <div>{redirectVar}</div>
        )
    }
}

const mapStateToProps = (state) => {
    console.log("state logout reducer:",state);
    return state;
};


const mapDispatchToProps = (dispatch) => {
    return{
    restaurantLogout: (message) => dispatch(restaurantLogout(message))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantLogout);