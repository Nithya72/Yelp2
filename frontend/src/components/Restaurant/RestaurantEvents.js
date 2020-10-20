import React, { Component } from 'react';
import '../../App.css';
import { Redirect } from 'react-router';
import axios from 'axios';

class RestaurantEvents extends Component {

    constructor(props) {
        super(props);

        console.log("Restaurant Events: ", this.props.location.state);
        this.state = {
            restaurant: this.props.location.state.restaurant,
            postedEvents: [],
            filteredEvents: [],
            registeredUsers: [],
            registeredUsersFlag: null,
            eventId: null,
            redirectToCustomer: false,
            customer: [],
            restaurantId: null,
            redirectToPostEvents: false,
            errorMsg: ""
        }
        this.registeredUsersHandler = this.registeredUsersHandler.bind(this);
        this.customerProfileHandler = this.customerProfileHandler.bind(this);
        this.postEventHandler = this.postEventHandler.bind(this);
    }

    componentDidMount() {
        console.log("On page load")
        const data = {
            id: this.state.restaurant.RestaurantId,
            user: "restaurant"
        }
        axios.post('http://localhost:3001/getEvents', data)
            .then((response) => {

                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    console.log("CustomerEvents Fetched: ", response.data);
                    console.log("State Events: ", this.state.upcomingEvents);
                    this.setState({
                        successFlag: true,
                        postedEvents: this.state.postedEvents.concat(response.data),
                        filteredEvents: response.data
                    })
                }
            })
            .catch((error) => {
                console.log("Error here: ", error)
            });
    }

    registeredUsersHandler(eventId) {

        console.log("Event Id:", eventId);

        const data = {
            id: eventId
        }
        axios.post('http://localhost:3001/getRegisteredUsers', data)
            .then((response) => {

                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    console.log("CustomerEvents Fetched: ", response.data);
                    console.log("State Events: ", this.state.upcomingEvents);
                    this.setState({
                        errorMsg: null,
                        registeredUsers: response.data,
                        registeredUsersFlag: true,
                        eventId: eventId
                    })
                }else{
                    this.setState({
                        registeredUsersFlag: false,
                        errorMsg: "No registration yet!",
                        eventId: eventId
                    })
                }
            })
            .catch((error) => {
                console.log("Error here: ", error)
                this.setState({
                    registeredUsersFlag: false,
                    errorMsg: "No registration yet!",
                    eventId: eventId
                })
            });
    }


    customerProfileHandler(customer) {
        console.log("customer: ", customer);

        this.setState({
            redirectToCustomer: true,
            customer: customer
        })
    }

    postEventHandler(e) {
        this.setState({
            redirectToPostEvents: true,
            restaurantId: this.state.restaurantId
        })
    }

    render() {

        var redirectVar = null;
        var errorMessage = null;

        if (this.state.redirectToCustomer) {
            redirectVar = <Redirect to={{ pathname: "/customerProfile", state: { customer: this.state.customer } }} />
        }

        if(this.state.redirectToPostEvents){
            redirectVar = <Redirect to={{ pathname: "/postEvents", state: { restaurant: this.state.restaurant } }} />
        }

        if(this.state.registeredUsersFlag === false){
            console.log("errorMsg: ", this.state.errorMsg);
            errorMessage = <div style={{ fontSize: "18px", fontWeight: "bold" }}> {this.state.errorMsg}</div>
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
                                        <td className="search-column"><input type="text" name="eventName" class="search-bar" placeholder="Event Name" onChange={this.eventNameHandler} /></td>
                                        <td className="search-column"><input type="text" name="eventLocation" class="search-bar" placeholder="Location" /></td>
                                        <td className="search-column search-button"><button onClick={this.searchHandler} type="submit"><i class="fa fa-search search-button search-bar"></i></button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>

                    </div>

                    <div className="header-right">
                        <div className="icons">
                            <div className="icon1" onClick={this.postEventHandler}>Post An Event</div>
                            <div className="icon2">Write a Review</div>
                            <div class="material-icons icon3">notifications_none</div>
                            <div class="far fa-comment-dots icon4"></div>
                            <div className="icon5">
                                <div className="dropdown">
                                    <div className="material-icons" data-toggle="dropdown">account_circle</div>
                                    <ul class="dropdown-menu pull-right">
                                        <li style={{ display: "block", padding: "3px 20px", lineHeight: "1.42857143", color: "#333", fontWeight: "400" }} onClick={this.redirectHandler}>About me</li>
                                        <li><a href="/">Orders</a></li>
                                        <li><a href="/">Events</a></li>
                                        <li><a href="/customerLogin">Sign Out</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <hr style={{ border: "1px solid lightgray" }} />
                <div>
                    <div style={{ fontWeight: "bold", color: "#d32323", fontSize: "25px", marginBottom: "8px", marginLeft: "150px" }}>Events Posted</div>
                    {this.state.filteredEvents.map(event => (
                        <table className="event-table">
                            <tbody>
                                <tr>
                                    <td><img style={{ width: "150px", height: "150px", borderRadius: "5px" }} src={require("../../images/" + event.EventId + ".jpg")} alt="" /></td>
                                    <td>
                                        <table style={{ marginLeft: "20px", width: "375px" }}>
                                            <tbody>
                                                <tr><td style={{ fontSize: "15px", fontWeight: "bold", color: "#0073bb", marginTop: "10px" }}><span className="rest-name-link" onClick={() => this.submitEvent(event)}> {event.EventName}</span></td></tr>
                                                <div style={{ fontSize: "15px", marginTop: "5px" }}>	<i class='far fa-calendar-alt'></i>&nbsp;&nbsp;{event.EventDay}, {(event.EventDate).substring(0, 10)}, {event.EventTime}</div>
                                                <tr>
                                                    <button onClick={() => this.registeredUsersHandler(event.EventId)} class="event-ppl-button" type="submit">See Registered Users</button>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    <td>
                                        {/* registeredUsersFlag */}
                                        {(this.state.registeredUsersFlag === true && this.state.eventId === event.EventId) ?

                                            <div>
                                                {this.state.registeredUsers.map(user => (
                                                    <div style={{ fontSize: "18px", fontWeight: "bold" }} onClick={() => this.customerProfileHandler(user)}> <span class="event-dot"> </span>&emsp;{user.CustName} <br /></div>
                                                ))}
                                            </div>
                                            : this.state.eventId === event.EventId ? <div>{errorMessage}</div> : null
                                        }

                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    ))}
                </div>
            </div >
        )
    }

}

export default RestaurantEvents;