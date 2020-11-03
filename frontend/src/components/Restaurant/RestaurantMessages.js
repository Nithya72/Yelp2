import React, { Component } from 'react';
import { connect } from 'react-redux';


class RestaurantMessages extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div> Inside Restaurant Messages </div>
        )
    }
}

const mapStateToProps = (state) => {
    // console.log("state logout reducer:",state);
    // return state;
};

const mapDispatchToProps = (dispatch) => {
    return{
      
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantMessages);