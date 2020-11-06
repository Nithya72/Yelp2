import React, { Component } from 'react';
import { connect } from 'react-redux';

import { cusSendMessage } from '../../actions/messageActions/cusSendMessageActions';


class CustomerMessages extends Component {
    constructor(props) {
        console.log("Inside Customer Messages");

        super(props);

        this.state = {
            custMsg: this.props.custMsg,
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
        console.log("Inside componentDidUpdate - CustomerMessage After:", this.state.custMsg);

        if (this.state.custMsg !== this.props.custMsg) {

            this.setState({
                custMsg: this.props.custMsg,
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
            custId: this.props.customer[0]._id,
            message: this.state.message,
            sender: this.props.customer[0].CustName,
            _id: this.state._id
        }

        this.props.cusSendMessage(data);
    }

    getMessageHandler = (e) => {

        console.log("Inside here: ", e);
        console.log("State msg: ", this.state.custMsg);

        var list = [];
        var _id= "";
        // var restId= "";
        // var restName= "";

        this.state.custMsg.forEach(row => {
            if(row._id === e){
                _id = row._id;
                // restId = row.restId;
                // restName = row.restName;

            row.customers[0].messages.forEach(msg => {
                list.push(msg)

            })
        }
        });

        this.setState({
            filteredMsg: list,
            _id: _id
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
                                        <li><a href="/custResLanding">Restaurants</a></li>
                                        <li><a href="/">Orders</a></li>
                                        <li style={{ display: "block", padding: "3px 20px", lineHeight: "1.42857143", color: "#333", fontWeight: "400" }}>Upcoming Events</li>
                                        <li><a href="/customerLogout">Sign Out</a></li>
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
                        {this.state.custMsg !== null && this.state.custMsg.length !== 0 ?
                            this.state.custMsg.map(msg => (
                                <table className="rest-table" onClick={() => this.getMessageHandler(msg._id)} style={{ width: "100%", maxWidth: "300px", marginTop: "0px", marginBottom: "0px", borderSpacing: "15px", borderRadius: "0px" }}>
                                    <tbody>
                                        <tr>
                                            <td ><span style={{ fontWeight: "bold"}} > {msg.restName}</span><br/>
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
                    <div className="sendMsg">
                            <form >
                                <div class="form-group sendMsg1"> <textarea onChange={this.msgHandler} class="form-control" style={{ marginLeft:"10px", width:"400px" }} name="message" placeholder="Enter your message here" /></div>
                                <button onClick={this.sendMessageHandler} class="btn btn-success sign-up-button sendMsg2" style={{ width: "70px", height: "35px", padding: "2px", marginLeft:"10px" }} type="submit">Send</button> 
                            </form>
                        </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    console.log("state customer message reducer:", state.cusStore);
    return {
        customer: state.cusStore.customer || "",
        custMsg: state.cusStore.custMsg
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        cusSendMessage: (payload) => dispatch(cusSendMessage(payload))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerMessages);