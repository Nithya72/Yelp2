import React, { Component } from 'react';
import '../../App.css';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { followYelpUser } from '../../actions/yelpUsersActions/followYelpUserActions';
import { getCustomerById } from '../../actions/landingActions/getCustomerActions';

class YelpUsers extends Component {

    constructor(props) {
        super(props);

        this.state = {
            yelpUsers: this.props.yelpUsers,
            filteredYelpUsers: this.props.yelpUsers,
            successFlag: false,
            redirect: false,
            customer: this.props.customer[0],
            userName: null,
            userLocation: null,
            redirectToUsers: false,
            user: null,

            offset: 0,
            perPage: 3,
            currentPage: 0,
            usersToDisplay: [],
            orgUsersToDisplay: []
        }
        this.userLocationHandler = this.userLocationHandler.bind(this);
        this.userNameHandler = this.userNameHandler.bind(this);
        this.searchHandler = this.searchHandler.bind(this);
        this.userFilterHandler = this.userFilterHandler.bind(this);
        this.followHandler = this.followHandler.bind(this);
        this.submitUser = this.submitUser.bind(this);

    }

    componentDidMount(){
        this.applyPagination();
    }

    applyPagination(){
        var users = this.state.yelpUsers;
        var slice = users.slice(this.state.offset, this.state.offset+this.state.perPage);

        this.setState({
            pageCount: Math.ceil(users.length / this.state.perPage),
            orgUsersToDisplay : users,
            usersToDisplay : slice
        })
    }

    handlePageclick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.loadMoreUsers()
        });
    }

    loadMoreUsers(){
        const data = this.state.orgUsersToDisplay;
        const slice = data.slice(this.state.offset, this.state.offset+this.state.perPage)

        this.setState({
            pageCount: Math.ceil(data.length / this.state.perPage),
            usersToDisplay: slice
        })
    }

    componentDidUpdate(prevProps) {

        if (this.state.yelpUsers !== this.props.yelpUsers) {
            console.log("Inside did update - yelp users")
            this.setState({
                yelpUsers: this.props.yelpUsers,
                filteredYelpUsers: this.props.yelpUsers
            });
        }
    }

    userNameHandler = (name) => {
        this.setState({
            userName: name.target.value
        });
    }

    userLocationHandler = (name) => {
        this.setState({
            userLocation: name.target.value
        });
    }

    submitUser = (user) => {
        console.log("Value: ", user);

        this.setState({
            redirectToUsers: true,
            user: user
        })

        this.props.getCustomerById(user._id);
    }

    followHandler = (e) => {

        var data = {
            userId: e,
            custId: this.props.customer[0]._id
        }
        this.props.followYelpUser(data);
    }

    searchHandler = (e) => {
        e.preventDefault();

        console.log("userLocation: ", this.state.userLocation);
        console.log("userName: ", this.state.userName);

        var filtered = [];

        if ((!this.state.userName || this.state.userName.length === 0) && (!this.state.userLocation || this.state.userLocation.length === 0)) {
            filtered = this.state.yelpUsers;
        }
        else {

            this.state.yelpUsers.forEach(user => {
                if ((this.state.userName && user.CustName.toLowerCase().search(this.state.userName.toLowerCase()) !== -1)) {
                    console.log(" inside here");
                    filtered.push(user)
                }


                if ((this.state.userLocation && user.CustomerCity.toLowerCase().search(this.state.userLocation.toLowerCase()) !== -1)) {
                    console.log(" inside here");
                    filtered.push(user)
                }
            })
        }

        this.setState({ filteredYelpUsers: filtered })
    }

    userFilterHandler = (e) => {
        console.log("before sorting: ", this.state.filteredYelpUsers);
        var sortedList = [];

        if (e === "following") {
            this.state.yelpUsers.forEach(element => {

                if(this.props.customer[0].Following.includes(element._id)){
                    console.log("here:", sortedList);
                    sortedList.push(element);
                }
            });

            this.setState({
                filteredYelpUsers: sortedList,
            });

        } else if (e === "all") {
            this.setState({
                filteredYelpUsers: this.state.yelpUsers,
            });
        }
    }

    render() {

        var redirectVar = null;
        var errorMessage = null;

        if (this.state.redirectToEventDetails) {
            redirectVar = <Redirect to={{ pathname: "/eventDetails", state: { event: this.state.event } }} />
        }

        if ((this.state.filteredEvents && this.state.filteredEvents.length === 0)) {
            errorMessage = <div style={{ marginTop: "20px", fontSize: "22px" }}> No Events found</div>
        }

        if (this.state.redirectToUsers && this.props.getCustomerFlag) {
            redirectVar = <Redirect to={{ pathname: "/customerProfile" }} />
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
                                        <td className="search-column"><input type="text" name="eventName" class="search-bar" placeholder="User Name" onChange={this.userNameHandler} /></td>
                                        <td className="search-column"><input type="text" name="eventLocation" class="search-bar" placeholder="Location" onChange={this.userLocationHandler} /></td>
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
                                        <li><a href="/customerProfile">About me</a></li>
                                        <li><a href="/custResLanding">Restaurants</a></li>
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
                    <div style={{ fontSize: "20px", fontWeight: "bold", color: "#d32323" }} > Yelp Users </div><br />
                    <div style={{ fontSize: "16px", fontWeight: "bold" }}> See Events For: <span style={{ color: "#0073bb" }} onClick={() => this.userFilterHandler("following")} > &nbsp;&nbsp;Following | </span> <span style={{ color: "#0073bb" }} onClick={() => this.userFilterHandler("all")} > &nbsp;&nbsp;All users | &nbsp;&nbsp; Non-Following  >></span></div>

                    <div>
                        {(this.state.usersToDisplay && this.state.usersToDisplay.length !== 0) ?
                            this.state.usersToDisplay.map(user => (
                                <table className="event-table" style={{ marginLeft: "10px" }}>
                                    <tbody>
                                        <tr>
                                            <td><img className="yelp-user-images" src={require("../../images/profile_pics/" + user.CustPic)} alt="" /></td>
                                            <td>
                                                <table style={{ marginLeft: "30px", width: "280px" }}>
                                                    <tbody>
                                                        <tr><td style={{ fontSize: "18px", fontWeight: "bold", color: "#0073bb", marginTop: "10px" }}><span className="rest-name-link" onClick={() => this.submitUser(user)}> {user.CustName}</span></td></tr>
                                                        <div style={{ fontSize: "15px", marginTop: "5px" }}><span> {user.Headline} </span></div>
                                                        <tr>
                                                            <div style={{ marginTop: "5px", color: "#0073bb", fontWeight: "bold" }}><span style={{ color: "#999", fontWeight: "bold" }}> {user.CustEmailId} </span></div>
                                                        </tr>
                                                        <tr> <div style={{ marginTop: "5px", fontSize: "15px", fontWeight: "bold" }}><span style={{ fontWeight: "bold" }}> {user.CustomerCity}, {user.CustomerState} </span></div> </tr>
                                                    </tbody>
                                                </table>
                                            </td>

                                            {this.props.customer[0].Following.includes(user._id) ?
                                                <td> <button onClick={() => this.followHandler(user._id)} class="yelp-users-button" type="submit">Following</button></td>
                                                : <td> <button onClick={() => this.followHandler(user._id)} class="yelp-users-button" type="submit">Follow</button></td>}
                                        </tr>
                                    </tbody>
                                </table>
                            )) : null}

                        <div style={{marginLeft: "200px"}}><ReactPaginate previousLabel = {"prev"} nextLabel = {"next"} breakLabel = {"..."} breakClassName = {"break-me"} pageCount ={this.state.pageCount}  marginPagesDisplayed = {2} pageRangeDisplayed = {5} onPageChange={this.handlePageclick} containerClassName = {"pagination"} subContainerClassName = {"pages pagination"} activeClassName = {"active"} /> </div>
                            
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
        yelpUsers: state.cusStore.yelpUsersDetails || "",
        filteredYelpUsers: state.cusStore.yelpUsersDetails || "",
        restaurants: state.cusStore.restaurants || "",
        getCustomerFlag: state.cusStore.getCustomerFlag
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        followYelpUser: (payload) => dispatch(followYelpUser(payload)),
        getCustomerById: (payload) => dispatch(getCustomerById(payload))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(YelpUsers);