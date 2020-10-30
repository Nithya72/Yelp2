import React, { Component } from 'react';
import StarRatings from 'react-star-ratings';
import { CheckBoxMenu } from '../../CheckBoxMenu.js';
import {Redirect} from 'react-router';
import { connect } from 'react-redux';
import { placeOrder } from '../../actions/orderActions/placeOrdersActions';

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
            customer: this.props.customer[0],
            orderType: orderType,
            successFlag: false,
            menu: this.props.location.state.restaurant.Menu,
            orders: [],
            orderAmount: 0,
            orderSuccessMsg: null,
            orderSuccessFlag: null,
            redirectToRestaurants: false,
            submitted: false
        }

        this.handleCheckBox = this.handleCheckBox.bind(this);
        this.submitOrders = this.submitOrders.bind(this);
    }

    handleCheckBox(e) {

        console.log("E value Checkbox: ", e.target.checked);

        let amount = 0;
        let stateOrder = +(this.state.orderAmount);

        this.state.menu.forEach(menu => {
            if (menu.DishName === e.target.value) {
                amount = +(menu.DishPrice);
            }
        }
        )

        if (e.target.checked) {
            amount = stateOrder + amount;

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

    submitOrders = (e) => {

        e.preventDefault();

        console.log("Complete Order Details: "+this.state.orderAmount+" : "+this.state.orders );

        const data = {
            orderAmount : +(this.state.orderAmount)+2,
            orders : this.state.orders,
            restaurant: this.state.restaurant._id,
            customer: this.state.customer._id,
            restaurantName: this.state.restaurant.RestName,
            deliveryOption: this.state.orderType,
            orderStatus: "Order Received"
        }

        this.setState({
            submitted: true
        });

        this.props.placeOrder(data);

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


        if (this.state.submitted && this.props.placeOrderFlag) {
            successMsg = <div class="alert alert-success" role="alert">{this.props.successMsg}</div>
        } else if (this.state.submitted && this.props.placeOrderFlag === false) {
        successMsg = <div class="alert alert-danger" role="alert">{this.props.errorMsg}</div>
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
                                        <li><a href="/custResLanding">Restaurants</a></li>
                                        <li><a href="/restaurantOrders">Orders</a></li>
                                        <li><a href="/">Events</a></li>
                                        <li><a href="/customerLogout">Sign Out</a></li>
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

const mapStateToProps = (state) => {
    console.log("state customer order reducer:", state.cusStore);
    return {
        customer: state.cusStore.customer || "",
        successMsg: state.cusStore.successMsg,
        errorMsg: state.cusStore.errorMsg,
        placeOrderFlag: state.cusStore.placeOrderFlag
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        placeOrder: (payload) => dispatch(placeOrder(payload)),
        // getEvents: (payload) => dispatch(getEvents(payload))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerOrders);