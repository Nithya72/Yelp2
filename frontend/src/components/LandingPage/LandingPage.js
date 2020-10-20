import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import cookie from 'react-cookies';
// import './LandingPage.css';
import '../../App.css';

//create the LandingPage Component
class LandingPage extends Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }
    //handle logout to destroy the cookie
    handleLogout = () => {
        cookie.remove('cookie', { path: '/' })
    }
    render() {

        return (
            <body className="landing">
                <br/>
                
                <div style={{ marginTop: "30px" }}>
                &emsp;&emsp;<Link to="/customerSignUp" className="button">Customer SignUp</Link>
                &emsp;<Link to="/customerLogin" style={{color: "white"}}>Customer Login</Link>
                &emsp;<Link to="/restaurantSignUp" className="button">Restaurant SignUp</Link>
                &emsp;<Link to="/restaurantLogin" style={{color: "white"}}>Restaurant Login</Link>         
                </div>
            </body>
        )
    }
}

export default LandingPage;