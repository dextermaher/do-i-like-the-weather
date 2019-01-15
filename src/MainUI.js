import React, { Component } from 'react';
import './MainUI.css';

class MainUI extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentTemp: undefined,
            currentConditions: undefined,
            conditionsImageURL: undefined,
            reactionURL: undefined,
            zipCode: 94945,
            locationKey: '39671_PC',
        }
        this.updateWeatherInfo();
    }
    updateWeatherInfo() {
        this.fetchCurrentConditions()
            .then(() => {
                this.fetchBackgroundImage();
                this.fetchReactionImage();
            })
            .catch((er) => {
                console.log(er);
            });
    }
    fetchCurrentConditions() {
        console.log(this.state.locationKey, 'cond for this.state.locationKey');
        
        const url = `http://dataservice.accuweather.com/currentconditions/v1/${this.state.locationKey}?ACCUWE&apikey=rvSVrxAEhkTPZ8Zzou6hLusbiaZAobB9`;
        return fetch(url).then((fresp) => fresp.json())
            .then((cwr) => {
                console.log(cwr);
                if (cwr && cwr[0] && cwr[0].Temperature) {
                    this.setState(
                        {
                            currentTemp: cwr[0].Temperature.Imperial.Value,
                            currentConditions: cwr[0].WeatherText,
                        }
                    );
                }
            })
            .catch((er) => {
                console.log(er);
            })
    }
    rand(min, max) {
        return Math.floor(Math.random() * (max-min) + min);
    } 
    randItem(array) {
        if (!array || !array.length) {
            return null;
        }

        return array[this.rand(0, array.length - 1)];
    }
    fetchBackgroundImage() {
        const { currentConditions } = this.state;
        // encodeURI('http://www.here.com/this that')

        let phrase = `${currentConditions.toLowerCase() || 'foggy'}`;
        // phrase = 'rain';
        // phrase = 'cloudy';
        // phrase = 'snow';
        // phrase = 'hail';
        phrase='person';
        // todo: use flickr group to search
        const photoDataUrl = `https://api.flickr.com/services/rest/?method=flickr.groups.pools.getPhotos&api_key=22a8a26f96dfb6b035ab2bb1d50cbaae&group_id=86784386%40N00&tags=${phrase}&format=json&nojsoncallback=1&auth_token=72157702443479932-3fd7fd021c6a37b4&api_sig=283a10c6b65776d3411f07ec924ec1b3`;
        fetch(photoDataUrl).then((fresp) => fresp.json())
            .then((flickrSearchResponse) => {
                const photoData = this.randItem(flickrSearchResponse.photos.photo);
                const photoUrl = `https://farm${photoData.farm}.staticflickr.com/${photoData.server}/${photoData.id}_${photoData.secret}.jpg`;
                this.setState({ conditionsImageURL: photoUrl })
            })
            .catch((er) => {
                console.log(er);
            })
    }

    fetchReactionImage() {
        const { currentConditions } = this.state;
        // encodeURI('http://www.here.com/this that')

        let phrase = `person in ${currentConditions || 'foggy'} weather`;

        const photoDataUrl = `https://api.flickr.com/services/rest/?REACTION&text=${phrase}&method=flickr.photos.search&api_key=c69b8f9f5fee24232d061c0133679430&format=json&nojsoncallback=1`;
        fetch(photoDataUrl).then((fresp) => fresp.json())
            .then((flickrSearchResponse) => {
                const photoData = this.randItem(flickrSearchResponse.photos.photo);
                const photoUrl = `https://farm${photoData.farm}.staticflickr.com/${photoData.server}/${photoData.id}_${photoData.secret}.jpg`;
                this.setState({ reactionURL: photoUrl })
            })
            .catch((er) => {
                console.log(er);
            })
    }

    fetchZipCode(ev) {
        const { zipCode } = this.state;
        // encodeURI('http://www.here.com/this that')

        let phrase = zipCode;

        const zipCodeURL = `http://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=rvSVrxAEhkTPZ8Zzou6hLusbiaZAobB9&q=${phrase}`;
        fetch(zipCodeURL).then((fresp) => fresp.json())
            .then((zipCodeResponse) => {
                // console.log(zipCodeResponse);
                const usLocations = zipCodeResponse.filter(location => location.Country.ID === 'US');
                // console.log(usLocations, 'usLocations');
                const key = usLocations.length ? usLocations[0].Key : null;
                // console.log(key);

                if (key) {
                    this.setState({ locationKey: key });
                    this.updateWeatherInfo();
                }
            })
            .catch((er) => {
                console.log(er);
            })
    }
    render() {
        const { currentTemp,
            currentConditions,
            conditionsImageURL,
            reactionURL,
            zipCode,
        } = this.state;

        return (
            <div className='mainWrapper'>

                Zip Code: ({zipCode})
                <input
                    className='zipCode'
                    type="text"
                    name="zip"
                    value={zipCode}
                    onChange={(ev) => {
                        this.setState({ zipCode: ev.target.value });
                    }} />
                <input className='enterButton'
                    type="button"
                    value="Enter"
                    onClick={(ev) => {
                        this.fetchZipCode(ev);
                    }} />

                <img className='backgroundImage' src={conditionsImageURL} />
                <div className='contentArea'>
                    <img alt="" className='reactionImage' src={reactionURL} />

                    <div className='conditionsArea'>
                        <div className='tempurature'>
                            {currentTemp}
                        </div>
                        <div className='condition'>
                            {currentConditions}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MainUI;
