import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import {updateOrder} from '../../actions/orderActions/updateOrderActions';


class RestaurantOrders extends Component {

    constructor(props) {
        super(props);

        var restaurant = this.props.restaurant;
        this.state = {
            restaurant: restaurant[0],
            orderDetails: this.props.orderDetails,
            orderFiltered: this.props.orderDetails,
            customer: null,
            submitted: false,
            redirectToCustomer: false,
            orderUpdatedStatus: null,
            reRender: false
        }

        this.submitCustomerProfile = this.submitCustomerProfile.bind(this);
        this.orderStatusFilterHandler = this.orderStatusFilterHandler.bind(this);
    }

    componentDidUpdate(prevProps){

        if(this.state.orderDetails !== this.props.orderDetails){
            this.setState({          
                orderFiltered: this.props.orderDetails,
                orderDetails: this.props.orderDetails
            });
        }
    }

    submitCustomerProfile = (id) => {
        console.log("Submit Customer Profile: ", id);
        let customer = null;

        this.props.orderDetails.forEach(order => {

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
                orderFiltered: this.props.orderDetails
            })
        }
        else if (status === "Delivered") {

            this.props.orderDetails.forEach(order => {

                if (order.OrderStatus === status || order.OrderStatus === "Picked up") {
                    list.push(order);
                }
            })
            this.setState({
                orderFiltered: list
            })
        }
        else if (status === "Cancelled") {

            this.props.orderDetails.forEach(order => {

                if (order.OrderStatus === status) {
                    list.push(order);
                }
            })
            this.setState({
                orderFiltered: list
            })
        }
        else {

            this.props.orderDetails.forEach(order => {

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

        // e.preventDefault();
        const data = {
            orderId : a.OrderId,
            status: e.target.value,
            id: this.state.restaurant.RestaurantId,
            type: "restaurant"
        }

        this.setState({
            submitted: true
        })

        this.props.updateOrder(data);
    }

    render() {

        console.log("Order Filtered - Restaurant Order: ", this.state.orderFiltered)

        var redirectVar = null;
        var orderEmptyMsg = null;

        if (this.state.redirectToCustomer) {
            redirectVar = <Redirect to={{ pathname: "/customerProfile", state: { customer: this.state.customer } }} />
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
                                        <li><a href="/restaurantProfile">Rest Profile</a></li>
                                        <li><a href="/restaurantOrders">Orders</a></li>
                                        <li><a href="/">Events</a></li>
                                        <li><a href="/restaurantLogout">Sign Out</a></li>
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

const mapStateToProps = (state) => {
    console.log("state update rest order reducer:",state.resState);
    return {
        restaurant: state.resState.restaurant ||  "",
        orderDetails: state.resState.orderDetails ||  "",
        orderFiltered: state.resState.orderDetails || ""
    };
};


const mapDispatchToProps = (dispatch) => {
    return{
        updateOrder: (payload) => dispatch(updateOrder(payload)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(RestaurantOrders);