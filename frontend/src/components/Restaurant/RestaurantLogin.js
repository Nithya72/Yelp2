import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { restaurantLogin } from '../../actions/authActions/resLoginActions';
import { Redirect } from 'react-router';

class RestaurantLogin extends Component {
    constructor(props) {
        super(props);
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

        const data = {
            restEmailID: this.state.restEmailID,
            restPassword: this.state.restPassword
        }
        
        this.props.restaurantLogin(data);
        
    }

    render() {
        var redirectVar  = null;
        var final_msg = null;

        const {restEmailID, restPassword, submitted } = this.state;

        if(this.props.loginFlag == false){
            final_msg = <div class="alert alert-danger" role="alert">{this.props.error_msg}</div>
        }else if(this.props.loginFlag && this.props.isAuthenticated){
            redirectVar = <Redirect to={{ pathname: "/restaurantProfile"}} />
        }

        return (
            
            <div >
                {redirectVar}
                <div className="all-header" style={{ backgroundColor: "#d32323", height: "70px" }}>

                <div className="header-left">
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

const mapStateToProps = (state) => {
    console.log("state login reducer:",state.resState);
    return {
        res:  state.resState.restaurant ||  "",
        loginFlag: state.resState.loginFlag,
        //loginFlag: false,
        error_msg: state.resState.errorMsg || "",
        isAuthenticated : state.resState.isAuthenticated
    };
};


const mapDispatchToProps = (dispatch) => {
    return{
        restaurantLogin: (restaurant) => dispatch(restaurantLogin(restaurant))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(RestaurantLogin);