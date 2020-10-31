import React, { Component } from 'react';
import '../../App.css';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { customerSignUp } from '../../actions/authActions/cusSignupActions';

class CustomerSignUp extends Component {
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            userName: "",
            emailID: "",
            password: "",
            successFlag: null,
            msg: null,
            error: ""
        }

        this.submitSignUp = this.submitSignUp.bind(this);
        this.userNameHandler = this.userNameHandler.bind(this);
        this.emailIDHandler = this.emailIDHandler.bind(this);
        this.passwordHandler = this.passwordHandler.bind(this);
    }
    userNameHandler = (e) => {
        this.setState({
            userName: e.target.value
        });
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
    submitSignUp = (e) => {
        e.preventDefault();

        this.setState({ submitted: true });
        
        const data = {
                userName: this.state.userName,
                emailID: this.state.emailID,
                password: this.state.password
            }
            
        this.props.customerSignUp(data);
    }

    render() {

        var final_msg = null;
        var successAlert = null;
        var errorAlert = null;

        if (this.props.registerFlag === true) {
            successAlert = true;
        }else if(this.props.registerFlag === false){
            errorAlert = true;
        }

        if (successAlert && this.props.isAuthenticated) {
            final_msg = <div class="alert alert-success" role="alert">{this.props.res}<a href={'/customerLogin'} > Login Here.</a></div>
        } else if (errorAlert) {
            final_msg = <div class="alert alert-danger" role="alert">{this.props.res}</div>
        }

        return (
            <div >
             
                <div className="all-header" style={{ backgroundColor: "#d32323", height: "70px" }}>

                    <div className="header-left">
                        &emsp;&emsp;<Link to="/" className="button">Home</Link>
                        &emsp;<Link to="/customerLogin" style={{ color: "white", fontWeight: "bold" }}>Customer Login</Link>
                    </div>

                    <img className="logo1" src={require('../../images/logo.jpg')} alt=""/>

                    <div className="header-right">
                        &emsp;<Link to="/restaurantSignUp" className="button">Restaurant SignUp</Link>
                        &emsp;<Link to="/restaurantLogin" style={{ color: "white", fontWeight: "bold" }}>Restaurant Login</Link>
                    </div>
                </div>
                <div className="two-column">
                    <div className="column1">

                        <div className="title"> Customers - Sign up for Yelp</div>

                        <form name="signup">
                            <div className="form-group">
                                <input onChange={this.userNameHandler} type="text" className="form-control" name="userName" required="required" placeholder="Name" />
                            </div>

                            <br />
                            <div class="form-group">
                                <input onChange={this.emailIDHandler} type="email" class="form-control" name="emailID" required="required" placeholder="Email ID" />
                            </div>

                            <br />
                            <div class="form-group">
                                <input onChange={this.passwordHandler} type="password" class="form-control" name="password" required="required" placeholder="Password" />
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
                        <img src={require('../../images/signup.jpg')} alt=""/>
                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    console.log("state customer sign up reducer:",state.cusStore);
    return {
        res:  state.cusStore.response_msg ||  "",
        registerFlag: state.cusStore.registerFlag,
        isAuthenticated: state.cusStore.isAuthenticated
    };
};

const mapDispatchToProps = (dispatch) => {
    return{
        customerSignUp: (payload) => dispatch(customerSignUp(payload))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerSignUp);