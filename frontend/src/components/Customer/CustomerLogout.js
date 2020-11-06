import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import {customerLogout} from '../../actions/authActions/cusLogoutActions';

class CustomerLogout extends Component {
    constructor(props) {
        super(props);

        this.props.customerLogout("logout");
    }

    render() {
        console.log("Logout render");
        var redirectVar = <Redirect to={{ pathname: "/customerLogin" }} />
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
        customerLogout: (message) => dispatch(customerLogout(message))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerLogout);