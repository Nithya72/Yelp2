import React, { Component } from 'react';
import StarRatings from 'react-star-ratings';
import ReactPaginate from 'react-paginate';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { getOrders } from '../../actions/orderActions/getOrderActions';
import { getEvents } from '../../actions/eventActions/getEventActions';
import { resLoadMessages } from '../../actions/messageActions/resLoadMessagesActions';

//Pagination - Ref: https://www.youtube.com/watch?v=OFFuBrUa6_0&ab_channel=GKTechy

class RestaurantProfile extends Component {

    constructor(props) {
        super(props);

        console.log("Constrcutor - res Profile: ", this.props.restaurant[0])

        this.state = {
            restaurant: this.props.restaurant[0],
            submitted: false,
            redirectRest: false,
            redirectToEvents: false,
            redirectToMenu: false,
            redirectToOrders: false,
            offset: 0,
            perPage: 3,
            currentPage: 0,
            reviewsToDisplay: [],
            orgReviewsToDisplay: [],
            redirectToMsgs: false
        }

        console.log("State: ", this.state);
        this.submitUpdateProfile = this.submitUpdateProfile.bind(this);
        this.redirectHandler = this.redirectHandler.bind(this);
        this.redirectToEvents = this.redirectToEvents.bind(this);
        this.editMenuHandler = this.editMenuHandler.bind(this);
        this.handlePageclick = this.handlePageclick.bind(this);
        this.redirectToMessages = this.redirectToMessages.bind(this);
    }

    componentDidMount(){
        this.applyPagination();
    }

    applyPagination(){
        var reviews = this.props.restaurant[0].Reviews;
        var slice = reviews.slice(this.state.offset, this.state.offset+this.state.perPage);

        this.setState({
            pageCount: Math.ceil(reviews.length / this.state.perPage),
            orgReviewsToDisplay : reviews,
            reviewsToDisplay : slice
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

    loadMoreReviews(){
        const data = this.state.orgReviewsToDisplay;
        const slice = data.slice(this.state.offset, this.state.offset+this.state.perPage)

        this.setState({
            pageCount: Math.ceil(data.length / this.state.perPage),
            reviewsToDisplay: slice
        })
    }

    submitUpdateProfile(e) {
        e.preventDefault();
        this.setState({
            submitted: true,
            redirectRest: true
        })
        console.log("State in submitUpdateProfile : ", this.state);
    }

    redirectToEvents(e) {
        this.setState({
            redirectToEvents: true
        })

        const data = {
            id: this.state.restaurant._id,
            user: "restaurant"
        }

        this.props.getEvents(data);
    }

    redirectHandler(e) {

        this.setState({
            redirectToOrders: true
        })

        this.props.getOrders(this.state.restaurant._id);

    }

    redirectToMessages(e){
        this.setState({
            redirectToMsgs: true
        })
        this.props.loadMessages(this.state.restaurant._id);
    }

    editMenuHandler(e) {
        this.setState({
            redirectToMenu: true
        })
    }

    render() {
        console.log("Restaurant: ", this.state);
        var redirectVar = null;
        // var noReviewsMsg = null;

        if (this.state.redirectRest) {
            redirectVar = <Redirect to={{ pathname: "/updateRestProfile" }} />
        }

        if (this.state.redirectToEvents && this.props.getEventFlag) {
            redirectVar = <Redirect to={{ pathname: "/restaurantEvents" }} />
        }
        if (this.state.redirectToMenu) {
            redirectVar = <Redirect to={{ pathname: "/restaurantMenu" }} />
        }

        if (this.state.redirectToOrders && this.props.getOrderFlag) {
            redirectVar = <Redirect to={{ pathname: "/restaurantOrders" }} />
        }

        if(this.state.redirectToMsgs && this.props.restMsgFlag){
            redirectVar = <Redirect to={{ pathname: "/restaurantMessages" }} />
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
                                        <li><a href="/">Home</a></li>
                                        <li style={{ display: "block", padding: "3px 20px", lineHeight: "1.42857143", color: "#333", fontWeight: "400" }} onClick={this.redirectToMessages}>Messages</li>
                                        <li style={{ display: "block", padding: "3px 20px", lineHeight: "1.42857143", color: "#333", fontWeight: "400" }} onClick={this.redirectHandler}>Order History</li>
                                        <li style={{ display: "block", padding: "3px 20px", lineHeight: "1.42857143", color: "#333", fontWeight: "400" }} onClick={this.redirectToEvents}>Events Posted</li>
                                        <li><a href="/restaurantLogout">Sign Out</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rest-pic1">

                    <img src={require("../../images/" + this.state.restaurant.ImageSrc + "1.jpg")} alt="" />
                    <img src={require("../../images/" + this.state.restaurant.ImageSrc + "2.jpg")} alt="" />
                    <img src={require("../../images/" + this.state.restaurant.ImageSrc + "3.jpg")} alt="" />
                    <img src={require("../../images/" + this.state.restaurant.ImageSrc + "4.jpg")} alt="" />
                </div>

                <div className="rest-landing-all">
                    <span>
                        <img className="rest-profile-pic" src={require("../../images/profile_pics/" + this.state.restaurant.ProfilePic)} alt="" />
                    </span>

                    <div className="rest-details" style={{ marginLeft: "18px", width: "650px" }}>
                        <div style={{ fontWeight: "bolder", fontSize: "40px", marginTop: "30px" }}>{this.state.restaurant.RestName}<i class="material-icons" style={{ color: "#0373bb", marginLeft: "7px", fontSize: "15px" }}>offline_pin</i><span style={{ fontSize: "12px", color: "gray" }}>Claimed</span></div>
                        <StarRatings rating={this.state.restaurant.Rating} starDimension="20px" starSpacing="1px" starRatedColor="red" numberOfStars={5} name='rating' />
                        <span style={{ marginLeft: "15px", fontSize: "16px" }}>{this.state.restaurant.NumOfReviews} reviews</span>
                        <div style={{ fontSize: "16px", marginTop: "-10px" }}>$$ . {this.state.restaurant.Cuisine}</div>
                        <div>
                            <span style={{ color: "red", fontSize: "16px", fontWeight: "bold", marginRight: "10px" }}>Open</span>
                            <span style={{ fontWeight: "bold", fontSize: "16px", color: "gray" }}>{this.state.restaurant.RestTimings}</span>
                            <span style={{ color: "#1fbace", fontWeight: "bold", fontSize: "16px" }}>
                                <i class="material-icons" style={{ marginLeft: "10px", fontSize: "16px" }}>info_outline</i> Hours updated over 1 month ago</span>
                        </div>
                        <div style={{ fontSize: "15px" }}>{this.state.restaurant.Location} <span style={{ fontSize: "20px", color: "grey", marginRight: "10px", marginLeft: "10px" }}>|</span> {this.state.restaurant.RestPhoneNo}</div>

                        <div className="rest-buton-icons">
                            <button onClick={this.submitUpdateProfile} class="sign-up-button" type="submit">Update Profile</button>
                            <button class="sign-up-button4" type="submit"><i class="fa fa-camera"></i> &nbsp; Add / Update Photo</button>
                            <button onClick={this.editMenuHandler} class="sign-up-button3" type="submit"><i class="glyphicon glyphicon-plus"></i>&nbsp; Add / Edit Menu</button>
                        </div>
                    </div>
                    <hr style={{ border: "1px solid lightgray", marginLeft: "150px", maxWidth: "1000px" }} />
                    <div style={{ fontWeight: "bold", fontSize: "25px", fontFamily: "Open Sans,Helvetica Neue,Helvetica,Arial,sans-serif", marginBottom: "35px", marginLeft:"200px" }}> Recommended reviews </div>
                    {(this.state.reviewsToDisplay !== null && this.state.reviewsToDisplay.length !== 0) ?
                        
                        this.state.reviewsToDisplay.map(review => (

                            <div className="reviews-all">
                                
                                <div className="reviews-profile">
                                    <div className="review-img"> <img src={require("../../images/avatar.jpg")} alt="" style={{ width: "60px", height: "60px" }} /> </div>
                                    <div className="review-reviewer">
                                        <div className="review-name" style={{ fontSize: "16px", color: "#00838f" }}>{(review.CustomerName)}</div>
                                        <div className="review-nos"> 78 reviews</div>
                                        <div className="review-photos">51 photos</div>

                                    </div>
                                </div>
                                <div className="reviews-profile-text">
                                    <StarRatings rating={review.Rating} starDimension="20px" starSpacing="1px" starRatedColor="red" numberOfStars={5} name='rating' /> &nbsp; {(review.ReviewDate).substring(0, 10)}  <br /><br />
                                    {review.Comment}
                                </div>
                                <hr style={{ border: "0.06px solid #eeeeef", marginLeft: "0px", maxWidth: "900px" }} />
                            </div>
                           

                            )) : <div style={{ fontWeight: "bold", marginTop: "8px", marginLeft: "350px", fontSize: "22px", color: "#f43939" }}>No Reviews Added Yet</div>}

                            <div style={{marginLeft: "450px"}}><ReactPaginate previousLabel = {"prev"} nextLabel = {"next"} breakLabel = {"..."} breakClassName = {"break-me"} pageCount ={this.state.pageCount}  marginPagesDisplayed = {2} pageRangeDisplayed = {5} onPageChange={this.handlePageclick} containerClassName = {"pagination"} subContainerClassName = {"pages pagination"} activeClassName = {"active"} /> </div>
                            
                </div>
            </div>
        )

    }
}

const mapStateToProps = (state) => {
    console.log("state rest profile reducer:", state.resState);
    return {
        restaurant: state.resState.restaurant || "",
        updateProfile: false,
        getOrderFlag: state.resState.getOrderFlag,
        getEventFlag: state.resState.getEventFlag,
        restMsgFlag: state.resState.restMsgFlag
        // eventDetails: state.resState.eventDetails || ""
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getOrders: (payload) => dispatch(getOrders(payload)),
        getEvents: (payload) => dispatch(getEvents(payload)),
        loadMessages: (payload) => dispatch(resLoadMessages(payload))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantProfile);