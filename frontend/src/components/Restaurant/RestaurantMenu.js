import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import StarRatings from 'react-star-ratings';

class RestaurantMenu extends Component {

    constructor(props) {
        super(props);

        console.log("Restaurant Menu: ", this.props.location.state);
        this.state = {
            restaurant: this.props.location.state.restaurant,
            entireMenu: [],
            redirectToProfile: false,
            successFlag: false,
            dishToUpdate: null,
            redirectToMenuUpdate: false,
            redirectToMenuAdd: false
        }
        this.redirectToProfile = this.redirectToProfile.bind(this);
        this.menuAddHandler = this.menuAddHandler.bind(this);
        this.menuUpdateHandler = this.menuUpdateHandler.bind(this);

    }

    redirectToProfile(e) {
        this.setState({
            redirectToProfile: true
        })
    }

    componentDidMount() {
        console.log("On page load")
        const data = {
            restaurantId: this.state.restaurant.RestaurantId
        }
        axios.post('http://localhost:3001/getMenu', data)
            .then((response) => {

                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    console.log("Menu-Dishes Fetched: ", response.data);
                    this.setState({
                        successFlag: true,
                        entireMenu: response.data
                    })
                }
            })
            .catch((error) => {
                console.log("Error here: ", error)
            });
    }

    menuAddHandler(e) {
        console.log("value of e: ", e);

        this.setState({
            redirectToMenuAdd: true
        })

    }

    menuUpdateHandler(dish){
        console.log("Dish: ", dish);
        this.setState({
            dishToUpdate: dish,
            redirectToMenuUpdate: true
        })

    }

    render() {
        console.log("Entire Menu: ", this.state.entireMenu);

        var redirectVar = null;
        if (this.state.redirectToProfile) {
            redirectVar = <Redirect to={{ pathname: "/restaurantProfile", state: { restaurant: this.state.restaurant, fromOrders: true } }} />
        }

        if(this.state.redirectToMenuUpdate){
            redirectVar = <Redirect to={{ pathname: "/addUpdateMenu", state: { restaurant: this.state.restaurant, actionType: "edit", dish: this.state.dishToUpdate } }} />
        }

        if(this.state.redirectToMenuAdd){
            redirectVar = <Redirect to={{ pathname: "/addUpdateMenu", state: { restaurant: this.state.restaurant, actionType: "add"} }} />
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
                            <div className="icon2">Write a Review</div>
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

                    <div style={{ justifyContent: "space-between", display: "flex", fontSize: "25px", color: "#f43938", fontWeight: "bold", width: "800px", marginLeft: "350px" }}>
                        <div> Entire Menu</div>
                        {/* <div onClick={() => this.menuHandler("add")}> Add a New Dish to Menu</div> */}
                        <div><button onClick={() => this.menuAddHandler("add")} className="btn btn-success sign-up-button" style={{fontSize:"18px", width:"180px"}} type="submit">Add a New Dish</button></div>
                    </div>
                    <div style={{ marginLeft: "400px", fontFamily: "Open Sans,Helvetica Neue,Helvetica,Arial,sans-serif" }}>
                        {this.state.entireMenu.map(menu => (
                            <table className="rest-table" style={{ borderRadius: "3px", width: "600px" }}>
                                <tbody >
                                    <tr>
                                        {/* <td> <CheckBoxMenu handleCheckBox={this.handleCheckBox} {...menu} /> </td> */}

                                        <td style={{ width: "100px" }}><img style={{ width: "150px", height: "150px", marginRight: "20px" }} src={require("../../images/profile_pics/" + menu.DishImg)} alt="" /></td>
                                        {/* src={require('../../images/logo.jpg')} */}

                                        <table  style={{ width: "300px" }}>
                                            <tbody>
                                                <tr><td style={{ fontSize: "25px", fontWeight: "bold" }}><span className="rest-name-link" > {menu.DishName}</span></td></tr>
                                                <tr><td style={{ fontSize: "18px", fontWeight: "bold" }}>$ {menu.DishPrice}</td></tr>
                                                <tr><td style={{ fontSize: "18px" }}>{menu.Cuisine}</td></tr>
                                                <tr><td style={{ fontSize: "18px" }}>{menu.DishMainIngd}</td></tr>
                                                <tr><td style={{ fontSize: "18px" }}>{menu.DishCategory}</td></tr>
                                                <tr><td style={{ fontSize: "18px" }}> {menu.DishDescription}</td></tr>
                                                <StarRatings rating={1} starDimension="20px" starSpacing="1px" starRatedColor="red" numberOfStars={1} name='rating' />
                                                <span style={{ marginLeft: "10px" }}>10 Reviews</span>
                                            </tbody>
                                        </table>

                                        <td><div>
                                            <button onClick={() => this.menuUpdateHandler(menu)} className="status-button" style={{ marginLeft: "50px", marginTop: "40px", width:"130px" }} type="submit">Update Dish</button>
                                        </div></td>
                                    </tr>
                                </tbody>
                            </table>
                        ))
                        }

                    </div>
                </div>
            </div>
        )
    }
}

export default RestaurantMenu;