import axios from 'axios';
import configPath from '../../config';


const postReviewDispatcher = payload => {
    console.log("Inside postReviewDispatcher action: ", payload);
    return {
        type: "POST_REVIEW",
        payload
    };
};

export const postReview = (payload) => {

    return dispatch => {

        axios.post(configPath.api_host + '/customer/review', payload)
            .then(response => {
                var restaurants = response.data;
                console.log("Actions - Post Reviews:", restaurants);

                if (response.status === 200) {
                    dispatch(postReviewDispatcher({
                        restaurants,
                        reviewFlag: true
                    })
                    );
                }
            }).catch(err => {
                console.log("error: ", err.data);

                dispatch(postReviewDispatcher({
                    reviewMsg: "Couldn't post review! Try after sometime",
                    reviewFlag: false
                })
                );

            });
    };
};