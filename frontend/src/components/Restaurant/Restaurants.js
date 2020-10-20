import React, { Component } from 'react';
import StarRatings from 'react-star-ratings';
import { Redirect } from 'react-router';

class Restaurants extends Component {

    constructor(props) {
        super(props);
        console.log("Props: ", this.props.location.state.restaurant);
        console.log("Props - Customer: ", this.props.location.state.customer);

        this.state = {
            // restaurants: this.props.location.state.restaurant,
            restaurant: this.props.location.state.restaurant,
            customer: this.props.location.state.customer,
            orderType: null,
            redirectToOrder: false,
            redirectToRests: false,
            redirectToPostReview: false,
        }
        this.submitOrder = this.submitOrder.bind(this);
        this.redirectHandler = this.redirectHandler.bind(this);
        this.postReviewHandler = this.postReviewHandler.bind(this);
    }

    submitOrder(e) {
        console.log("Type of Order:", e);

        this.setState({
            orderType: e,
            redirectToOrder: true
        })

    }

    redirectHandler(e) {
        this.setState({
            orderType: e,
            redirectToRests: true
        })
    }

    postReviewHandler(e) {
        this.setState({
            redirectToPostReview: true
        })
    }

    render() {
        var redirectVar = null;
        var noReviewsMsg = null;

        if (this.state.redirectToOrder) {
            redirectVar = <Redirect to={{ pathname: "/customerOrders", state: { restaurant: this.state.restaurant, customer: this.state.customer, orderType: this.state.orderType } }} />
        }

        if (this.state.redirectToRests) {
            redirectVar = <Redirect to={{ pathname: "/custResLanding", state: { customer: this.state.customer } }} />
        }

        if (this.state.redirectToPostReview) {
            redirectVar = <Redirect to={{ pathname: "/postReviews", state: { customer: this.state.customer, restaurant: this.state.restaurant } }} />
        }

        if ((!this.state.restaurant.Review1 || this.state.restaurant.Review1.length === 0) && (!this.state.restaurant.Review2 || this.state.restaurant.Review2.length === 0) && (!this.state.restaurant.Review3 || this.state.restaurant.Review3.length === 0)) {
            noReviewsMsg = <div style={{ fontWeight: "bold", marginTop: "8px", marginLeft: "350px", fontSize: "22px", color: "#f43939" }}>No Reviews Added Yet</div>
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
                            <div className="icon2" onClick={this.postReviewHandler}>Write a Review</div>
                            <div class="material-icons icon3">notifications_none</div>
                            <div class="far fa-comment-dots icon4"></div>
                            <div className="icon5">
                                <div className="dropdown">
                                    <div className="material-icons" data-toggle="dropdown">account_circle</div>
                                    <ul className="dropdown-menu pull-right">
                                        <li style={{ display: "block", padding: "3px 20px", lineHeight: "1.42857143", color: "#333", fontWeight: "400" }} onClick={this.redirectHandler}>Restaurants</li>
                                        <li><a href="/">Orders</a></li>
                                        <li style={{ display: "block", padding: "3px 20px", lineHeight: "1.42857143", color: "#333", fontWeight: "400" }}>Upcoming Events</li>
                                        <li><a href="/customerLogin">Sign Out</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* <hr style={{ border: "1px solid lightgray" }} /> */}
                <div className="rest-pic1">

                    <img src={require("../../images/" + this.props.location.state.restaurant.ImageSrc + "1.jpg")} alt="" />
                    <img src={require("../../images/" + this.props.location.state.restaurant.ImageSrc + "2.jpg")} alt="" />
                    <img src={require("../../images/" + this.props.location.state.restaurant.ImageSrc + "3.jpg")} alt="" />
                    <img src={require("../../images/" + this.props.location.state.restaurant.ImageSrc + "4.jpg")} alt="" />
                    {/* <img src={require("../../images/" + this.props.location.state.restaurant.ImageSrc+"5.jpg")} alt="" /> */}
                </div>

                <div className="rest-landing-all">
                    <span>
                        <img className="rest-profile-pic" style={{ marginTop: "40px" }} src={require("../../images/profile_pics/" + this.state.restaurant.ProfilePic)} alt="" />
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
                            <button class="sign-up-button3" type="submit"><i class="glyphicon glyphicon-plus"></i>&nbsp; Add / Edit Menu</button>
                        </div>
                    </div>
                    <div className="rest-order">
                        <div style={{ fontWeight: "bold", marginTop: "20px", marginLeft: "15px", fontSize: "25px" }}>Order Food</div>
                        <div style={{ marginTop: "20px", marginLeft: "15px", fontSize: "15px" }}>$2.99+ fee | $0m min | 30-40 mins</div>
                        <div style={{ fontWeight: "bold", marginTop: "8px", marginLeft: "15px", fontSize: "15px", color: "#f43939" }} onClick={() => this.submitOrder("delivery")}>Start Delivery Order</div>
                        <div style={{ marginTop: "30px", marginLeft: "15px", fontSize: "15px" }}>No Fees | Pick up in 20-30 mins</div>
                        <div style={{ fontWeight: "bold", marginTop: "8px", marginLeft: "15px", fontSize: "15px", color: "#f43939" }} onClick={() => this.submitOrder("takeout")}>Start Takeout Order</div>
                    </div>
                    <hr style={{ border: "1px solid lightgray", marginLeft: "150px", maxWidth: "1200px" }} />


                    {this.state.restaurant.Review1 != null ?
                        <div className="reviews-all">
                            <div style={{ fontWeight: "bold", fontSize: "25px", fontFamily: "Open Sans,Helvetica Neue,Helvetica,Arial,sans-serif", marginBottom: "35px" }}> Recommended reviews </div>
                            <div className="reviews-profile">
                                <div className="review-img"> <img src={require("../../images/avatar.jpg")} alt="" style={{ width: "60px", height: "60px" }} /> </div>
                                <div className="review-reviewer">
                                    <div className="review-name" style={{ fontSize: "16px", color: "#00838f" }}>{(this.state.restaurant.Review1).split(":")[0]}</div>
                                    <div className="review-nos"> 78 reviews</div>
                                    <div className="review-photos">51 photos</div>

                                </div>
                            </div>
                            <div className="reviews-profile-text">
                                <StarRatings rating={4} starDimension="20px" starSpacing="1px" starRatedColor="red" numberOfStars={5} name='rating' /> &nbsp; {(this.state.restaurant.Review1).split(":")[3]}  <br /><br />
                                {(this.state.restaurant.Review1).split(":")[1]}
                            </div>
                            <hr style={{ border: "0.06px solid #eeeeef", marginLeft: "0px", maxWidth: "900px" }} />
                        </div> : null}

                    {noReviewsMsg}
                    {this.state.restaurant.Review2 != null ?

                        <div className="reviews-all">
                            <div className="reviews-profile">
                                <div className="review-img"> <img src={require("../../images/avatar.jpg")} alt="" style={{ width: "60px", height: "60px" }} /> </div>
                                <div className="review-reviewer">
                                    <div className="review-name" style={{ fontSize: "16px", color: "#00838f" }}>{(this.state.restaurant.Review1).split(":")[0]}</div>
                                    <div className="review-nos"> 42 reviews</div>
                                    <div className="review-photos">32 photos</div>


                                </div>
                            </div>
                            <div className="reviews-profile-text">
                                <StarRatings rating={4} starDimension="20px" starSpacing="1px" starRatedColor="red" numberOfStars={5} name='rating' /> &nbsp; {(this.state.restaurant.Review1).split(":")[3]}  <br /><br />
                                {(this.state.restaurant.Review2).split(":")[1]}
                            </div>
                            <hr style={{ border: "0.06px solid #eeeeef", marginLeft: "0px", maxWidth: "900px" }} />
                        </div>
                        : null}


                    {this.state.restaurant.Review3 != null ?
                        <div className="reviews-all">
                            <div className="reviews-profile">
                                <div className="review-img"> <img src={require("../../images/avatar.jpg")} alt="" style={{ width: "60px", height: "60px" }} /> </div>
                                <div className="review-reviewer">
                                    <div className="review-name" style={{ fontSize: "16px", color: "#00838f" }}> {(this.state.restaurant.Review1).split(":")[0]}</div>
                                    <div className="review-nos"> 24 reviews</div>
                                    <div className="review-photos">10 photos</div>

                                </div>
                            </div>
                            <div className="reviews-profile-text">
                                <StarRatings rating={4} starDimension="20px" starSpacing="1px" starRatedColor="red" numberOfStars={5} name='rating' /> &nbsp; {(this.state.restaurant.Review1).split(":")[3]}  <br /><br />
                                {(this.state.restaurant.Review3).split(":")[1]}
                            </div>
                        </div> : null}
                </div>
            </div>
        )
    }
}

export default Restaurants;