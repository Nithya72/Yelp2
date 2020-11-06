import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { restaurantSignUp } from '../../actions/authActions/resSignupActions';

class RestaurantSignUp extends Component {

    constructor(props) {
        super(props);

        this.state = {
            restaurant: {
                restName: '',
                restEmailID: '',
                restPassword: '',
                restLocation: ''
            },
            submitted: false
        };
        this.formChangeHandler = this.formChangeHandler.bind(this);
        this.submitSignUp = this.submitSignUp.bind(this);
    }

    formChangeHandler = (e) => {
        const { name, value } = e.target;
        const { restaurant } = this.state;
        this.setState({
            restaurant: {
                ...restaurant,
                [name]: value
            }
        });
    }

    submitSignUp = (e) => {
        e.preventDefault();

        this.setState({ submitted: true });
        const { restaurant } = this.state;

        if (restaurant.restName && restaurant.restEmailID && restaurant.restPassword && restaurant.restLocation) {
            this.props.restaurantSignUp(restaurant)

        }
    }

    render() {

        const { restaurant, submitted } = this.state;

        var successAlert = null;
        var errorAlert = null;
        var final_msg = null;

        if (this.props.registerFlag === true) {
            successAlert = true;
        }else if(this.props.registerFlag === false){
            errorAlert = true;
        }

        if (successAlert && this.props.isAuthenticated) {
            final_msg = <div class="alert alert-success" role="alert">{this.props.res}<a href={'/restaurantLogin'} > Login Here.</a></div>
        } else if (errorAlert) {
            final_msg = <div class="alert alert-danger" role="alert">{this.props.res}</div>
        }

        return (
            <div >
                <div className="all-header" style={{ backgroundColor: "#d32323", height: "70px" }}>

                    <div className="header-left">
                        &emsp;<Link to="/customerSignUp" className="button">Customer SignUp</Link>
                        &emsp;<Link to="/customerLogin" style={{ color: "white", fontWeight: "bold" }}>Customer Login</Link>
                    </div>

                    <img className="logo1" src={require('../../images/logo.jpg')} alt="" />

                    <div className="header-right">
                        &emsp;&emsp;<Link to="/" className="button">Home</Link>
                        &emsp;<Link to="/restaurantLogin" style={{ color: "white", fontWeight: "bold" }}>Restaurant Login</Link>
                    </div>
                </div>
                <div className="two-column">
                    <div className="column1">

                        <div className="title"> Restaurants - Sign up for Yelp</div>

                        <form name="form" >
                            <div className="form-group">
                                <input onChange={this.formChangeHandler} type="text" className="form-control" name="restName" value={restaurant.restName} required="required" placeholder="Restaurant Name" />
                                {submitted && !restaurant.restName &&
                                    <div className="help-block">Restaurant Name is required</div>
                                }
                            </div>

                            <br />
                            <div class="form-group">
                                <input onChange={this.formChangeHandler} type="email" class="form-control" name="restEmailID" value={restaurant.restEmailID} required="required" placeholder="Email ID" />
                                {submitted && !restaurant.restEmailID &&
                                    <div className="help-block">Email ID is required</div>
                                }
                            </div>

                            <br />
                            <div class="form-group">
                                <input onChange={this.formChangeHandler} type="password" class="form-control" name="restPassword" value={restaurant.restPassword} required="required" placeholder="Password" />
                                {submitted && !restaurant.restPassword &&
                                    <div className="help-block">Password is required</div>
                                }
                            </div>
                            <br />
                            <div class="form-group">
                                <input onChange={this.formChangeHandler} type="text" class="form-control" name="restLocation" value={restaurant.restLocation} required="required" placeholder="Location" />
                                {submitted && !restaurant.restLocation &&
                                    <div className="help-block">Location is required</div>
                                }
                            </div>
                            <br />
                            <div>
                                <button onClick={this.submitSignUp} class="btn btn-success sign-up-button" type="submit">Sign Up</button>
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

const mapStateToProps = (state) => {
    console.log("state sign up reducer:",state.resState);
    return {
        res:  state.resState.response_msg ||  "",
        registerFlag: state.resState.registerFlag || null,
        isAuthenticated: state.resState.isAuthenticated
    };
};


const mapDispatchToProps = (dispatch) => {
    return{
        restaurantSignUp: (restaurant) => dispatch(restaurantSignUp(restaurant))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(RestaurantSignUp);
