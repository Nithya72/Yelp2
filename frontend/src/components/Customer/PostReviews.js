import React, { Component } from 'react';
import StarRatings from 'react-star-ratings';
import { Redirect } from 'react-router';
import axios from 'axios';
class PostReviews extends Component {

    constructor(props) {
        super(props);

        this.state = {
            restaurant: this.props.location.state.restaurant,
            customer: this.props.location.state.customer,
            rating: 0,
            review: null,
            successFlag: false
        }

        this.changeRating = this.changeRating.bind(this);
        this.formChangeHandler = this.formChangeHandler.bind(this);
        this.submitReviewHandler = this.submitReviewHandler.bind(this);
    }

    changeRating(e) {
        this.setState({
            rating: e
        })
    }

    formChangeHandler(e){
        this.setState({
            review: e.target.value
        })
    }

    submitReviewHandler(e){

        var name = (this.state.customer.CustName).split(" ");
        console.log("Submitting the review: ", this.state.review, " : ", this.state.rating, " : ", name[0]);


        var column = null;

        if(this.state.restaurant.Review3 == null){
            column = "Review3";
        }
        if(this.state.restaurant.Review2 == null){
            column = "Review2";
        }
        if(this.state.restaurant.Review1 == null){
            column = "Review1";
        }

        let today = new Date().toISOString().slice(0, 10)
        var review = name[0]+":"+this.state.review+":"+this.state.rating+":"+today;

        console.log("Review To Post: ", review)

        const data = {
            review: review,
            RestaurantId: this.state.restaurant.RestaurantId,
            column: column
        }

        axios.post('http://localhost:3001/postReviews', data)
            .then((response) => {

                console.log("Status Code : ", response.status);
                if (response.status === 200) {

                    console.log("restaurants after writing review : ", response.data);
                    this.setState({
                        successFlag: true,
                        restaurant: response.data[0]
                    })
                } else if (response.status === 401) {
                    this.setState({
                        successFlag: false
                    })
                }
            })
            .catch((error) => {
                console.log("Error here: ", error)
                this.setState({
                    successFlag: false,
                })
            });
    }

    render() {
        console.log("Rating:", this.state.rating);
        console.log("Restaurant Detail:", this.state.restaurant);
        var redirectVar = null;

        if(this.state.successFlag){
            redirectVar = <Redirect to={{ pathname: "/restaurants", state: { customer: this.state.customer, restaurant: this.state.restaurant  } }} />
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
                <hr style={{ border: "1px solid lightgray" }} />
                <div style={{ fontFamily: "Open Sans,Helvetica Neue,Helvetica,Arial,sans-serif", marginLeft: "250px" }}>

                    <div style={{ fontSize: "40px", color: "#0373bb", fontWeight: "bold" }}>{this.state.restaurant.RestName}</div>
                    <span style={{ fontSize: "18px", color: "#0373bb" }}>Read our review guidelines</span>

                    <div className="review-border">
                        <div style={{ marginLeft: "20px", marginTop: "20px" }}><StarRatings rating={this.state.rating} changeRating={this.changeRating} starDimension="40px" starSpacing="1px" starRatedColor="red" numberOfStars={5} name='rating' /></div>
                        <textarea onChange={this.formChangeHandler} type="text" style={{ width: "660px", height: "300px", marginLeft: "20px", marginTop: "20px" }} class="form-control" name="Review" />

                    </div>
                    <div style={{ marginTop: "30px" }}><button onClick={this.submitReviewHandler} class="sign-up-button" type="submit">Post Review</button></div>
                </div>
            </div>
        )

    }

}

export default PostReviews;