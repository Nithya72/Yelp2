import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { updateCusProfilePic } from '../../actions/profilePicActions/updateCusProfilePicActions';
import { updateCusProfile } from '../../actions/profileActions/updateCusProfileActions';

class UpdateCustomerProfile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            customer: {
                _id: this.props.customer[0]._id,
                CustName: this.props.customer[0].CustName,
                NickName: this.props.customer[0].NickName,
                CustomerDOB: this.props.customer[0].CustomerDOB,
                CustEmailId: this.props.customer[0].CustEmailId,
                CustomerPhoneNo: this.props.customer[0].CustomerPhoneNo,
                CustomerCity: this.props.customer[0].CustomerCity,
                CustomerState: this.props.customer[0].CustomerState,
                CustomerCountry: this.props.customer[0].CustomerCountry,
                YelpingSince: this.props.customer[0].YelpingSince,
                ThingsLove: this.props.customer[0].ThingsLove,
                FindMeIn: this.props.customer[0].FindMeIn,
                MyBlog: this.props.customer[0].MyBlog,
                CustPic: this.props.customer[0].CustPic
            },
            custProfilePic: null,
            submitted: false,
            redirectToProfile: false,
            redirectToCustProfile: false,
            successfulUpload: null
        }

        this.formChangeHandler = this.formChangeHandler.bind(this);
        this.submitUpdateCustProfile = this.submitUpdateCustProfile.bind(this);
        this.redirectHandler = this.redirectHandler.bind(this);
        this.pictureHandler = this.pictureHandler.bind(this);
        this.submitProfilePic = this.submitProfilePic.bind(this);
    }

    redirectHandler = (e) => {
        this.setState({
            redirectToCustProfile: true,
        })
    }

    formChangeHandler = (e) => {
        const { name, value } = e.target;
        const { customer } = this.state;
        this.setState({
            customer: {
                ...customer,
                [name]: value
            }
        });
    }

    pictureHandler(e) {
        console.log("Customer Image:", e.target.files[0]);
        this.setState({
            custProfilePic: e.target.files[0]
        });
    }

    submitProfilePic = (e) => {
        e.preventDefault();

        const picData = new FormData();
        picData.append("profilePic", this.state.custProfilePic, this.state.custProfilePic.name);
        picData.append("id", this.state.customer._id);

        this.setState({
            successfulUpload: "true"
        })

        this.props.updateCusProfilePic(picData);
    }

    submitUpdateCustProfile = (e) => {
        e.preventDefault();

        this.setState({ submitted: true });
        const { customer } = this.state;

        this.props.updateCusProfile(customer);
    }

    render() {

        // const { registering } = this.props;
        const { customer } = this.state;
        let redirectVar = null;
        let uploadMsg = null;

        if (this.state.submitted && this.props.updateFlag) {
            redirectVar = <Redirect to={{ pathname: "/customerProfile"}} />
        }

        if (this.state.redirectToCustProfile) {
            redirectVar = <Redirect to={{ pathname: "/customerProfile", state: { customer: this.state.customer } }} />
        }

        if (this.state.successfulUpload === "true") {
            redirectVar = <Redirect to={{ pathname: "/customerProfile", state: { customer: this.state.customer } }} />
        } else if (this.state.successfulUpload === "false") {
            uploadMsg = <div style={{ fontWeight: "bold" }}> &emsp;Couldn't upload </div>
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
                                    <ul className="dropdown-menu pull-right">
                                        <li style={{ display: "block", padding: "3px 20px", lineHeight: "1.42857143", color: "#333", fontWeight: "400" }} onClick={this.redirectHandler}>About me</li>
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

                <div className="rest-update-form">
                    <div style={{ color: "#d32323", fontWeight: "bold", fontSize: "25px", marginLeft: "100px" }}>
                        Update {this.props.location.state.customer.NickName}'s Profile
                </div>
                    <div style={{ color: "#e6e6e6", marginBottom: "7px", marginLeft: "100px" }}> _____________________________________________________________________________________________ </div>

                    <div style={{ marginLeft: "100px", marginTop: "50px" }}>

                        <form>
                            <label style={{ fontSize: "15px" }} htmlFor="CustPic">Add/Update Profile Picture: </label>
                            <div className="file-upload">
                                <div className="form-group">
                                    <label for="file-upload-label" class="file-upload-label">
                                        <i class="file-upload-icon"></i> Choose File
                                    </label>
                                    <input id="file-upload-label" className="file-upload-input" onChange={this.pictureHandler} type="file" name="CustPic" />
                                </div>
                                <div>
                                    <button onClick={this.submitProfilePic} className="pic-upload-button" type="submit">Upload Picture</button>
                                </div>
                                {uploadMsg}
                            </div>
                            <br />
                        </form>

                        <form name="form" >
                            <div className="form-group" >
                                <label style={{ fontSize: "15px" }} htmlFor="CustName">Customer Name: </label>
                                <input onChange={this.formChangeHandler} type="text" style={{ width: "450px", height: "30px" }} className="form-control" name="CustName" value={customer.CustName} required="required" />
                                {/* {submitted && !restaurant.restName &&
                                    <div className="help-block">Restaurant Name is required</div>
                                } */}
                            </div>
                            <br />
                            <div class="form-group">
                                <label style={{ fontSize: "15px" }} htmlFor="NickName">Nick Name: </label>
                                <input onChange={this.formChangeHandler} type="text" style={{ width: "450px", height: "30px" }} class="form-control" name="NickName" value={customer.NickName} required="required" />

                            </div>
                            <br />

                            <div class="form-group">
                                <label style={{ fontSize: "15px" }} htmlFor="CustomerDOB">Date Of Birth: </label>
                                <input onChange={this.formChangeHandler} type="text" style={{ width: "450px", height: "30px" }} class="form-control" name="CustomerDOB" value={customer.CustomerDOB} required="required" />

                            </div>
                            <br />

                            <div class="form-group">
                                <label style={{ fontSize: "15px" }} htmlFor="CustEmailId">Email ID: </label>
                                <input onChange={this.formChangeHandler} style={{ width: "450px", height: "30px" }} class="form-control" name="CustEmailId" value={customer.CustEmailId} required="required" />

                            </div>
                            <br />
                            <div class="form-group">
                                <label style={{ fontSize: "15px" }} htmlFor="customerPhoneNo">Phone Number: </label>
                                <input onChange={this.formChangeHandler} style={{ width: "450px", height: "30px" }} class="form-control" name="CustomerPhoneNo" value={customer.CustomerPhoneNo} required="required" />

                            </div>
                            <br />
                            <div class="form-group">
                                <label style={{ fontSize: "17px" }} htmlFor="customerCity">City: </label>
                                <input onChange={this.formChangeHandler} style={{ width: "450px", height: "30px" }} class="form-control" name="CustomerCity" value={customer.CustomerCity} required="required" />

                            </div>
                            <br />
                            <div class="form-group">
                                <label style={{ fontSize: "15px" }} htmlFor="customerState">State: </label>
                                <input onChange={this.formChangeHandler} style={{ width: "450px", height: "30px" }} class="form-control" name="CustomerState" value={customer.CustomerState} required="required" />

                            </div>
                            <br />
                            <div class="form-group">
                                <label style={{ fontSize: "15px" }} htmlFor="customerCountry">Country: </label>
                                <input onChange={this.formChangeHandler} style={{ width: "450px", height: "30px" }} class="form-control" name="CustomerCountry" value={customer.CustomerCountry} required="required" />

                            </div>
                            <br />
                            <div class="form-group">
                                <label style={{ fontSize: "15px" }} htmlFor="yelpingSince">Yelping Since: </label>
                                <input onChange={this.formChangeHandler} style={{ width: "450px", height: "30px" }} class="form-control" name="YelpingSince" value={customer.YelpingSince} required="required" />

                            </div>
                            <br />
                            <div class="form-group">
                                <label style={{ fontSize: "15px" }} htmlFor="thingsLove">Things I Love: </label>
                                <input onChange={this.formChangeHandler} type="text" style={{ width: "450px", height: "30px" }} class="form-control" name="ThingsLove" value={customer.ThingsLove} />

                            </div>
                            <br />
                            <div class="form-group">
                                <label style={{ fontSize: "15px" }} htmlFor="findMeIn">Find Me In: </label>
                                <input onChange={this.formChangeHandler} type="text" style={{ width: "450px", height: "30px" }} class="form-control" name="FindMeIn" value={customer.FindMeIn} />

                            </div>
                            <br />
                            <div class="form-group">
                                <label style={{ fontSize: "15px" }} htmlFor="myBlog">My Blog or Website: </label>
                                <input onChange={this.formChangeHandler} type="text" style={{ width: "450px", height: "30px" }} class="form-control" name="MyBlog" value={customer.MyBlog} />

                            </div>
                            <br />
                            <div>
                                <button onClick={this.submitUpdateCustProfile} class="btn btn-success sign-up-button" type="submit">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    console.log("state update customer profile reducer:", state.cusStore);
    return {
        customer: state.cusStore.customer || "",
        updateFlag: state.cusStore.updateFlag
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateCusProfile: (payload) => dispatch(updateCusProfile(payload)),
        updateCusProfilePic: (payload) => dispatch(updateCusProfilePic(payload))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateCustomerProfile);