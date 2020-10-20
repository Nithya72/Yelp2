import React from 'react';
import { mount, shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import CustomerSignUp from './components/Customer/CustomerSignUp';
import CustomerLogin from './components/Customer/CustomerLogin';
import CustomerProfile from './components/Customer/CustomerProfile';

import { expect } from 'chai';

configure({ adapter: new Adapter() });

// Testing the CustomerSignUp view 
it("CustomerSignUp: render without crashing", () => {
    shallow(<CustomerSignUp />);
});

it("CustomerSignUp: verifying the title of the component", () => {
    const wrapper = shallow(<CustomerSignUp />);
    const welcome = <div className="title"> Customers - Sign up for Yelp</div>;
    expect(wrapper.contains(welcome)).to.equal(true);
});


// Testing the CustomerProfile view 
it("CustomerProfile: Test to pass and verify state data", () => {
    const state = {
        customer: { CustEmailId: "nithya.anbalagan2@gmail.com", CustName: "Nithya Anbalagan", CustPassword: "fe2ae53774ab6ff33b874e5d1f4691e1", CustPic: "avatar.jpg", CustomerCity: "San Jose", CustomerCountry: "United States", CustomerDOB: null, CustomerId: 1, CustomerPhoneNo: null, CustomerState: "CA", FindMeIn: null, FriendsCount: 234, Headline: "Conquering the world one bite at a time", MyBlog: null, NickName: "Nithu", PhotosCount: 14, ReviewsCount: 58, ThingsLove: "You have not told us yet ... do tell!", YelpingSince: "December 2018" },
        isTesting: true
    }
    const wrapper = shallow(<CustomerProfile {...state} />);
    const welcome = <div className="avatar-rest-name">Nithya Anbalagan</div>;
    expect(wrapper.contains(welcome)).to.equal(true);
});


// Testing the CustomerSignUp view 
it("CustomerSignUp: render without crashing", () => {
    shallow(<CustomerSignUp />);
});

it("CustomerSignUp: verifying the title of the component", () => {
    const wrapper = shallow(<CustomerSignUp />);
    const welcome = <div className="title"> Customers - Sign up for Yelp</div>;
    expect(wrapper.contains(welcome)).to.equal(true);
});


// Testing the CustomerLogin view 
it("CustomerLogin: render without crashing", () => {
    shallow(<CustomerLogin />);
});

it("CustomerLogin: verifying the title of the component", () => {
    const wrapper = shallow(<CustomerLogin />);
    const welcome = <div className="title"> Customers - Sign in to Yelp</div>;
    expect(wrapper.contains(welcome)).to.equal(true);
});






