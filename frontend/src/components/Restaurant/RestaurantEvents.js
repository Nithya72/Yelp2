import React, { Component } from 'react';
import '../../App.css';
import ReactPaginate from 'react-paginate';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { getEventRegistrations } from '../../actions/eventActions/getEventRegisterations';
import { getCustomerById } from '../../actions/landingActions/getCustomerActions';

class RestaurantEvents extends Component {

    constructor(props) {
        super(props);

        console.log("constructor: ", this.props.eventDetails);
        this.state = {
            restaurant: this.props.restaurant,
            postedEvents: this.props.eventDetails,
            filteredEvents: this.props.eventDetails,
            registeredUsers: this.props.registeredUsers,
            registeredUsersFlag: null,
            eventId: null,
            redirectToCustomer: false,
            customer: [],
            restaurantId: null,
            redirectToPostEvents: false,
            submitRegistrations: false,

            offset: 0,
            perPage: 3,
            currentPage: 0,
            eventsToDisplay: [],
            orgEventsToDisplay: []
        }
        this.registeredUsersHandler = this.registeredUsersHandler.bind(this);
        this.customerProfileHandler = this.customerProfileHandler.bind(this);
    }

    componentDidMount(){
        this.applyPagination();
    }

    applyPagination(){
        
        var events = this.props.eventDetails;
        var slice = events.slice(this.state.offset, this.state.offset+this.state.perPage);

        this.setState({
            pageCount: Math.ceil(events.length / this.state.perPage),
            orgEventsToDisplay : events,
            eventsToDisplay : slice
        })
    }

    handlePageclick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.loadMoreEvents()
        });
    }

    loadMoreEvents(){
        const data = this.state.orgEventsToDisplay;
        const slice = data.slice(this.state.offset, this.state.offset+this.state.perPage)

        this.setState({
            pageCount: Math.ceil(data.length / this.state.perPage),
            eventsToDisplay: slice
        })
    }

    componentDidUpdate(prevProps){

        if(this.state.postedEvents !== this.props.eventDetails){
            this.setState({          
                postedEvents: this.props.eventDetails,
                filteredEvents: this.props.eventDetails,
                // eventsToDisplay: this.props.eventDetails
            });
        }
    }

    registeredUsersHandler(eventID) {

        console.log("Event Id:", eventID);
        this.setState({
            submitRegistrations: true,
            eventId: eventID
        });
    }

    customerProfileHandler(customerId) {
        console.log("customer: ", customerId);

        this.setState({
            redirectToCustomer: true,
        })

        this.props.getCustomerById(customerId);
    }

    render() {


        console.log("state: ", this.state.postedEvents)
        console.log("props: ", this.props.eventDetails)

        var redirectVar = null;
        var errorMsg = null;

        if (this.state.redirectToCustomer && this.props.getCustomerFlag) {
            redirectVar = <Redirect to={{ pathname: "/customerProfile" }} />
        }


        if(this.props.getEventFlag){
            errorMsg = <div style={{ fontSize: "18px", fontWeight: "bold" }}> {this.props.errorMsg}</div>
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
                            <div className="icon1"><a href="/postEvents">Post An Event</a></div>
                            <div className="icon2">Write a Review</div>
                            <div class="material-icons icon3">notifications_none</div>
                            <div class="far fa-comment-dots icon4"></div>
                            <div className="icon5">
                                <div className="dropdown">
                                    <div className="material-icons" data-toggle="dropdown">account_circle</div>
                                    <ul class="dropdown-menu pull-right">
                                        <li><a href="/restaurantProfile">Profile</a></li>
                                        <li><a href="/">Orders</a></li>
                                        <li><a href="/">Events</a></li>
                                        <li><a href="/restaurantLogout">Sign Out</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <hr style={{ border: "1px solid lightgray" }} />
                <div>
                    <div style={{ fontWeight: "bold", color: "#d32323", fontSize: "25px", marginBottom: "8px", marginLeft: "150px" }}>Events Posted</div>
                    {(this.state.eventsToDisplay !== null && this.state.eventsToDisplay.length !== 0) ?
                    
                    this.state.eventsToDisplay.map(event => (
                        <table className="event-table">
                            <tbody>
                                <tr>
                                    <td><img style={{ width: "150px", height: "150px", borderRadius: "5px" }} src={require("../../images/" + event.EventId + ".jpg")} alt="" /></td>
                                    <td>
                                        <table style={{ marginLeft: "20px", width: "375px" }}>
                                            <tbody>
                                                <tr><td style={{ fontSize: "15px", fontWeight: "bold", color: "#0073bb", marginTop: "10px" }}><span className="rest-name-link" onClick={() => this.submitEvent(event)}> {event.EventName}</span></td></tr>
                                                <div style={{ fontSize: "15px", marginTop: "5px" }}>	<i class='far fa-calendar-alt'></i>&nbsp;&nbsp;{event.EventDay}, {(event.EventDate).substring(0, 10)}, {event.EventTime}</div><br />
                                                <tr>
                                                    <button onClick={() => this.registeredUsersHandler(event._id)} class="event-ppl-button" type="submit">See Registered Users</button>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    <td>
                                        {/* registeredUsersFlag */}
                                        {(this.state.submitRegistrations && this.state.eventId === event._id) ?

                                            <div>
                                                {event.RegisteredUsers.map(user => (
                                                    <div style={{ fontSize: "18px", fontWeight: "bold" }} onClick={() => this.customerProfileHandler(user._id)}> <span class="event-dot"> </span>&emsp;{user.CustName} <br /></div>
                                                ))}
                                            </div>
                                            : null
                                        }
                                         {(this.state.eventId === event._id && (event.RegisteredUsers === null || event.RegisteredUsers.length === 0)) ? <div style={{ fontSize: "18px", fontWeight: "bold" }}> No Registrations Yet!</div> : null} 
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    )) :  errorMsg}
                    <div style={{marginLeft: "250px", marginTop: "30px"}}><ReactPaginate previousLabel = {"prev"} nextLabel = {"next"} breakLabel = {"..."} breakClassName = {"break-me"} pageCount ={this.state.pageCount}  marginPagesDisplayed = {2} pageRangeDisplayed = {5} onPageChange={this.handlePageclick} containerClassName = {"pagination"} subContainerClassName = {"pages pagination"} activeClassName = {"active"} /> </div>
                </div>
            </div >
        )
    }

}


const mapStateToProps = (state) => {
    console.log("state update rest event reducer:",state.resState);
    return {
        restaurant: state.resState.restaurant ||  "",
        eventDetails: state.resState.eventDetails || "",
        filteredEvents: state.resState.eventDetails || "",
        registeredUsers: state.resState.registeredUsers || "",
        eventErrorMsg: state.resState.eventErrorMsg || "",
        getRegistrationsFlag: state.resState.getRegistrationsFlag,
        eventId: state.resState.eventId || "",
        getEventFlag: state.resState.getEventFlag,
        errorMsg: state.resState.errorMsg || "",
        getCustomerFlag: state.cusStore.getCustomerFlag
    };
};


const mapDispatchToProps = (dispatch) => {
    return{
        getEventRegistrations: (payload) => dispatch(getEventRegistrations(payload)),
        getCustomerById: (payload) => dispatch(getCustomerById(payload))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantEvents);