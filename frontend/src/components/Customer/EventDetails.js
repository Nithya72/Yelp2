import React, { Component } from 'react';
import '../../App.css';
import { Redirect } from 'react-router';
import StarRatings from 'react-star-ratings';
import axios from 'axios';

class EventDetails extends Component {

    constructor(props) {
        super(props);

        console.log(" EventDetails - Event:", this.props.location.state.event)
        console.log(" EventDetails - Customer:", this.props.location.state.customer)

        this.state = {
            event: this.props.location.state.event,
            customer: this.props.location.state.customer,
            successFlag: false,
            successMsg: null,
            redirectToProfile: false

        }
        this.redirectHandler = this.redirectHandler.bind(this);
        this.submitRegistration = this.submitRegistration.bind(this);

    }
    redirectHandler = (e) => {
        this.setState({
            redirectToProfile: true,
        })
    }

    submitRegistration = (e) => {

        e.preventDefault();
        const data = {
            RegCustomerId: this.state.customer.CustomerId,
            RegEventId: this.state.event.EventId
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;

        axios.post('http://localhost:3001/registerToEvents', data)
            .then(response => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    console.log("Successful Login: ", response.data);
                    this.setState({
                        successFlag: true,
                        successMsg: response.data
                    })
                }
            })
            .catch(error => {
                console.log("Here we captured the error")
                this.setState({
                    successFlag: false,
                    successMsg: "Oops! We couldn't register you now. Try after sometime."
                })
            });


    }

    render() {
        var final_msg = null;
        let redirectVar = null;

        if(this.state.redirectToProfile){
            redirectVar = <Redirect to={{ pathname: "/customerProfile", state: { customer: this.state.customer } }} />
        }

        if (this.state.successFlag === true) {
            final_msg = <div style={{color:"#3c763d"}}><br />{this.state.successMsg}</div>
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
                <div className="event-grey-banner">
                    <div style={{ fontSize: "30px", fontWeight: "bold", marginLeft: "200px" }}> {this.state.event.EventName}</div>
                    <div style={{ fontSize: "15px", fontWeight: "bold", marginLeft: "200px", color: "#0073bb" }}> {this.state.event.EventType}</div>
                    <div className="event-grey-banner1">
                        <img style={{ width: "300px", height: "300px" }} src={require("../../images/" + this.state.event.EventId + ".jpg")} alt="" />
                    </div >

                    <div className="event-grey-banner2" >
                        <div>{this.state.EventPlace}</div>
                        <StarRatings rating={4} starDimension="20px" starSpacing="1px" starRatedColor="red" numberOfStars={5} name='rating' /><span> 45 reviews</span>
                        <div>330 W 20th Ave</div>
                        <div>{this.state.event.EventCity}, CA - 94401</div>
                        <div>{this.state.event.EventContactNo}</div>

                        <div style={{ color: "darkgray" }}> ___________________________________ </div>
                        <div style={{ marginTop: "20px" }}>
                            <button onClick={this.submitRegistration} class="btn btn-success sign-up-button" type="submit">Register</button>
                            <br />{final_msg}
                        </div>
                    </div>

                    <div className="event-grey-banner3">

                        <iframe title="event-map" width="300" height="300" frameborder="5" src={"https://maps.google.com/maps?q=" + this.state.event.EventLatitude + "," + this.state.event.EventLongitude + "&hl=en&z=14&output=embed"}></iframe>

                    </div>
                </div>
                <div className="event-grey-banner4">
                        <div style={{ fontWeight: "bold", color: "#d32323", fontSize:"17px" }}>What/Why:</div>
                        {this.state.event.EventDescription}
                        <br/><br />
                        {this.state.event.EventWhatWhy}

                    </div>
            </div>
        )
    }


}

export default EventDetails;