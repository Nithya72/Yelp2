import React, { Component } from 'react';
import '../../App.css';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';
import ReactPaginate from 'react-paginate';
import { getCusOrders } from '../../actions/orderActions/getCusOrdersActions';
import { getCusEvents } from '../../actions/eventActions/getCusEventActions';
import { cusRegisteredEvents } from '../../actions/eventActions/cusRegisteredEventsActions';
import { sendMessage } from '../../actions/messageActions/initMessageActions';
import { loadMessages } from '../../actions/messageActions/loadMessagesActions';

class CustomerProfile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            customer: this.props.customer[0],
            submitOrders: false,
            redirectRest: false,
            redirectToEvents: false,
            registeredEvents: this.props.registeredEvents,
            registeredFlag: false,
            orderFlag: false,
            orderDetails: this.props.orderDetails,
            orderFiltered: this.props.orderDetails,
            submitted: false,
            submitEvents: false,
            submitChat: false,
            showModal: false,
            msgtitle: "",
            message: "",
            redirectToMsgs: false,

            offset: 0,
            perPage: 3,
            currentPage: 0,
            ordersToDisplay: this.props.orderDetails,
            orgOrdersToDisplay: [],

        }

        this.submitUpdateProfile = this.submitUpdateProfile.bind(this);
        this.redirectToEvents = this.redirectToEvents.bind(this);
        this.getRegisteredEvents = this.getRegisteredEvents.bind(this);
        this.submitOrderHistory = this.submitOrderHistory.bind(this);
        this.orderStatusFilterHandler = this.orderStatusFilterHandler.bind(this);
        this.sendMessageHandler = this.sendMessageHandler.bind(this);
        this.closeModalHandler = this.closeModalHandler.bind(this);
        this.openModalHandler = this.openModalHandler.bind(this);
        this.formChangeHandler = this.formChangeHandler.bind(this);
        this.redirectToMessages = this.redirectToMessages.bind(this);

    }

    componentDidMount() {
        this.applyPagination();
    }

    applyPagination() {
        var orders = this.state.orderDetails;
        var slice = orders.slice(this.state.offset, this.state.offset + this.state.perPage);

        this.setState({
            pageCount: Math.ceil(orders.length / this.state.perPage),
            orgOrdersToDisplay: orders,
            ordersToDisplay: slice
        })
    }

    handlePageclick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.loadMoreReviews()
        });
    }

    loadMoreReviews() {
        const data = this.state.orgOrdersToDisplay;
        const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)

        this.setState({
            pageCount: Math.ceil(data.length / this.state.perPage),
            ordersToDisplay: slice
        })
    }

    componentDidUpdate(prevProps) {
        console.log("Inside componentDidUpdate")

        if (this.state.customer !== this.props.customer[0]) {
            console.log("Inside did update - customer")
            this.setState({
                customer: this.props.customer[0],
            });
        }

        if (this.props.getOrderFlag && this.state.orderDetails !== this.props.orderDetails) {
            console.log("Inside did update - orderDetails")
            this.setState({
                orderFlag: true,
                orderDetails: this.props.orderDetails,
                orderFiltered: this.props.orderDetails
            });
            this.applyPagination();
        }

        if (this.state.registeredEvents !== this.props.registeredEvents) {
            console.log("Inside did update - registrations")
            this.setState({
                registeredEvents: this.props.registeredEvents
            });
        }

        if (this.state.submitChat && this.props.chatMsgFlag) {
            this.setState({
                showModal: false,
                submitChat: false
            })
        }
    }

    submitUpdateProfile(e) {
        e.preventDefault();

        this.setState({
            submitted: true,
            redirectRest: true
        })
    }

    redirectToEvents(e) {

        this.setState({
            redirectToEvents: true,
        })
        this.props.getCusEvents();
    }

    orderStatusFilterHandler(status) {
        console.log("order history: ", status);

        if (status === "all") {
            this.setState({
                orderFiltered: this.state.orderDetails
            })
        }
        else if (status === "Order Received" || status === "Preparing") {

            let list = [];
            this.state.orderDetails.forEach(order => {

                if (order.OrderStatus === status) {
                    list.push(order);
                }
            })
            this.setState({
                orderFiltered: list
            })
        }
        else if (status === "delivery" || status === "takeout") {

            let list = [];
            this.state.orderDetails.forEach(order => {

                if (order.DeliveryOption === status) {
                    list.push(order);
                }
            })
            this.setState({
                orderFiltered: list
            })
        }

    }

    submitOrderHistory = (e) => {

        const customerId = this.state.customer._id;
        this.setState({
            submitOrders: true
        })
        this.props.getCusOrders(customerId);

    }


    getRegisteredEvents(e) {

        const customerId = this.state.customer._id;
        this.setState({
            submitEvents: true
        })
        this.props.cusRegisteredEvents(customerId);
    }

    openModalHandler = (e) => {
        this.setState({
            showModal: true
        })
    }

    sendMessageHandler = (e) => {

        e.preventDefault();

        this.setState({
            submitChat: true
        });

        const data = {
            title: this.state.msgtitle,
            message: this.state.message,
            restId: this.props.restaurant[0]._id,
            restName: this.props.restaurant[0].RestName,
            custId: this.props.customer[0]._id,
            custName: this.props.customer[0].CustName
        }

        this.props.sendMessage(data);
    }

    closeModalHandler = (e) => {
        this.setState({
            showModal: false
        })
    }

    formChangeHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    redirectToMessages(e) {
        this.setState({
            redirectToMsgs: true
        })
        this.props.loadMessages(this.state.customer._id);
    }

    render() {

        var redirectVar = null;
        var registeredEventsError = null;
        var orders = null;
        var emptyOrders = null;

        const { msgtitle, message } = this.state;

        console.log("this.state.ordersToDisplay: ", this.state.ordersToDisplay);

        if (this.state.redirectRest) {
            redirectVar = <Redirect to={{ pathname: "/updateCustomerProfile", state: { customer: this.state.customer } }} />
        }
        if (this.state.redirectToEvents && this.props.getEventFlag) {
            redirectVar = <Redirect to={{ pathname: "/customerEvents" }} />
        }

        if (!this.state.registeredEvents || this.state.registeredEvents.length === 0) {
            registeredEventsError = <div>We don't have any recent activity for you right now.</div>
        } else {
            registeredEventsError = <div style={{ fontWeight: "bold" }}>You have registered for the below events</div>
        }

        if (this.state.redirectToMsgs && this.props.custMsgFlag) {
            redirectVar = <Redirect to={{ pathname: "/customerMessages" }} />
        }

        if (this.props.getOrderFlag) { //this.state.orderFlag && 
            orders = <div>
                <div style={{ fontWeight: "bold", color: "#d32323", fontSize: "22px", marginBottom: "8px" }}>Order History</div>
                <div><span style={{ color: "#0373bb", fontWeight: "bold", fontSize: "17px" }} onClick={() => this.orderStatusFilterHandler("all")}> All Orders | </span>
                    <span style={{ color: "#0373bb", fontWeight: "bold", fontSize: "17px" }} onClick={() => this.orderStatusFilterHandler("Order Received")}> Order Received |</span>
                    <span style={{ color: "#0373bb", fontWeight: "bold", fontSize: "17px" }} onClick={() => this.orderStatusFilterHandler("Preparing")}> Preparing |</span>
                    <span style={{ color: "#0373bb", fontWeight: "bold", fontSize: "17px" }} onClick={() => this.orderStatusFilterHandler("delivery")}> Delivery |</span>
                    <span style={{ color: "#0373bb", fontWeight: "bold", fontSize: "17px" }} onClick={() => this.orderStatusFilterHandler("takeout")}> Pickup </span>
                </div>
                <br />
            </div>
        }

        if ((!this.state.orderFiltered || this.state.orderFiltered.length === 0) && this.state.submitOrders) {
            emptyOrders = <div style={{ fontSize: "18px", fontWeight: "bold" }}> No Orders Found!</div>
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
                                        <td className="search-column search-bar"><input type="text" placeholder="Fries, Dine In, Italian" /></td>
                                        <td className="search-column search-bar"><input type="text" placeholder="Location" /></td>
                                        <td className="search-column search-button"><button onClick={this.searchHandler} type="submit"><i className="fa fa-search search-button search-bar"></i></button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>

                    </div>

                    <div className="header-right">
                        <div className="icons">
                            <div className="icon1">For Businesses</div>
                            <div className="icon2">Write a Review</div>
                            <div className="material-icons icon3">notifications_none</div>
                            <div className="far fa-comment-dots icon4"></div>
                            <div className="icon5">
                                <div className="dropdown">
                                    <div className="material-icons" data-toggle="dropdown">account_circle</div>
                                    <ul className="dropdown-menu pull-right">
                                        <li><a href="/custResLanding">Restaurants</a></li>
                                        <li style={{ display: "block", padding: "3px 20px", lineHeight: "1.42857143", color: "#333", fontWeight: "400" }} onClick={this.redirectToMessages}>Messages</li>
                                        <li><a href="/">Orders</a></li>
                                        <li style={{ display: "block", padding: "3px 20px", lineHeight: "1.42857143", color: "#333", fontWeight: "400" }} onClick={this.redirectToEvents}>Upcoming Events</li>
                                        <li><a href="/customerLogout">Sign Out</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="grey-banner">
                    <div className="avatar-position">
                        <img style={{ border: "1px solid gray", borderRadius: "5px", height: "180px", width: "180px", marginTop: "5px" }} src={require("../../images/profile_pics/" + this.state.customer.CustPic)} alt="" />
                    </div>
                    <div className="avatar-details">
                        <div className="avatar-rest-name">{this.state.customer.CustName}</div>
                        <div className="avatar-rest-location">{this.state.customer.CustomerCity}, {this.state.customer.CustomerState}</div>
                        <div className="avatar-rest-review">
                            <span className="fas fa-user-friends" style={{ color: "#f15c01" }}></span> <span style={{ marginRight: "20px" }}>{this.state.customer.FriendsCount} Friends</span>
                            <span className="fa fa-star" style={{ color: "#f15c01" }}></span> <span style={{ marginRight: "20px" }}>{this.state.customer.ReviewsCount} Reviews</span>
                            <span className="fa fa-camera" style={{ color: "#f15c01" }}></span> <span style={{ marginRight: "20px" }}>{this.state.customer.PhotosCount} Photos</span>
                        </div>
                        <div style={{ marginLeft: "410px" }}>{this.state.customer.Headline}</div>
                    </div>
                    <div className="avatar-details-updation" >
                        <div className="fa fa-edit"></div><div onClick={this.submitUpdateProfile} className="avatar-details-updation2">&nbsp;&nbsp;Update Your Profile</div><br />
                        <div className="fa fa-camera"></div><span className="avatar-details-updation1">&nbsp;&nbsp;Add Profile Photo</span><br />
                        <div></div><span className="avatar-details-updation3" onClick={this.getRegisteredEvents}><i class='far fa-calendar-alt'></i>&nbsp;&nbsp;Registered Events</span><br />
                        <div className="fas fa-comment-alt"><span onClick={this.openModalHandler} className="avatar-details-updation1">&nbsp;&nbsp;Send Message</span></div>
                    </div>
                </div>

                <div className="cust-profile-details">
                    <div className="cust-profile-details1">
                        <span style={{ fontSize: "20px", fontWeight: "bold" }}>{this.state.customer.NickName}'s Profile</span>
                        <div style={{ color: "#e6e6e6", marginBottom: "7px" }}> ________________________ </div>
                        <div onClick={this.submitOrderHistory}>Order History</div>
                        <div style={{ color: "#e6e6e6", marginBottom: "7px" }}> ________________________ </div>
                        Friends
                        <div style={{ color: "#e6e6e6", marginBottom: "7px" }}> ________________________ </div>
                        Reviews
                        <div style={{ color: "#e6e6e6", marginBottom: "7px" }}> ________________________ </div>
                        Compliments
                        <div style={{ color: "#e6e6e6", marginBottom: "7px" }}> ________________________ </div>
                        Tips
                        <div style={{ color: "#e6e6e6", marginBottom: "7px" }}> ________________________ </div>
                        Bookmarks
                        <div style={{ color: "#e6e6e6", marginBottom: "7px" }}> ________________________ </div>
                        Collections
                        <div style={{ color: "#e6e6e6", marginBottom: "7px" }}> ________________________ </div>
                        Check-ins
                        <div style={{ color: "#e6e6e6", marginBottom: "7px" }}> ________________________ </div>
                        Yelp Cash Back
                        <div style={{ color: "#e6e6e6", marginBottom: "7px" }}> ________________________ </div>
                        Events
                    </div>
                    <div className="cust-profile-details2">
                        {orders}
                        {(this.state.ordersToDisplay) ?
                            this.state.ordersToDisplay.map(order => (

                                <table className="order-table" >
                                    <tbody>
                                        <tr>
                                            <td>
                                                <img style={{ border: "1px solid gray", borderRadius: "5px", height: "100px", width: "100px" }} src={require("../../images/profile_pics/" + order.Restaurant.ProfilePic)} alt="" />
                                            </td>

                                            <td>
                                                <table style={{ marginLeft: "20px", width: "375px" }}>
                                                    <tbody>
                                                        <div style={{ justifyContent: "space-between", display: "flex" }}><div style={{ fontSize: "18px", fontWeight: "bold", color: "#0073bb", marginTop: "2px" }}><span className="rest-name-link" > {order.Restaurant.RestName}</span></div>
                                                            <div style={{ fontSize: "16px", marginTop: "2px", color: "gray", fontWeight: "bold" }}>{(order.OrderTime).substring(0, 10)} {(order.OrderTime).substring(11, 16)}</div></div>
                                                        <tr><div style={{ fontSize: "18px", marginTop: "2px", fontWeight: "bold" }}>$.{order.OrderAmount}</div></tr>
                                                        <tr><div style={{ marginTop: "2px", justifyContent: "space-between", display: "flex" }}><div>{order.OrderDishes}</div><div style={{ color: "#d32425", fontWeight: "bold" }}>{order.OrderStatus}</div></div></tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>

                                </table>
                            )) : null}
                        {emptyOrders}

                        <div style={{ marginLeft: "160px" }}><ReactPaginate previousLabel={"prev"} nextLabel={"next"} breakLabel={"..."} breakClassName={"break-me"} pageCount={this.state.pageCount} marginPagesDisplayed={2} pageRangeDisplayed={5} onPageChange={this.handlePageclick} containerClassName={"pagination"} subContainerClassName={"pages pagination"} activeClassName={"active"} /> </div>

                        <div style={{ fontWeight: "bold", color: "#d32323", fontSize: "22px", marginBottom: "8px", marginTop: "10px" }}>Notifications</div>
                        No new friend requests or compliments at this time.
                        <div style={{ color: "#e6e6e6", marginBottom: "7px" }}> ________________________________________________________ </div>
                        <div style={{ fontWeight: "bold", color: "#d32323", fontSize: "22px", marginBottom: "8px", marginTop: "10px" }}>Recent Activity</div>
                        <div style={{ color: "#e6e6e6", marginBottom: "7px" }}> ________________________________________________________ </div>
                        {registeredEventsError}
                        {(this.state.registeredEvents) ?
                            this.state.registeredEvents.map(event => (
                                <table className="event-table" style={{ marginLeft: "0px" }}>
                                    <tbody>
                                        <tr>
                                            <td><img style={{ width: "110px", height: "110px", borderRadius: "5px" }} src={require("../../images/" + event.EventId + ".jpg")} alt="" /></td>
                                            <td>
                                                <table style={{ marginLeft: "20px", width: "375px" }}>
                                                    <tbody>
                                                        <tr><td style={{ fontSize: "15px", fontWeight: "bold", color: "#0073bb", marginTop: "10px" }}><span className="rest-name-link" onClick={() => this.submitEvent(event)}> {event.EventName}</span></td></tr>
                                                        <div style={{ fontSize: "15px", marginTop: "5px" }}>	<i class='far fa-calendar-alt'></i>&nbsp;&nbsp;{event.EventDay}, {(event.EventDate).substring(0, 10)}, {event.EventTime}</div>
                                                        <tr>
                                                            <div style={{ marginTop: "5px", textAlign: "justify" }}> {event.EventDescription} </div>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                            )) : null}

                    </div>
                    <div className="cust-profile-details3">
                        <div style={{ fontWeight: "bold", color: "#d32323", fontSize: "22px", marginBottom: "8px" }}>About {this.state.customer.NickName}.</div>
                        <div style={{ fontWeight: "bold" }}>Location</div>
                        {this.state.customer.CustomerCity}, {this.state.customer.CustomerState}
                        <br /><br /><div style={{ fontWeight: "bold" }}>Yelping Since</div>
                        {this.state.customer.YelpingSince}
                        <br /><br /><div style={{ fontWeight: "bold" }}>Things I Love</div>
                        {this.state.customer.ThingsLove}
                    </div>

                    <ReactModal isOpen={this.state.showModal} contentLabel="Minimal Modal Example"
                        style={{
                            overlay: {
                                backgroundColor: 'rgba(183, 183, 183, 0.75)'
                            },

                            content: {
                                top: "22%",
                                left: "32%",
                                width: '500px',
                                height: '400px',
                                verticalAlign: "center"

                            }
                        }}>
                        <div style={{ width: "20px", height: "20px", fontWeight: "bolder" }}>
                            <button onClick={this.closeModalHandler}>X</button>
                        </div>

                        <div>
                            <form name="form" style={{ marginLeft: "100px" }}>
                                <div style={{ fontSize: "25px", fontWeight: "bold", marginBottom: "25px" }}> Your Message... </div>
                                <div className="form-group">
                                    <input onChange={this.formChangeHandler} type="text" className="form-control" name="msgtitle" value={msgtitle} placeholder="Enter a title here" />
                                </div>

                                <br />
                                <div className="form-group" >
                                    <textarea onChange={this.formChangeHandler} style={{ width: "250px", height: "100px" }} className="form-control" name="message" value={message} placeholder="Enter your message here" />
                                </div>
                                <br />
                                <div>
                                    <button onClick={this.sendMessageHandler} className="btn btn-success sign-up-button" type="submit">Send Message</button>
                                </div>
                            </form>
                        </div>
                    </ReactModal>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    console.log("state customer profile reducer:", state.cusStore);
    return {
        customer: state.cusStore.customer || "",
        orderDetails: state.cusStore.orderDetails || "",
        getOrderFlag: state.cusStore.getOrderFlag,
        registeredEvents: state.cusStore.registeredEvents || "",
        getEventFlag: state.cusStore.getEventFlag,
        restaurant: state.resState.restaurant || "",
        chatMsgFlag: state.resState.chatMsgFlag,
        custMsgFlag: state.cusStore.custMsgFlag
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getCusOrders: (payload) => dispatch(getCusOrders(payload)),
        getCusEvents: (payload) => dispatch(getCusEvents(payload)),
        cusRegisteredEvents: (payload) => dispatch(cusRegisteredEvents(payload)),
        sendMessage: (payload) => dispatch(sendMessage(payload)),
        loadMessages: (payload) => dispatch(loadMessages(payload))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerProfile);