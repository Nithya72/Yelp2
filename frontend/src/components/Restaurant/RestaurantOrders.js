import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';

class RestaurantOrders extends Component {

    constructor(props) {
        super(props);

        var restaurant = this.props.location.state.restaurant;
        console.log("Orders - Restaurant Details: ", restaurant);
        this.state = {
            restaurant: restaurant,
            orderDetails: [],
            orderFiltered: [],
            customer: null,
            redirectToCustomer: false,
            orderUpdatedStatus: null,
            redirectToRestaurant : false
        }
        this.submitCustomerProfile = this.submitCustomerProfile.bind(this);
        this.orderStatusFilterHandler = this.orderStatusFilterHandler.bind(this);
        this.redirectHandler = this.redirectHandler.bind(this);
    }


    componentDidMount() {
        console.log("On page load")

        const data = {
            id: this.state.restaurant.RestaurantId,
            type: "restaurant"
        }

        axios.post('http://localhost:3001/getOrders', data)
            .then((response) => {

                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    console.log("ComponentDidMount Order History Fetched: ", response.data);

                    this.setState({
                        orderFlag: true,
                        orderDetails: this.state.orderDetails.concat(response.data),
                        orderFiltered: this.state.orderFiltered.concat(response.data),
                    })
                } else if (response.status === 404) {
                    console.log("No Orders Found ");
                    this.setState({
                        orderFlag: false
                    })
                }
            })
            .catch((error) => {
                console.log("Error here: ", error)
            });
    }


    submitCustomerProfile = (id) => {
        console.log("Submit Customer Profile: ", id);
        let customer = null;

        this.state.orderDetails.forEach(order => {

            if (order.CustomerId === id) {

                customer = {
                    CustEmailId: order.CustEmailId,
                    CustName: order.CustName,
                    CustPassword: order.CustPassword,
                    CustPic: order.CustPic,
                    CustomerCity: order.CustomerCity,
                    CustomerCountry: order.CustomerCountry,
                    CustomerDOB: order.CustomerDOB,
                    CustomerId: order.CustomerId,
                    CustomerPhoneNo: order.CustomerPhoneNo,
                    CustomerState: order.CustomerState,
                    FindMeIn: order.FindMeIn,
                    FriendsCount: order.FriendsCount,
                    Headline: order.Headline,
                    MyBlog: order.MyBlog,
                    NickName: order.NickName,
                    PhotosCount: order.PhotosCount,
                    ReviewsCount: order.ReviewsCount,
                    ThingsLove: order.ThingsLove,
                    YelpingSince: order.YelpingSince
                }
            }
        })

        this.setState({
            customer: customer,
            redirectToCustomer: true
        })
    }

    orderStatusFilterHandler(status) {
        console.log("status: ", status);
        let list = [];

        if (status === "all") {
            this.setState({
                orderFiltered: this.state.orderDetails
            })
        }
        else if (status === "Delivered") {

            this.state.orderDetails.forEach(order => {

                if (order.OrderStatus === status || order.OrderStatus === "Picked up") {
                    list.push(order);
                }
            })
            this.setState({
                orderFiltered: list
            })
        }
        else if (status === "Cancelled") {

            this.state.orderDetails.forEach(order => {

                if (order.OrderStatus === status) {
                    list.push(order);
                }
            })
            this.setState({
                orderFiltered: list
            })
        }
        else {

            this.state.orderDetails.forEach(order => {

                if (order.OrderStatus === "Order Received") {
                    list.push(order);
                }
            })
            this.setState({
                orderFiltered: list
            })
        }

    }

    statusUpdateHandler(a, e) {
        console.log("e.target.value: ", a, ":", e.target.value);

        const data = {
            orderId : a.OrderId,
            status: e.target.value,
            id: this.state.restaurant.RestaurantId,
            type: "restaurant"
        }

        axios.post('http://localhost:3001/updateOrders', data)
        .then((response) => {

            console.log("Status Code : ", response.status);
            if (response.status === 200) {
                console.log("Status Update Handler Fetched: ", response.data);


                this.setState({
                    orderDetails: [],
                    orderFiltered: []
                })

                this.setState({
                    orderFlag: true,
                    orderDetails: this.state.orderDetails.concat(response.data),
                    orderFiltered: this.state.orderFiltered.concat(response.data),
                })
            } else if (response.status === 404) {
                console.log("No Orders Found ");
                this.setState({
                    orderFlag: false
                })
            }
        })
        .catch((error) => {
            console.log("Error here: ", error)
        });
    }

    redirectHandler(e) {
  
        this.setState({
            redirectToRestaurant: true
        })
    }

    render() {
        console.log("Order details - Restaurant Order: ", this.state.orderDetails)

        var redirectVar = null;
        var orderEmptyMsg = null;

        if (this.state.redirectToCustomer) {
            redirectVar = <Redirect to={{ pathname: "/customerProfile", state: { customer: this.state.customer } }} />
        }

        if(this.state.redirectToRestaurant){
            redirectVar = <Redirect to={{ pathname: "/restaurantProfile", state: { restaurant: this.state.restaurant, fromOrders: true } }} />
        }

        if(!this.state.orderFiltered || this.state.orderFiltered.length === 0){
            orderEmptyMsg = <div style={{color:"#d32323", fontSize:"20px", fontWeight:"bold"}}> No Orders Yet!</div>
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
                                    <li style={{ display: "block", padding: "3px 20px", lineHeight: "1.42857143", color: "#333", fontWeight: "400" }} onClick={this.redirectHandler}>Rest Profile</li>
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

                        <div>
                            <div style={{ fontWeight: "bold", color: "#d32323", fontSize: "25px", marginBottom: "8px" }}>Order History</div>
                            <div><span style={{ color: "#0373bb", fontWeight: "bold", fontSize: "17px" }} onClick={() => this.orderStatusFilterHandler("all")}> All Orders&emsp;|&emsp;</span>
                                <span style={{ color: "#0373bb", fontWeight: "bold", fontSize: "17px" }} onClick={() => this.orderStatusFilterHandler("new")}> New Order&emsp;|&emsp;</span>
                                <span style={{ color: "#0373bb", fontWeight: "bold", fontSize: "17px" }} onClick={() => this.orderStatusFilterHandler("Delivered")}> Delivered Order&emsp;|&emsp;</span>
                                <span style={{ color: "#0373bb", fontWeight: "bold", fontSize: "17px" }} onClick={() => this.orderStatusFilterHandler("Cancelled")}> Cancelled Order </span>
                            </div>
                            <br />
                        </div>
                        {orderEmptyMsg}
                        {this.state.orderFiltered.map(order => (
                            <table className="order-table" >
                                <tbody>
                                    <tr><span style={{ color: "black", fontSize: "20px", fontWeight: "bold" }}> Order# {order.OrderId} </span></tr>
                                    <tr>
                                        <td>
                                            <img style={{ border: "1px solid gray", borderRadius: "5px", height: "125px", width: "125px" }} src={require("../../images/profile_pics/" + order.CustPic)} alt="" />
                                        </td>

                                        <td>

                                            <table style={{ marginLeft: "20px", width: "475px" }}>
                                                <tbody>
                                                    <div style={{ justifyContent: "space-between", display: "flex" }}><div style={{ fontSize: "20px", fontWeight: "bold", color: "#0073bb" }}>
                                                        <span className="rest-name-link" onClick={() => this.submitCustomerProfile(order.CustomerId)}> {order.CustName}</span>
                                                    </div>
                                                        <div style={{ fontSize: "18px", color: "gray", fontWeight: "bold" }}>{(order.OrderTime).substring(0, 10)} {(order.OrderTime).substring(11, 16)}</div></div>
                                                    <tr style={{ fontSize: "18px", marginTop: "5px" }}>$ . {order.OrderAmount}</tr>
                                                    <tr><div style={{ fontSize: "18px", marginTop: "5px", justifyContent: "space-between", display: "flex" }}><div>{order.OrderDishes}</div>
                                                    </div></tr>
                                                    <tr> <div style={{ fontSize: "18px", marginTop: "5px", justifyContent: "space-between", display: "flex" }}><div>{order.DeliveryOption}</div>
                                                        <div style={{ fontWeight: "bold" }}>{order.OrderStatus}</div>
                                                    </div></tr>
                                                </tbody>
                                            </table>
                                        </td>
                                        <td>
                                            <div >
                                                {/* <SelectOption {...order} onSelect={this.statusUpdateHandler}/> */}


                                                {
                                                    order.DeliveryOption === "Delivery" ?
                                                        <select className="select-list" name="status" onChange={this.statusUpdateHandler.bind(this, order)}>
                                                            <option value="Order Received">Order Received</option>
                                                            {order.OrderStatus === "Preparing" ? <option value="Preparing" selected="true">Preparing</option> : <option value="Preparing">Preparing</option>}
                                                            {order.OrderStatus === "On the way" ? <option value="On the way" selected="true">On the way</option> : <option value="On the way">On the way</option>}
                                                            {order.OrderStatus === "Delivered" ? <option value="Delivered" selected="true">Delivered</option> : <option value="Delivered">Delivered</option>}
                                                            {order.OrderStatus === "Cancelled" ? <option value="Cancelled" selected="true">Cancelled</option> : <option value="Cancelled">Cancelled</option>}
                                                        </select> :
                                                        <select className="select-list" onChange={this.statusUpdateHandler.bind(this, order)}>
                                                            <option value="Order Received">Order Received</option>
                                                            {order.OrderStatus === "Preparing" ? <option value="Preparing" selected="true">Preparing</option> : <option value="Preparing">Preparing</option>}
                                                            {order.OrderStatus === "Pick up Ready" ? <option value="Pick up Ready" selected="true">Pick up Ready</option> : <option value="Pick up Ready">Pick up Ready</option>}
                                                            {order.OrderStatus === "Picked up" ? <option value="Picked up" selected="true">Picked up</option> : <option value="Picked up">Picked up</option>}
                                                            {order.OrderStatus === "Cancelled" ? <option value="Cancelled" selected="true">Cancelled</option> : <option value="Cancelled">Cancelled</option>}
                                                        </select>
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                                <br />
                            </table>

                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

export default RestaurantOrders;