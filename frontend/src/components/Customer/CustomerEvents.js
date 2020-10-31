import React, { Component } from 'react';
import '../../App.css';
import { Redirect } from 'react-router';
import axios from 'axios';
import { connect } from 'react-redux';

class CustomerEvents extends Component {

    constructor(props) {
        super(props);

        this.state = {
            upcomingEvents: this.props.upcomingEvents,
            filteredEvents: this.props.upcomingEvents,
            eventName: null,
            successFlag: false,
            event: null,
            redirectToEventDetails: false,
            customer: this.props.customer[0],
            eventsFlag: null,
            errorMsg: null
        }
        this.eventNameHandler = this.eventNameHandler.bind(this);
        this.searchHandler = this.searchHandler.bind(this);

    }

    eventNameHandler = (name) => {
        this.setState({
            eventName: name.target.value
        });
    }

    submitEvent = (event) => {
        console.log("Value: ", event);

        this.setState({
            redirectToEventDetails: true,
            event: event
        })

    }

    searchHandler = (e) => {
        e.preventDefault();

        //set the with credentials to true
        axios.defaults.withCredentials = true;

        console.log("eventName: ", this.state.eventName);
        const data = {
            eventName : this.state.eventName
        }
        axios.post('http://localhost:3001/searchEvents', data)
            .then(response => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    console.log("Successful Login: ", response.data);
                    this.setState({
                        eventsFlag: true,
                        filteredEvents: response.data
                    })
                }
                else {
                    this.setState({
                        eventsFlag: false,
                        filteredEvents: [],
                        errorMsg: response.data
                    })
                }
            })
            .catch(error => {
                console.log("Here we captured the error")
                this.setState({
                    successFlag: false,
                    msg: "Oops! We couldn't register you now. Try after sometime."
                })
            });
    }

    render() {

        var redirectVar = null;
        var errorMessage = null;

        if (this.state.redirectToEventDetails) {
            redirectVar = <Redirect to={{ pathname: "/eventDetails", state: { event: this.state.event } }} />
        }

        if((this.state.filteredEvents && this.state.filteredEvents.length === 0)){
            errorMessage = <div style={{ marginTop: "20px", fontSize:"22px" }}> No Events found</div>
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
                            <div className="icon1">For Businesses</div>
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
                                        <li><a href="/customerLogout">Sign Out</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr style={{ border: "1px solid lightgray" }} />
                <div className="events-details">
                    <div style={{ fontSize: "20px", fontWeight: "bold", color: "#d32323" }} > Upcoming Events </div><br />
                    <div style={{ fontSize: "14px", fontWeight: "bold" }}> See Events For: <span style={{ color: "#0073bb" }}> &nbsp;Today | Tomorrow | This Weekend | This Week | Next Week | Jump to Date >></span></div>
                    {errorMessage}
                    <div>
                        {this.state.filteredEvents.map(event => (
                            <table className="event-table" style={{marginLeft:"10px"}}>
                                <tbody>
                                    <tr>
                                        <td><img className="event-images" src={require("../../images/" + event.EventId + ".jpg")} alt="" /></td>
                                        <td>
                                            <table style={{ marginLeft: "20px", width: "500px" }}>
                                                <tbody>
                                                    <tr><td style={{ fontSize: "18px", fontWeight: "bold", color: "#0073bb", marginTop: "10px" }}><span className="rest-name-link" onClick={() => this.submitEvent(event)}> {event.EventName}</span></td></tr>
                                                    <div style={{ fontSize: "15px", marginTop: "5px" }}>	<i class='far fa-calendar-alt'></i>&nbsp;&nbsp;{event.EventDay}, {(event.EventDate).substring(0, 10)}, {event.EventTime}</div>
                                                    <div style={{ fontSize: "15px", marginTop: "5px" }}><i class="fa fa-map-marker-alt"></i><span style={{ color: "#0073bb" }}>&nbsp;&nbsp;{event.EventPlace}</span><span> - {event.EventCity} </span></div>
                                                    <tr>
                                                        <div style={{ marginTop: "5px" }}> {event.EventDescription} </div>
                                                    </tr>
                                                    <tr>
                                                        <div style={{ marginTop: "5px", color: "#0073bb", fontWeight: "bold" }}>{event.EventType}<span style={{ color: "#999", fontWeight: "bold" }}> &emsp; 5 people are interested!</span></div>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    console.log("state customer events reducer:", state.cusStore);
    return {
        customer: state.cusStore.customer || "",
        upcomingEvents: state.cusStore.upcomingEvents || "",
        filteredEvents: state.cusStore.upcomingEvents
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        // getCusOrders: (payload) => dispatch(getCusOrders(payload)),
        // getCusEvents: (payload) => dispatch(getCusEvents(payload)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerEvents);