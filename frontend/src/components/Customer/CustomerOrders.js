import React, { Component } from 'react';
import axios from 'axios';
import StarRatings from 'react-star-ratings';
import { CheckBoxMenu } from '../../CheckBoxMenu.js';
import {Redirect} from 'react-router';

class CustomerOrders extends Component {

    constructor(props) {
        super(props);

        var restaurant = this.props.location.state.restaurant;
        console.log("Orders - Restaurant Details: ", restaurant);
        console.log("Orders - Customer Details: ", this.props.location.state.customer);

        var orderType = null;
        if (this.props.location.state.orderType === "delivery") {
            orderType = "Delivery";
        } else {
            orderType = "Pickup"
        }

        this.state = {
            restaurant: restaurant,
            customer: this.props.location.state.customer,
            orderType: orderType,
            successFlag: false,
            menu: [],
            orders: [],
            orderAmount: 0,
            orderSuccessMsg: null,
            orderSuccessFlag: false,
            redirectToRestaurants: false
        }

        this.handleCheckBox = this.handleCheckBox.bind(this);
        this.submitOrders = this.submitOrders.bind(this);
        this.redirectHandler = this.redirectHandler.bind(this);
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
                    console.log("Menu Fetched: ", response.data);

                    this.setState({
                        successFlag: true,
                        menu: this.state.menu.concat(response.data)
                    })
                }
            })
            .catch((error) => {
                console.log("Error here: ", error)
            });
    }

    handleCheckBox(e) {

        console.log("E value Checkbox: ", e.target.checked);

        let amount = 0;
        let stateOrder = +(this.state.orderAmount);
        // let orders = [];

        this.state.menu.forEach(menu => {
            if (menu.DishName === e.target.value) {
                amount = +(menu.DishPrice);
            }
        }
        )

        if (e.target.checked) {
            amount = stateOrder + amount;
            // orders = this.state.orders.concat();

            this.setState({
                orders: this.state.orders.concat(e.target.value)
            })

        } else {
            console.log("Removing stateOrder:", stateOrder);
            console.log("Removing Amount:", amount);
            amount = stateOrder - amount;

            let index = this.state.orders.indexOf(e.target.value);

            if (index > -1) {
                this.state.orders.splice(index, 1);
            }
        }

        this.setState({
            orderAmount: amount.toFixed(2)
        })

    }

    redirectHandler(e) {
        this.setState({
            redirectToRestaurants: true,
        })
    }

    submitOrders = (e) => {

        e.preventDefault();

        console.log("Complete Order Details: "+this.state.orderAmount+" : "+this.state.orders );

        const data = {
            orderAmount : +(this.state.orderAmount)+2,
            orders : this.state.orders,
            restaurantId: this.state.restaurant.RestaurantId,
            customer: this.state.customer.CustomerId,
            restaurantName: this.state.restaurant.RestName,
            deliveryOption: this.state.orderType,
            orderStatus: "Order Received"
        }

        axios.post('http://localhost:3001/placeOrders', data)
            .then((response) => {

                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    console.log("Orders Placed: ", response.data);

                    this.setState({
                        orderSuccessFlag: true,
                        orderSuccessMsg: response.data
                    })
                }
            })
            .catch((error) => {
                console.log("Error here: ", error)
            });
    }


    render() {

        console.log("Order Amount: ", this.state.orderAmount)
        console.log("Orders: ", this.state.orders)

        var orderTypeDetails = null;
        var redirectVar = null;

        if (this.state.orderType === "Delivery") {
            orderTypeDetails = <div>Additional $2 will be added as delivery fee</div>
        } else {
            orderTypeDetails = <div>Order can be picked up in 20-30 mins</div>
        }
        var successMsg = null;


        if (this.state.orderSuccessFlag) {
            successMsg = <div class="alert alert-success" role="alert">{this.state.orderSuccessMsg}</div>
        } else if (this.state.successFlag === false) {
            successMsg = <div class="alert alert-danger" role="alert">Order Failed</div>
        }

        if (this.state.redirectToRestaurants) {
            redirectVar = <Redirect to={{ pathname: "/restaurants", state: { customer: this.state.customer, restaurant: this.state.restaurant  } }} />
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
                            <div className="icon1">Post An Event</div>
                            <div className="icon2">Write a Review</div>
                            <div class="material-icons icon3">notifications_none</div>
                            <div class="far fa-comment-dots icon4"></div>
                            <div className="icon5">
                                <div className="dropdown">
                                    <div className="material-icons" data-toggle="dropdown">account_circle</div>
                                    <ul class="dropdown-menu pull-right">
                                    <li style={{ display: "block", padding: "3px 20px", lineHeight: "1.42857143", color: "#333", fontWeight: "400" }} onClick={this.redirectHandler}>Restaurants</li>
                                        <li><a href="/restaurantOrders">Orders</a></li>
                                        <li><a href="/">Events</a></li>
                                        <li><a href="/restaurantLogin">Sign Out</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <hr style={{ border: "1px solid lightgray" }} />

                    <div className="all-order">
                        <div className="all-order-menu">
                            <div style={{ color: "#d32323", fontWeight: "bold", fontSize: "35px" }}> Menu</div>

                            {this.state.menu.map(menu => (
                                <table className="rest-table" style={{ borderRadius: "3px", width: "450px" }}>
                                    <tbody >
                                        <tr>
                                            <td> <CheckBoxMenu handleCheckBox={this.handleCheckBox} {...menu} /> </td>

                                            <td style={{ width: "100px" }}><img style={{ width: "150px", height: "150px", marginRight: "20px" }} src={require("../../images/profile_pics/" + menu.DishImg)} alt="" /></td>
                                            {/* src={require('../../images/logo.jpg')} */}

                                            <table>
                                                <tbody>
                                                    <tr></tr>
                                                    <tr></tr>
                                                    <tr><td style={{ fontFamily: "Open Sans,Helvetica Neue,Helvetica,Arial,sans-serif", fontSize: "25px", fontWeight: "bold" }}><span className="rest-name-link" > {menu.DishName}</span></td></tr>
                                                    <tr></tr>
                                                    <tr></tr>
                                                    <tr><td style={{ fontFamily: "Open Sans,Helvetica Neue,Helvetica,Arial,sans-serif", fontSize: "20px", fontWeight: "bold" }}>$ {menu.DishPrice}</td></tr>
                                                    <StarRatings rating={1} starDimension="20px" starSpacing="1px" starRatedColor="red" numberOfStars={1} name='rating' />
                                                    <span style={{ marginLeft: "10px" }}>10 Reviews</span>
                                                </tbody>
                                            </table>
                                        </tr>
                                    </tbody>
                                </table>
                            ))
                            }
                        </div>
                        <div className="all-order-checkout">
                            <div style={{ fontWeight: "bold", fontSize: "30px", marginLeft: "50px", marginTop: "30px" }} >Checkout Here</div><br />
                            <div style={{ fontSize: "20px", marginLeft: "50px", marginTop: "30px", color: "grey" }} >{orderTypeDetails}</div>
                            <div style={{ fontSize: "20px", marginLeft: "50px", marginTop: "30px" }}> The total order amount is: {this.state.orderAmount}</div>
                            <div>
                                <button onClick={this.submitOrders} className="btn btn-success sign-up-button" style={{ marginLeft: "50px", marginTop: "40px" }} type="submit">Place Order</button>
                            </div>
                            <div style={{width:"330px", marginTop:"30px", marginLeft:"50px"}}>{successMsg} </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }

}

export default CustomerOrders;