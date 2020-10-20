import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { restaurantActions } from '../../actions';

class RestaurantLogin extends Component {
    constructor(props) {
        super(props);
        this.props.restaurantSignOut();
        this.state = {
            restEmailID: '',
            restPassword: '',
            submitted: false
        };
        this.formChangeHandler = this.formChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }

    formChangeHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    submitLogin(e) {
        e.preventDefault();
        this.setState({ submitted: true });
        const { restEmailID, restPassword } = this.state;
        if (restEmailID && restPassword) {
            this.props.restaurantSignIn(restEmailID, restPassword); //User.Actions.js
        }
    }

    render() {
        var alert  = null;
        var final_msg = null;

        if(this.props && this.props.location && this.props.location.state && this.props.location.state){
            alert = this.props.location.state.alert;
        }

        const {restEmailID, restPassword, submitted } = this.state;

        if(alert){
            final_msg = <div class="alert alert-danger" role="alert">{alert}</div>
        }

        return (
            
            <div >
                
                <div className="all-header" style={{ backgroundColor: "#d32323", height: "70px" }}>

                <div className="header-left">
                        {/* &emsp;&emsp;<Link to="/" className="button">Home</Link> */}
                        &emsp;<Link to="/customerSignUp" className="button">Customer SignUp</Link>
                        &emsp;<Link to="/customerLogin" style={{ color: "white", fontWeight: "bold" }}>Customer Login</Link>
                    </div>

                    <img className="logo1" src={require('../../images/logo.jpg')} alt="" />

                    <div className="header-right">
                        &emsp;<Link to="/restaurantSignUp" style={{ color: "white", fontWeight: "bold" }}>Restaurant SignUp</Link>
                        &emsp;&emsp;<Link to="/" className="button">Home</Link>
                    </div>
                </div>
                <div className="two-column">
                    <div className="column1">

                        <div className="title"> Restaurants - Sign in to Yelp</div>

                        {alert && alert.message &&
                            <div className={'alert ${alert.type}'}>{alert.message}</div>
                        }
                        <form name="form">

                            <div className="form-group">
                                <input onChange={this.formChangeHandler} type="email" className="form-control" name="restEmailID" value={restEmailID} required="required" placeholder="Email ID" />
                                {submitted && !restEmailID &&
                                    <div className="help-block">Email ID is required</div>
                                }
                            </div>

                            <br />
                            <div className="form-group">
                                <input onChange={this.formChangeHandler} type="password" className="form-control" name="restPassword" value={restPassword} required="required" placeholder="Password" />
                                {submitted && !restPassword &&
                                    <div className="help-block">Password is required</div>
                                }
                            </div>
                            <br />
                            <div>
                                <button onClick={this.submitLogin} className="btn btn-success sign-up-button" type="submit">Login</button>
                            </div>
                        </form>
                        <br /><br />
                        <div>{final_msg}</div>
                    </div>
                    <div className="column2">
                        <img src={require('../../images/signup.jpg')} alt="" />
                    </div>

                </div>
            </div>
        )
    }
}


function mapState(state) {
    const { loggingIn, alert } = state.login;
    return { loggingIn, alert };
}

const actionCreators = {
    restaurantSignIn: restaurantActions.restaurantSignIn,
    restaurantSignOut: restaurantActions.restaurantSignOut
};

const connectedLoginPage = connect(mapState, actionCreators)(RestaurantLogin);
export { connectedLoginPage as RestaurantLogin };