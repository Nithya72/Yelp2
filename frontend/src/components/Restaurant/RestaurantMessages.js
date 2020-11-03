import React, { Component } from 'react';
import { connect } from 'react-redux';

import { resSendMessage } from '../../actions/messageActions/resSendMessageActions';


class RestaurantMessages extends Component {
    constructor(props) {
        console.log("Inside Restaurant Messages");

        super(props);

        this.state = {
            restMsg: this.props.restMsg,
            filteredMsg: [],
            message: "",
            // restId: "",
            // restName: "",
            _id: "",
        }
        this.sendMessageHandler = this.sendMessageHandler.bind(this);
        this.getMessageHandler = this.getMessageHandler.bind(this);
        this.msgHandler = this.msgHandler.bind(this);
    }

    componentDidUpdate(prevProps) {
        console.log("Inside componentDidUpdate - RestaurantMessages After:", this.state.restMsg);

        if (this.state.restMsg != this.props.restMsg) {

            this.setState({
                restMsg: this.props.restMsg,
            })
        }
    }

    msgHandler = (e) => {
        console.log("msgHandler: ", e.target.value);

        this.setState({
            message: e.target.value
        })
    }

    sendMessageHandler = (e) => {

        e.preventDefault();

        console.log("sendMessageHandler: ", e);

        const data = {
            custId: this.state.custId,
            restId: this.props.restaurant[0]._id,
            message: this.state.message,
            sender: this.props.restaurant[0].RestName,
            _id: this.state._id
        }

        this.props.resSendMessage(data);
    }

    getMessageHandler = (id, custId) => {

        console.log("Inside here id : ", id, " :custId: ", custId);
        console.log("State msg: ", this.state.restMsg);

        var list = [];
        var _id = "";

        this.state.restMsg.forEach(row => {
            if (row._id === id) {
                _id = row._id;

                row.customers[0].messages.forEach(msg => {
                    list.push(msg)
                })
            }
        });

        this.setState({
            filteredMsg: list,
            _id: _id,
            custId: custId
        });
    }


    render() {

        console.log("filteredMsg: ", this.state.filteredMsg);
        return (
            <div>
                {/* {redirectVar} */}
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
                                        <li><a href="/restaurantProfile">Profile</a></li>
                                        <li><a href="/">Order History</a></li>
                                        <li style={{ display: "block", padding: "3px 20px", lineHeight: "1.42857143", color: "#333", fontWeight: "400" }}>Events Posted</li>
                                        <li><a href="/restaurantLogout">Sign Out</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr style={{ border: "1px solid lightgray" }} />

                <div className="messages">
                    <div className="msg1">
                        <div style={{ fontWeight: "bolder", fontSize: "30px", marginBottom: "30px", marginTop: "40px" }}> Chat History </div>
                        {this.state.restMsg && this.state.restMsg.length !== 0 ?
                            this.state.restMsg.map(msg => (
                                <table className="rest-table" onClick={() => this.getMessageHandler(msg._id, msg.customers[0].id)} style={{ width: "100%", maxWidth: "300px", marginTop: "0px", marginBottom: "0px", borderSpacing: "15px", borderRadius: "0px" }}>
                                    <tbody>
                                        <tr>
                                            <td ><span style={{ fontWeight: "bold" }} > {msg.customers[0].name}</span><br />
                                                <span style={{ fontSize: "15px" }} > {msg.customers[0].messages[0].title}</span></td>
                                        </tr>

                                    </tbody>
                                </table>
                            )) : null}
                    </div>

                    <div className="msg2 rest-table" style={{ width: "100%", marginTop: "110px", height: "400px", maxWidth: "500px", marginBottom: "0px", borderSpacing: "15px", borderRadius: "0px" }}>
                        {this.state.filteredMsg && this.state.filteredMsg.length !== 0 ?
                            this.state.filteredMsg.map(message => (
                                <div>
                                    <div style={{ marginTop: "15px", marginLeft: "5px" }}> <span style={{ fontWeight: "bolder" }}>{message.sender}</span>:<br />{message.message}</div>
                                </div>
                            )) : null}
                    </div>
                    <div className="resSendMsg">
                        <form >
                            <div class="form-group sendMsg1"> <textarea onChange={this.msgHandler} class="form-control" style={{ marginLeft: "10px", width: "400px" }} name="message" placeholder="Enter your message here" /></div>
                            <button onClick={this.sendMessageHandler} class="btn btn-success sign-up-button sendMsg2" style={{ width: "70px", height: "35px", padding: "2px", marginLeft: "10px" }} type="submit">Send</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    console.log("state customer message reducer:", state.resState);
    return {
        restaurant: state.resState.restaurant || "",
        restMsg: state.resState.restMsg
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        resSendMessage: (payload) => dispatch(resSendMessage(payload))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantMessages);