import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Redirect } from 'react-router';
import { restaurantActions } from '../../actions';

class UpdateRestProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            restaurant: this.props.location.state.restaurant,
            submitted: false,
            restProfilePic: null,
            redirectToRestProfile: false,
            successfulUpload: null
        };

        console.log("Props: ", this.props.location.state);

        this.formChangeHandler = this.formChangeHandler.bind(this);
        this.submitUpdateRestProfile = this.submitUpdateRestProfile.bind(this);
        this.pictureHandler = this.pictureHandler.bind(this);
        this.submitProfilePic = this.submitProfilePic.bind(this);
        this.redirectHandler = this.redirectHandler.bind(this);
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

    redirectHandler = (e) => {
        this.setState({
            redirectToRestProfile: true,
        })
    }

    pictureHandler(e) {
        console.log("Restaurant Image:", e.target.files[0]);
        this.setState({
            restProfilePic: e.target.files[0]
        });
    }

    submitProfilePic = (e) => {
        e.preventDefault();

        const picData = new FormData();
        picData.append("profilePic", this.state.restProfilePic, this.state.restProfilePic.name);
        picData.append("id", this.state.restaurant.RestaurantId);
        picData.append("table", "Restaurants");

        const { restaurant } = this.state;

        axios.post("http://localhost:3001/uploadProfilePic", picData)
            .then((response) => {
                if (response.status === 200) {
                    this.setState({
                        successfulUpload: "true",
                        restaurant: {
                            ...restaurant,
                            restProfilePic: response.data
                        }
                    })
                } else {
                    this.setState({
                        successfulUpload: "false"
                    })
                }
            })
            .catch((error) => {
                console.log("Error here: ", error)
                this.setState({
                    successfulUpload: "false"
                })
            });
    }

    submitUpdateRestProfile = (e) => {
        e.preventDefault();

        this.setState({ submitted: true });
        const { restaurant } = this.state;

        console.log("in res sign up: ", restaurant);
        this.props.updateProfile(restaurant);
    }

    render() {

        // const { registering } = this.props;
        const { restaurant, submitted } = this.state;
        var uploadMsg = null;
        let redirectVar = null;

        if (this.state.successfulUpload === "true") {
            // redirectVar = <Redirect to={{ pathname: "/restaurantProfile", state: { restaurant: this.state.restaurant } }} />
            uploadMsg = <div style={{ color:"darkgreen", fontWeight: "bold" }}> &emsp;Successfully uploaded </div>
        } else if (this.state.successfulUpload === "false") {
            uploadMsg = <div style={{ fontWeight: "bold" }}> &emsp;Couldn't upload </div>
        }


        if (this.state.redirectToRestProfile) {
            redirectVar = <Redirect to={{ pathname: "/restaurantProfile", state: { restaurant: this.state.restaurant } }} />
        }

        console.log("Restaurant: ", this.state.restaurant);
        return (
            <div>
                {redirectVar}
                <div className="all-header" style={{ height: "125px" }}>

                    <div className="header-left">
                        <img className="logo1" src={require('../../images/logo.jpg')} alt="" />
                    </div>
                    <div className="all-search-bar">
                        <form>
                            <table className="search-table">
                                <tbody >
                                    <tr className="search-row">
                                        <td className="search-column"><input type="text" class="search-bar" placeholder="Fries, Dine In, Italian" /></td>
                                        <td className="search-column"><input type="text" class="search-bar" placeholder="Location" /></td>
                                        <td className="search-column search-button"><button onClick={this.searchHandler} type="submit"><i class="fa fa-search search-button search-bar"></i></button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>

                    </div>

                    <div className="header-right">
                        <div className="icons">
                            <div className="icon1">For Businesses</div>
                            <div className="icon2">Write a Review</div>
                            <div class="material-icons icon3">notifications_none</div>
                            <div class="far fa-comment-dots icon4"></div>
                            <div className="icon5">
                                <div className="dropdown">
                                    <div className="material-icons" data-toggle="dropdown">account_circle</div>
                                    <ul className="dropdown-menu pull-right">
                                        <li style={{ display: "block", padding: "3px 20px", lineHeight: "1.42857143", color: "#333", fontWeight: "400" }} onClick={this.redirectHandler}>Profile</li>
                                        <li><a href="/">Orders</a></li>
                                        <li><a href="/">Events</a></li>
                                        <li><a href="/restaurantLogin">Sign Out</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr style={{ border: "1px solid lightgray" }} />

                <div className="rest-update-form">
                    <div style={{ color: "#d32323", fontWeight: "bold", fontSize: "25px" }}>
                        Update {restaurant.RestName}'s Profile
                </div>

                    <div style={{ marginLeft: "100px", marginTop: "50px" }}>


                        <form>
                            <label style={{ fontSize: "15px" }} htmlFor="CustPic">Add/Update Profile Picture: </label>
                            <div className="file-upload">
                                <div className="form-group">
                                    <label for="file-upload-label" class="file-upload-label">
                                        <i class="file-upload-icon"></i> Choose File
                                    </label>
                                    <input id="file-upload-label" className="file-upload-input" onChange={this.pictureHandler} type="file" name="CustPic" />
                                </div>
                                <div>
                                    <button onClick={this.submitProfilePic} className="pic-upload-button" type="submit">Upload Picture</button>
                                </div>
                                {uploadMsg}
                            </div>
                            <br />
                        </form>

                        <form name="form" >

                            <div className="form-group" >
                                <label style={{ fontSize: "17px" }} htmlFor="restName">Restaurant Name: </label>
                                <input onChange={this.formChangeHandler} type="text" style={{ width: "500px", height: "50px" }} className="form-control" name="RestName" value={restaurant.RestName} required="required" />
                                {/* {!restaurant.restName &&
                                    <div className="help-block">Restaurant Name is required</div>
                                } */}
                            </div>

                            <br />
                            <div class="form-group">
                                <label style={{ fontSize: "17px" }} htmlFor="location">Restaurant Location: </label>
                                <input onChange={this.formChangeHandler} type="text" style={{ width: "500px", height: "50px" }} class="form-control" name="Location" value={restaurant.Location} required="required" />

                            </div>

                            <br />
                            <div class="form-group">
                                <label style={{ fontSize: "17px" }} htmlFor="description">Description: </label>
                                <textarea onChange={this.formChangeHandler} style={{ width: "500px", height: "150px" }} class="form-control" name="Description" value={restaurant.Description} required="required" />

                            </div>
                            <br />
                            <div class="form-group">
                                <label style={{ fontSize: "17px" }} htmlFor="restPhoneNo">Contact Number: </label>
                                <input onChange={this.formChangeHandler} type="text" style={{ width: "500px", height: "50px" }} class="form-control" name="RestPhoneNo" value={restaurant.RestPhoneNo} />

                            </div>
                            <br />
                            <div class="form-group">
                                <label style={{ fontSize: "17px" }} htmlFor="restTimings">Timings: </label>
                                <input onChange={this.formChangeHandler} type="text" style={{ width: "500px", height: "50px" }} class="form-control" name="RestTimings" value={restaurant.RestTimings} />

                            </div>
                            <br />
                            <div>
                                <button onClick={this.submitUpdateRestProfile} class="btn btn-success sign-up-button" type="submit">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

function mapState(state) {
    const { loggingIn } = state.login;
    return { loggingIn };
}

const actionCreators = {
    updateProfile: restaurantActions.updateRestProfile
};

const connectedRestProfile = connect(mapState, actionCreators)(UpdateRestProfile);
export { connectedRestProfile as UpdateRestProfile };