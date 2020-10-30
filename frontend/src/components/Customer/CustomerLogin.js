import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { customerLogin } from '../../actions/authActions/cusLoginActions';

export class CustomerLogin extends Component {
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            emailID: "",
            password: "",
            successFlag: null,
            msg: null,
            error: "",
            customer: null,
            submitted: false
        }

        this.submitLogin = this.submitLogin.bind(this);
        this.emailIDHandler = this.emailIDHandler.bind(this);
        this.passwordHandler = this.passwordHandler.bind(this);
    }
    emailIDHandler = (e) => {
        this.setState({
            emailID: e.target.value
        });
    }
    passwordHandler = (e) => {
        this.setState({
            password: e.target.value
        });
    }
    submitLogin = (e) => {


        e.preventDefault();
        this.setState({ submitted: true });

        const data = {
            emailID: this.state.emailID,
            password: this.state.password
        }
        
        this.props.customerLogin(data); 
    }

    render() {

        var final_msg = null;
        let redirectVar = null;

        if (this.props.loginFlag && this.props.isAuthenticated) {
            redirectVar = <Redirect to={{ pathname:"/custResLanding" }} />
        } else if (this.props.loginFlag === false) {
            final_msg = <div class="alert alert-danger" role="alert">{this.props.error_msg}</div>
        }

        return (
            <div >
                 {redirectVar}
                <div className="all-header" style={{ backgroundColor: "#d32323", height: "70px" }}>

                    <div className="header-left">
                        &emsp;<Link to="/customerSignUp" style={{ color: "white", fontWeight: "bold" }}>Customer SignUp</Link>
                        &emsp;&emsp;<Link to="/" className="button">Home</Link>
                    </div>

                    <img className="logo1" src={require('../../images/logo.jpg')} alt=""/>

                    <div className="header-right">
                        &emsp;<Link to="/restaurantSignUp" className="button">Restaurant SignUp</Link>
                        &emsp;<Link to="/restaurantLogin" style={{ color: "white", fontWeight: "bold" }}>Restaurant Login</Link>
                    </div>
                </div>
                <div className="two-column">
                    <div className="column1">

                        <div className="title"> Customers - Sign in to Yelp</div>

                        <form>

                            <div class="form-group">
                                <input onChange={this.emailIDHandler} type="email" class="form-control" name="emailID" required="required" placeholder="Email ID" />
                            </div>

                            <br />
                            <div class="form-group">
                                <input onChange={this.passwordHandler} type="password" class="form-control" name="password" required="required" placeholder="Password" />
                            </div>
                            <br />
                            <div>
                                <button onClick={this.submitLogin} class="btn btn-success sign-up-button" type="submit">Login</button>
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
    console.log("state customer login reducer:",state.cusStore);
    return {
        customer:  state.cusStore.customer ||  "",
        restaurants:  state.cusStore.restaurants ||  "",
        loginFlag: state.cusStore.loginFlag,
        //loginFlag: false,
        error_msg: state.cusStore.errorMsg || "",
        isAuthenticated : state.cusStore.isAuthenticated
    };
};


const mapDispatchToProps = (dispatch) => {
    return{
        customerLogin: (payload) => dispatch(customerLogin(payload))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(CustomerLogin);