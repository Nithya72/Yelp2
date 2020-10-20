import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';

class AddUpdateMenu extends Component {

    constructor(props) {
        super(props);

        this.state = {

            actionType: this.props.location.state.actionType,
            restaurant: this.props.location.state.restaurant,
            dish: this.props.location.state.dish,
            submitted: false,
            redirectToProfile: false,
            successFlag: false,
            successfulUpload: null,
            dishProfilePic: null
        }

        this.updateDishHandler = this.updateDishHandler.bind(this);
        this.formChangeHandler = this.formChangeHandler.bind(this);
        this.redirectToProfile = this.redirectToProfile.bind(this);
        this.addDishHandler = this.addDishHandler.bind(this);
        this.pictureHandler = this.pictureHandler.bind(this);
        this.submitProfilePic = this.submitProfilePic.bind(this);
    }

    formChangeHandler = (e) => {
        const { name, value } = e.target;
        const { dish } = this.state;
        this.setState({
            dish: {
                ...dish,
                [name]: value
            }
        });
    }

    redirectToProfile(e) {
        this.setState({
            redirectToProfile: true
        })
    }


    updateDishHandler(e) {

        e.preventDefault();
        this.setState({
            submitted: true
        })
        const { dish } = this.state;

        axios.post('http://localhost:3001/updateMenu', dish)
            .then((response) => {

                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    console.log("After Customer Profile Updation: ", response.data);
                    this.setState({
                        successFlag: true
                    })
                }
            })
            .catch((error) => {
                console.log("Error here: ", error)
            });
    }

    addDishHandler(e) {

        e.preventDefault();
        this.setState({
            submitted: true
        })
        const data = {
            dish: this.state.dish,
            restaurantId: this.state.restaurant.RestaurantId
        }

        axios.post('http://localhost:3001/addMenu', data)
            .then((response) => {

                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    console.log("After Customer Profile Updation: ", response.data);
                    this.setState({
                        successFlag: true
                    })
                }
            })
            .catch((error) => {
                console.log("Error here: ", error)
            });
    }


    pictureHandler(e) {
        console.log("Dish Image:", e.target.files[0]);
        this.setState({
            dishProfilePic: e.target.files[0]
        });
    }

    submitProfilePic = (e) => {
        e.preventDefault();

        const picData = new FormData();
        picData.append("profilePic", this.state.dishProfilePic, this.state.dishProfilePic.name);
        picData.append("id", this.state.dish.DishId);
        picData.append("table", "Dishes");

        const { customer } = this.state;

        axios.post("http://localhost:3001/uploadProfilePic", picData)
            .then((response) => {
                if (response.status === 200) {
                    this.setState({
                        successfulUpload: "true",
                        customer: {
                            ...customer,
                            DishImg: response.data
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

    render() {
        console.log("Add Update Menu:", this.state.actionType, " : ", this.state.dish);
        // const{submitted} = this.state;

        var DishName = null;
        var DishPrice = null;
        var Cuisine = null;
        var DishMainIngd = null;
        var DishCategory = null;
        var DishDescription = null;

        var heading = null;
        var button = null;
        var uploadMsg = null;

        if (this.state.actionType === "edit") {
            DishName = this.state.dish.DishName;
            DishPrice = this.state.dish.DishPrice;
            Cuisine = this.state.dish.Cuisine;
            DishMainIngd = this.state.dish.DishMainIngd;
            DishCategory = this.state.dish.DishCategory;
            DishDescription = this.state.dish.DishDescription;

            heading = <div style={{ color: "#d32323", fontWeight: "bold", fontSize: "25px", marginLeft: "100px" }}> Update the Dish  </div>;
            button = <button onClick={this.updateDishHandler} class="btn btn-success sign-up-button" type="submit">Update Dish</button>;
        } else {
            heading = <div style={{ color: "#d32323", fontWeight: "bold", fontSize: "25px", marginLeft: "100px" }}> Add New Dish  </div>
            button = <button onClick={this.addDishHandler} class="btn btn-success sign-up-button" type="submit">Add the Dish</button>;
        }
        var redirectVar = null;
        if (this.state.redirectToProfile) {
            redirectVar = <Redirect to={{ pathname: "/restaurantProfile", state: { restaurant: this.state.restaurant, fromOrders: true } }} />
        }

        if (this.state.successFlag) {
            redirectVar = <Redirect to={{ pathname: "/restaurantMenu", state: { restaurant: this.state.restaurant } }} />
        }

        if (this.state.successfulUpload === "true") {
            redirectVar = <Redirect to={{ pathname: "/restaurantMenu", state: { restaurant: this.state.restaurant } }} />
        } else if (this.state.successfulUpload === "false") {
            uploadMsg = <div style={{ fontWeight: "bold" }}> &emsp;Couldn't upload </div>
        }

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
                            <div className="icon2" >Write a Review</div>
                            <div class="material-icons icon3">notifications_none</div>
                            <div class="far fa-comment-dots icon4"></div>
                            <div className="icon5">
                                <div className="dropdown">
                                    <div className="material-icons" data-toggle="dropdown">account_circle</div>
                                    <ul class="dropdown-menu pull-right">
                                        <li style={{ display: "block", padding: "3px 20px", lineHeight: "1.42857143", color: "#333", fontWeight: "400" }} onClick={this.redirectToProfile}>Profile</li>
                                        <li style={{ display: "block", padding: "3px 20px", lineHeight: "1.42857143", color: "#333", fontWeight: "400" }} onClick={this.redirectHandler}>Order History</li>
                                        <li style={{ display: "block", padding: "3px 20px", lineHeight: "1.42857143", color: "#333", fontWeight: "400" }} onClick={this.redirectToEvents}>Events Posted</li>
                                        <li><a href="/restaurantLogin">Sign Out</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr style={{ border: "1px solid lightgray" }} />
                <div>

                    <div className="rest-update-form">
                        {heading}

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
                                    <label style={{ fontSize: "17px" }} htmlFor="DishName">Dish Name: </label>
                                    <input onChange={this.formChangeHandler} type="text" style={{ width: "500px", height: "50px" }} className="form-control" name="DishName" value={DishName} required="required" />
                                </div>

                                <br />
                                <div class="form-group">
                                    <label style={{ fontSize: "17px" }} htmlFor="DishPrice">Dish Price: </label>
                                    <input onChange={this.formChangeHandler} type="text" style={{ width: "500px", height: "50px" }} class="form-control" name="DishPrice" value={DishPrice} required="required" />

                                </div>

                                <br />
                                <div class="form-group">
                                    <label style={{ fontSize: "17px" }} htmlFor="Cuisine">Cuisine: </label>
                                    <input onChange={this.formChangeHandler} style={{ width: "500px", height: "50px" }} class="form-control" name="Cuisine" value={Cuisine} required="required" />

                                </div>
                                <br />
                                <div class="form-group">
                                    <label style={{ fontSize: "17px" }} htmlFor="DishMainIngd">Main Ingredients: </label>
                                    <input onChange={this.formChangeHandler} type="text" style={{ width: "500px", height: "50px" }} class="form-control" name="DishMainIngd" value={DishMainIngd} />

                                </div>
                                <br />
                                <div class="form-group">
                                    <label style={{ fontSize: "17px" }} htmlFor="DishDescription">Description: </label>
                                    <textarea onChange={this.formChangeHandler} type="text" style={{ width: "500px", height: "150px" }} class="form-control" name="DishDescription" value={DishDescription} />

                                </div>
                                <br />
                                <div>
                                    <label style={{ fontSize: "17px" }} htmlFor="DishDescription">Dish Category: </label>
                                    <br />
                                    <select name="DishCategory" onChange={this.formChangeHandler} style={{ width: "500px", height: "50px" }}>
                                        {DishCategory === "Appetizer" ? <option value="Appetizer" selected="true">Appetizer</option> : <option value="Appetizer">Appetizer</option>}
                                        {DishCategory === "Salads" ? <option value="Salads" selected="true">Salads</option> : <option value="Salads">Salads</option>}
                                        {DishCategory === "Main Course" ? <option value="Main Course" selected="true">Main Course</option> : <option value="Main Course">Main Course</option>}
                                        {DishCategory === "Desserts" ? <option value="Desserts" selected="true">Desserts</option> : <option value="Desserts">Desserts</option>}
                                        {DishCategory === "Beverages" ? <option value="Beverages" selected="true">Beverages</option> : <option value="Beverages">Beverages</option>}
                                    </select>

                                </div>
                                <br />
                                <div>
                                    {button}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AddUpdateMenu;