import React, { Component } from 'react';
import '../../App.css';
import { Redirect } from 'react-router';
import axios from 'axios';
import configurePath from '../../config';

class PostEvents extends Component {

    constructor(props) {
        super(props);

        this.state = {
            restaurant: this.props.location.state.restaurant,
            eventDetails: {
                eventRestId: this.props.location.state.restaurant.RestaurantId,
                eventName: null,
                eventDescription: null,
                eventTime: null,
                eventDate: null,
                eventLocation: null,
                eventHashtag: null,
                eventContactNo: null,
                eventType: null,
                successFlag: false
            }
        }

        this.postEventHandler = this.postEventHandler.bind(this);
        this.formChangeHandler = this.formChangeHandler.bind(this);
    }

    formChangeHandler = (e) => {
        const { name, value } = e.target;
        const { eventDetails } = this.state;
        this.setState({
            eventDetails: {
                ...eventDetails,
                [name]: value
            }
        });
    }

    postEventHandler(e) {
        e.preventDefault();
        console.log("eventDetails: ", this.state.eventDetails);

        const data = {
            eventDetails: this.state.eventDetails
        }

        axios.post(configurePath.api_host+'/postEvents', data)
            .then((response) => {

                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    console.log("CustomerEvents Fetched: ", response.data);
                    console.log("State Events: ", this.state.upcomingEvents);
                    this.setState({
                        successFlag: true
                    })
                }
            })
            .catch((error) => {
                console.log("Error here: ", error)
            });
    }

    render() {
        console.log("Restaurant Id: ", this.state.restaurantId);
        var redirectVar = null;

        if (this.state.successFlag) {
            redirectVar = <Redirect to={{ pathname: "/restaurantEvents", state: { restaurant: this.state.restaurant } }} />
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
                                        <li><a href="/restaurantLogout">Sign Out</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>

                    <hr style={{ border: "1px solid lightgray" }} />

                    <div className="rest-update-form">
                        <div style={{ color: "#d32323", fontWeight: "bold", fontSize: "25px", marginLeft: "100px" }}>
                            Post An Event </div>
                        <div style={{ color: "#e6e6e6", marginBottom: "7px", marginLeft: "100px" }}> _____________________________________________________________________________________________ </div>

                        <div style={{ marginLeft: "100px", marginTop: "50px" }}>
                            <form name="form" >

                                <div className="form-group" >
                                    <label style={{ fontSize: "15px" }} htmlFor="eventName">Event Name: </label>
                                    <input onChange={this.formChangeHandler} type="text" style={{ width: "450px", height: "30px" }} className="form-control" name="eventName" required="required" />
                                    {/* {submitted && !restaurant.restName &&
                                    <div className="help-block">Restaurant Name is required</div>
                                    } */}
                                </div>
                                <br />
                                <div class="form-group">
                                    <label style={{ fontSize: "15px" }} htmlFor="eventDescription">Event Description: </label>
                                    <textarea onChange={this.formChangeHandler} type="text" style={{ width: "450px", height: "75px" }} class="form-control" name="eventDescription" required="required" />

                                </div>
                                <br />

                                <div class="form-group">
                                    <label style={{ fontSize: "15px" }} htmlFor="eventTime">Event Time: (00:00 AM - 00:00 PM) </label>
                                    <input onChange={this.formChangeHandler} type="text" style={{ width: "450px", height: "30px" }} class="form-control" name="eventTime" required="required" />

                                </div>
                                <br />

                                <div class="form-group">
                                    <label style={{ fontSize: "15px" }} htmlFor="eventDate">Event Date: (yyyy-mm-dd)</label>
                                    <input onChange={this.formChangeHandler} style={{ width: "450px", height: "30px" }} class="form-control" name="eventDate" required="required" />

                                </div>
                                <br />
                                <div class="form-group">
                                    <label style={{ fontSize: "15px" }} htmlFor="eventLocation">Event Location: </label>
                                    <input onChange={this.formChangeHandler} style={{ width: "450px", height: "30px" }} class="form-control" name="eventLocation" required="required" />

                                </div>
                                <br />
                                <div class="form-group">
                                    <label style={{ fontSize: "17px" }} htmlFor="eventHashtag">Event Hashtags: </label>
                                    <input onChange={this.formChangeHandler} style={{ width: "450px", height: "30px" }} class="form-control" name="eventHashtag" required="required" />

                                </div>
                                <br />
                                <div class="form-group">
                                    <label style={{ fontSize: "17px" }} htmlFor="eventContactNo">Event Contact No: </label>
                                    <input onChange={this.formChangeHandler} style={{ width: "450px", height: "30px" }} class="form-control" name="eventContactNo" required="required" />

                                </div>
                                <br />
                                <div class="form-group">
                                    <label style={{ fontSize: "17px" }} htmlFor="eventType">Event Type: </label>
                                    <input onChange={this.formChangeHandler} style={{ width: "450px", height: "30px" }} class="form-control" name="eventType" required="required" />

                                </div>
                                <br />
                                <div>
                                    <button onClick={this.postEventHandler} class="btn btn-success sign-up-button" type="submit">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default PostEvents;