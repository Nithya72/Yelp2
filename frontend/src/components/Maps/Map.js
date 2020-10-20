import React, { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';


class Map extends Component {

    static defaultProps = {
        googleMapURL: "https://maps.googleapis.com/maps/api/js?&v=3.exp&libraries=geometry,drawing,places",
    }

    constructor(props) {
        super(props);
    }

    MyMap = withScriptjs(withGoogleMap(props =>

        <GoogleMap
            defaultCenter=
            {{
                lat: Object.values(this.props.filteredRestaurants)[0] === undefined ? 0 : +(Object.values(this.props.filteredRestaurants)[0].Latitude),
                lng: Object.values(this.props.filteredRestaurants)[0] === undefined ? 0 : +(Object.values(this.props.filteredRestaurants)[0].Longitude)
            }}
            defaultZoom={12}
        >

            {this.props.filteredRestaurants.map(restaurant => {
                return (<Marker title={restaurant.RestName} position={{ lat: +(restaurant.Latitude), lng: +(restaurant.Longitude) }} />)
            })}

        </GoogleMap>
    ));

    render() {
        return (
            <div>
                <this.MyMap
                    googleMapURL={this.props.googleMapURL}
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `900px`, width: '500px' }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                />
            </div>

        );
    }
}

export default Map;