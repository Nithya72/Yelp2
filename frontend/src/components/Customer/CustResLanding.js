import React, { Component } from 'react';
import '../../App.css';
import { CheckBox } from '../../CheckBox.js';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import StarRatings from 'react-star-ratings';
import Map from '../Maps/Map.js';
import configurePath from '../../config';


class CustResLanding extends Component {

    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component


        // console.log("CustResLanding - Customer Login: ", this.props.location.state.customer)
        this.state = {
            customer: this.props.location.state.customer,
            restaurants: [],
            searchList: [],
            filteredRestaurants: [],
            successFlag: null,
            msg: null,
            error: "",
            redirectRest: false,
            redirectToProfile: false,
            restaurant: null,
            neighborhoods: [
                { id: "Buena Vista", value: "Buena Vista", isChecked: false },
                { id: "North San Jose", value: "North San Jose", isChecked: false },
                { id: "Willow Glen", value: "Willow Glen", isChecked: false }
            ],
            deliveryOptions: [
                { id: "Curbside PickUp", value: "Curbside PickUp", isChecked: false },
                { id: "Dine In", value: "Dine In", isChecked: false },
                { id: "Yelp Delivery", value: "Yelp Delivery", isChecked: false }
            ],
            searchName: "",
            searchLocation: "",
            searchFlag: false,
            searchErrorMsg: "No Search Result Found"

        }
        this.submitRestaurant = this.submitRestaurant.bind(this);
        this.handleCheckBox = this.handleCheckBox.bind(this);
        this.handleDelivery = this.handleDelivery.bind(this);
        this.searchHandler = this.searchHandler.bind(this);
        this.redirectHandler = this.redirectHandler.bind(this);
        this.searchNameHandler = this.searchNameHandler.bind(this);
        this.searchLocationHandler = this.searchLocationHandler.bind(this);
    }
    componentDidMount() {
        console.log("On page load")
        axios.get(configurePath.api_host+'/custLanding')
            .then((response) => {

                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    console.log("Restaurants Fetched: ", response.data);
                    console.log("State Restaurants: ", this.state.restaurants);
                    this.setState({
                        successFlag: true,
                        restaurants: this.state.restaurants.concat(response.data),
                        searchList: response.data,
                        filteredRestaurants: response.data
                    })
                }
            })
            .catch((error) => {
                console.log("Error here: ", error)
            });
    }

    handleCheckBox = (event) => {
        let neighbors = this.state.neighborhoods

        neighbors.forEach(neighbor => {
            if (neighbor.value === event.target.value)
                neighbor.isChecked = event.target.checked
        })
        this.setState({ neighborhoods: neighbors })

        let selectedNeighbors = [];
        neighbors.forEach(selectedNeighbor => {
            if (selectedNeighbor.isChecked === true) {
                console.log("selected value:", selectedNeighbor.value)
                selectedNeighbors.push(selectedNeighbor.value)
            }
        })
        console.log("Checked :", selectedNeighbors);

        if (selectedNeighbors.length === 0 || selectedNeighbors === undefined) {
            selectedNeighbors = ['Buena Vista', 'North San Jose', 'Willow Glen']
        }

        var tempList = [];

        console.log("Search List:", this.state.searchList)
        this.state.searchList.forEach(restaurant => {

            if (selectedNeighbors.indexOf(restaurant.Location) >= 0) {
                console.log("here");
                tempList.push(restaurant);
                console.log("TempList: ", tempList);
            }
        })


        this.setState({
            filteredRestaurants: tempList
        })
    }


    handleDelivery = (event) => {
        let deliveryOptions = this.state.deliveryOptions

        deliveryOptions.forEach(deliveryOption => {
            if (deliveryOption.value === event.target.value)
                deliveryOption.isChecked = event.target.checked
        })
        this.setState({ deliveryOptions: deliveryOptions })

        let selectedDeliveryOptions = [];
        deliveryOptions.forEach(selectedDelivery => {
            if (selectedDelivery.isChecked === true) {
                console.log("selected value:", selectedDelivery.value)
                selectedDeliveryOptions.push(selectedDelivery.value)
            }
        })
        console.log("Checked :", selectedDeliveryOptions);

        if (selectedDeliveryOptions.length === 0 || selectedDeliveryOptions === undefined) {
            selectedDeliveryOptions = ['Curbside PickUp', 'Dine In', 'Yelp Delivery']
        }

        var tempList = [];

        console.log("Search List:", this.state.searchList)

        if (selectedDeliveryOptions.length === 3) {
            this.setState({
                filteredRestaurants: this.state.searchList
            })
        } else {
            this.state.searchList.forEach(restaurant => {

                if (selectedDeliveryOptions.indexOf("Curbside PickUp") >= 0) {
                    if (restaurant.IsCurbPickUp === "Y") {
                        tempList.push(restaurant);
                    }
                }
                else if (selectedDeliveryOptions.indexOf("Dine In") >= 0) {
                    if (restaurant.IsDineIn === "Y") {
                        tempList.push(restaurant);
                    }
                }
                else if (selectedDeliveryOptions.indexOf("Yelp Delivery") >= 0) {
                    if (restaurant.IsYelpDelivery === "Y") {
                        tempList.push(restaurant);
                    }
                }
            })
            this.setState({
                filteredRestaurants: tempList
            })
        }
    }


    searchHandler = (e) => {
        e.preventDefault();

        axios.defaults.withCredentials = true;

        console.log("searchName: ", this.state.searchName + " searchLocation: ", this.state.searchLocation);
        const data = {
            searchName: this.state.searchName,
            searchLocation: this.state.searchLocation
        }
        axios.post('http://localhost:3001/searchRestaurants', data)
            .then(response => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    console.log("Successful Search: ", response.data);
                    this.setState({
                        searchFlag: true,
                        searchList: response.data,
                        filteredRestaurants: response.data
                    })
                }
                else {
                    this.setState({
                        searchFlag: false,
                        filteredRestaurants: []
                    })
                }
            })
            .catch(error => {
                console.log("Here we captured the error")
                this.setState({
                    searchFlag: false,
                    filteredRestaurants: []
                })
            });
    }

    redirectHandler = (e) => {
        this.setState({
            redirectToProfile: true,
        })
    }

    searchNameHandler = (e) => {
        this.setState({
            searchName: e.target.value
        })
    }
    searchLocationHandler = (e) => {
        this.setState({
            searchLocation: e.target.value
        })
    }

    submitRestaurant = (restData) => {
        console.log("Value: ", restData);

        this.setState({
            redirectRest: true,
            restaurant: restData
        })

    }

    render() {
        console.log("Then here: ", this.state.filteredRestaurants)

        let redirectVar = null;
        let errorMsg = null;
        if (!cookie.load('cookie')) {
            redirectVar = <Redirect to="/customerLogin" />
        }

        if (this.state.redirectRest) {
            redirectVar = <Redirect to={{ pathname: "/restaurants", state: { restaurant: this.state.restaurant, customer: this.state.customer, restaurants: this.state.restaurants } }} />
        }

        if (this.state.redirectToProfile) {
            redirectVar = <Redirect to={{ pathname: "/customerProfile", state: { customer: this.state.customer } }} />
        }

        if (this.state.filteredRestaurants && this.state.filteredRestaurants.length === 0) {
            console.log("Inside errorr:")
            errorMsg = <div style={{ fontWeight: "bold", fontSize: "20px", marginTop: "20px", color: "#f43938" }}>{this.state.searchErrorMsg}</div>
        }

        return (
            <div >
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
                                        <td className="search-column"><input type="text" onChange={this.searchNameHandler} class="search-bar" name="searchName" placeholder="Fries, Dine In, Italian" /></td>
                                        <td className="search-column"><input type="text" onChange={this.searchLocationHandler} class="search-bar" name="searchLocation" placeholder="Location" /></td>
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

                <div >
                    <hr style={{ border: "1px solid lightgray" }} />
                    <div className="cust-landing">
                        <div className="col filters">
                            <span style={{ fontWeight: "bold", fontFamily: "Open Sans,Helvetica Neue,Helvetica,Arial,sans-serif", fontSize: "14px" }}>Filters</span>

                            <div style={{ color: "darkgray" }}> __________________________ </div>
                            <div style={{ marginTop: "15px" }}>
                                <div style={{ fontWeight: "bold", fontFamily: "Open Sans,Helvetica Neue,Helvetica,Arial,sans-serif", fontSize: "16px" }}> Delivery Methods </div>
                                <div className="check-list">
                                    <ul>
                                        {
                                            this.state.deliveryOptions.map((deliveryOption) => {
                                                return (<CheckBox handleCheckBox={this.handleDelivery} {...deliveryOption} />)
                                            })
                                        }
                                    </ul>

                                    <div style={{ color: "#00838F", fontWeight: "bold" }}> See all </div>
                                    <div style={{ color: "darkgray" }}> __________________________ </div>
                                </div>
                            </div>



                            <div style={{ marginTop: "15px" }}>
                                <div style={{ fontWeight: "bold", fontFamily: "Open Sans,Helvetica Neue,Helvetica,Arial,sans-serif", fontSize: "16px" }}> Neighborhoods </div>
                                <div className="check-list">
                                    <ul>
                                        {
                                            this.state.neighborhoods.map((neighborhood) => {
                                                return (<CheckBox handleCheckBox={this.handleCheckBox} {...neighborhood} />)
                                            })
                                        }
                                    </ul>

                                    <div style={{ color: "#00838F", fontWeight: "bold" }}> See all </div>
                                    <div style={{ color: "darkgray" }}> __________________________ </div>
                                </div>
                            </div>


                            <div style={{ marginTop: "15px" }}>
                                <div style={{ fontWeight: "bold", fontFamily: "Open Sans,Helvetica Neue,Helvetica,Arial,sans-serif", fontSize: "16px" }}> Distance </div>
                                <div style={{ color: "#696969", marginTop: "12px" }}>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="BirdsView" value="Bird's-eye View" />
                                        <label class="form-check-label" for="inlineRadio1">&nbsp;&nbsp;Bird's-eye View</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="Driving" value="Driving" />
                                        <label class="form-check-label" for="inlineRadio2">&nbsp;&nbsp;Driving (5 mi.) </label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="Biking" value="Biking" />
                                        <label class="form-check-label" for="inlineRadio3">&nbsp;&nbsp;Biking (2 mi.) </label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="Walking" value="Walking" />
                                        <label class="form-check-label" for="inlineRadio4">&nbsp;&nbsp;Walking (1 mi.) </label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="WithinBlocks" value="WithinBlocks" />
                                        <label class="form-check-label" for="inlineRadio5">&nbsp;&nbsp;Within 4 blocks </label>
                                    </div>
                                    <div style={{ color: "#00838F", fontWeight: "bold" }}> See all </div>
                                    <div style={{ color: "darkgray" }}> __________________________ </div>
                                </div>
                            </div>
                        </div>

                        {/* restaurants population - starts here */}

                        <div className="col list">
                            <span style={{ fontWeight: "bold", fontSize: "20px" }}>Browsing San Jose, CA Businesses</span>

                            {errorMsg}
                            {this.state.filteredRestaurants.map(restaurant => (
                                <table className="rest-table">
                                    <tbody >
                                        <tr>

                                            <td><img className="rest-images" src={require("../../images/profile_pics/" + restaurant.ProfilePic)} alt="" /></td>
                                            {/* src={require('../../images/logo.jpg')} */}

                                            <table>
                                                <tbody>
                                                    <tr><td style={{ fontFamily: "Open Sans,Helvetica Neue,Helvetica,Arial,sans-serif", fontSize: "25px", fontWeight: "bold" }}><span className="rest-name-link" onClick={() => this.submitRestaurant(restaurant)}> {restaurant.RestName}</span></td></tr>
                                                    <StarRatings rating={restaurant.Rating} starDimension="20px" starSpacing="1px" starRatedColor="red" numberOfStars={5} name='rating' />
                                                    <span style={{ marginLeft: "10px" }}>{restaurant.NumOfReviews} reviews</span>
                                                    <tr><td>$$ . {restaurant.Cuisine}</td></tr>
                                                    <tr>
                                                        <td>
                                                            {restaurant.IsCurbPickUp === "Y" ? <span><span className="glyphicon glyphicon-ok icon-color"></span><span>Curbside Pickup</span></span> : ""}
                                                            {restaurant.IsDineIn === "Y" ? <span><span className="glyphicon glyphicon-ok icon-color"></span><span>Dine In</span></span> : ""}
                                                            {restaurant.IsYelpDelivery === "Y" ? <span><span className="glyphicon glyphicon-ok icon-color"></span><span>Yelp Delivery</span></span> : ""}
                                                        </td>
                                                    </tr>
                                                    <tr><td style={{ fontWeight: "bold" }}>{restaurant.Location}</td></tr>
                                                    <tr><td>{restaurant.Description}</td></tr>
                                                </tbody>
                                            </table>

                                        </tr>
                                    </tbody>
                                </table>
                            ))
                            }
                        </div>

                        {/* restaurants population - ends here */}
                        <div id="map" className="col map" >
                            {console.log("LOAD MAP ***********", this.state)}
                            <Map {...this.state} />
                        </div>

                    </div>
                </div>
            </div >
        )
    }
}

export default CustResLanding;
