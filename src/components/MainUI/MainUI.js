import React, { Component } from 'react';
import ZipCodeForm from '../ZipCodeForm/ZipCodeForm'
import styles from './MainUI.module.css';
import Loader from 'react-loader-spinner'

const HOWIFEEL = {
    SUNNY: 'HAPPY',
    CLOUDY: 'DROWSY',
    RAINY: 'SAD',
    SNOWY: 'DROWSY',
}
const CONDITIONS = {
    SUNNY: 'SUNNY',
    CLOUDY: 'CLOUDY',
    RAINY: 'RAINY',
    SNOWY: 'SNOWY',
}
class MainUI extends Component {
    constructor(props) {
        super(props);

        this.zipCode = 94945;
        this.state = {
            currentTemp: undefined,
            currentConditions: undefined,
            conditionsImageURL: undefined,
            reactionURL: undefined,
            locationKey: '39671_PC',
            updateMins: 10,
            shouldRenderZipCodeForm : false,
            isPullingData : false,
        }
    }
    componentDidMount() {
        this.updateWeatherInfo();
    }
    
    updateWeatherInfo() {


        this.setState({isPullingData : true});

        this.fetchCurrentConditions()
            .then(() => {
                this.fetchBackgroundImage()
                    .then(() => {
                        this.setState({isPullingData : false});
                    })
                    .catch(() => {
                        this.setState({isPullingData : false});
                    });
                this.fetchReactionImage();
                this.startUpdateTimer();

            })
            .catch((er) => {
                console.log(er);
            });
    }
    

    /** FETCHERS */
    fetchCurrentConditions() {
        const url = `http://dataservice.accuweather.com/currentconditions/v1/${this.state.locationKey}?ACCUWE&apikey=rvSVrxAEhkTPZ8Zzou6hLusbiaZAobB9`;
        return fetch(url)
            .then((fresp) => fresp.json())
            .then((cwr) => {
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
    startUpdateTimer(){
        setTimeout(() => {
            this.updateWeatherInfo();
        }, this.state.updateMins * 60 * 1000);  // mins * 60sec * 1000
    }
    fetchBackgroundImage() {
        const { currentConditions } = this.state;
        let conditionCode = null;

        // MAP CONDITIONS
        switch (currentConditions.toLowerCase()) {
            case "sunny":
            case "clear":
            case "mostly sunny":
            case "partly sunny":
            case "hazy sunshine":
            case "mostly clear":
            case "hot":
                conditionCode = CONDITIONS.SUNNY
                break;

            case "cloudy":
            case "fog":
            case "intermittent clouds":
            case "mostly cloudy":
            case "dreaery":
            case "hazy moonlight":
            case "partly cloudy":
            case "windy":
                conditionCode = CONDITIONS.CLOUDY
                break;

            case "rain":
            case 'showers':
            case 'mostly cloudy with showers':
            case 'partly sunny with showers':
            case 'partly cloudy with showers':
                conditionCode = CONDITIONS.RAINY
                break;

            case 'snow':
            case 'ice':
            case 'sleet':
            case 'freezing rain':
            case 'rain and snow':
            case 'thunder storms':
            case 'partly sunny with thunder storms':
            case 'flurries':
            case 'partly sunny with flurries':
            case 'mostly cloudy with snow':
            case 'cold':
            case 'partly cloudy with thunder storms':
            case 'mostly cloudy with thunder storms':
            case 'mostly cloudy with flurries':
                conditionCode = CONDITIONS.SNOWY
                break;

            default:
                conditionCode = CONDITIONS.SNOWY;
        }

        console.log(conditionCode);

        // encodeURI('http://www.here.com/this that')
        let phrase = `${conditionCode || 'sunny'} landscape`;
        // phrase = 'rain';
        // phrase = 'cloudy';
        // phrase = 'snow';
        // phrase = 'hail';
        // phrase='person';
        // todo: use flickr group to search
        // const photoDataUrl = `https://api.flickr.com/services/rest/?method=flickr.groups.pools.getPhotos&api_key=22a8a26f96dfb6b035ab2bb1d50cbaae&group_id=86784386%40N00&tags=${phrase}&format=json&nojsoncallback=1&auth_token=72157702443479932-3fd7fd021c6a37b4&api_sig=283a10c6b65776d3411f07ec924ec1b3`;
        // const photoDataUrl = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=c69b8f9f5fee24232d061c0133679430&text=${phrase}&format=json&nojsoncallback=1&perpage=5`;
        
        const now = new Date();
        if (now.getHours() >= 17) {
            phrase += ' night';
        }
        const photoDataUrl = `https://api.unsplash.com/search/photos?client_id=b6ddad0a16067608ae5f4638eb3405e87a82d7c4ef64da727f2cd4e524f9d33e&query=${phrase}`;
        
        return fetch(photoDataUrl)
            .then((fresp) => fresp.json())
            .then( (backgroundSearchResponse) => {
                // const photoUrl = `https://farm${photoData.farm}.staticflickr.com/${photoData.server}/${photoData.id}_${photoData.secret}.jpg`;
                const photoData = randItem(backgroundSearchResponse.results);
                const photoUrl = photoData.links.download;
                this.setState({ conditionsImageURL: photoUrl })
            })
            .catch((er) => {
                console.log(er);
            })
    }
    fetchReactionImage = () => {
        const { currentConditions } = this.state;
        let conditionCode = null;

        if(!currentConditions) {
            console.warn('No Current Condition');
            return;
        }

        // MAP CONDITIONS
        switch (currentConditions.toLowerCase()) {
            case "sunny":
            case "clear":
            case "mostly sunny":
            case "partly sunny":
            case "hazy sunshine":
            case "mostly clear":
            case "hot":
                conditionCode = HOWIFEEL.SUNNY
                break;

            case "cloudy":
            case "fog":
            case "intermittent clouds":
            case "mostly cloudy":
            case "dreaery":
            case "hazy moonlight":
            case "partly cloudy":
            case "windy":
                conditionCode = HOWIFEEL.CLOUDY
                break;

            case "rain":
            case 'showers':
            case 'mostly cloudy with showers':
            case 'partly sunny with showers':
            case 'partly cloudy with showers':
                conditionCode = HOWIFEEL.RAINY
                break;

            case 'snow':
            case 'ice':
            case 'sleet':
            case 'freezing rain':
            case 'rain and snow':
            case 'thunder storms':
            case 'partly sunny with thunder storms':
            case 'flurries':
            case 'partly sunny with flurries':
            case 'mostly cloudy with snow':
            case 'cold':
            case 'partly cloudy with thunder storms':
            case 'mostly cloudy with thunder storms':
            case 'mostly cloudy with flurries':
                conditionCode = HOWIFEEL.SNOWY
                break;

            default:
                conditionCode = HOWIFEEL.SNOWY;
        }
        // encodeURI('http://www.here.com/this that')

        let phrase = `${conditionCode || 'foggy'} dog`;

        // const photoDataUrl = `https://api.flickr.com/services/rest/?REACTION&text=${phrase}&method=flickr.photos.search&api_key=c69b8f9f5fee24232d061c0133679430&format=json&nojsoncallback=1`;
        const photoDataUrl = `https://api.unsplash.com/search/photos?client_id=b6ddad0a16067608ae5f4638eb3405e87a82d7c4ef64da727f2cd4e524f9d33e&query=${phrase}`;
        fetch(photoDataUrl).then((fresp) => fresp.json())
            .then((backgroundSearchResponse) => {
                // const photoData = randItem(backgroundSearchResponse.photos.photo);
                // const photoUrl = `https://farm${photoData.farm}.staticflickr.com/${photoData.server}/${photoData.id}_${photoData.secret}.jpg`;
                const photoData = randItem(backgroundSearchResponse.results);
                const photoUrl = photoData.links.download;
                this.setState({ reactionURL: photoUrl })
            })
            .catch((er) => {
                console.log(er);
            })
    }
    fetchZipCode = () => {
        const { zipCode } = this;
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
                    this.setState({shouldRenderZipCodeForm: false});
                }
            })
            .catch((er) => {
                console.log(er);
            })
    }


    /** HANDLERS */
    handleShowZipForm = (ev) => {
        this.setState({ shouldRenderZipCodeForm:true });
    }
    handleZipModalClose = () => {
        this.setState({ shouldRenderZipCodeForm:false });
    }
    handleZipModalChangeZip = (newZip) => {
        this.zipCode =newZip;
        this.fetchZipCode();
    }


    /** RENDERERS */
    render() {
        const { conditionsImageURL, } = this.state;

        return (
            <div className={styles.root} >

                {/* CONFIG BUTTON */}
                <input alt="" className={styles.enterButton}
                    type="image"
                    src='https://cdn4.iconfinder.com/data/icons/web-ui-color/128/Settings-512.png'
                    onClick={this.handleShowZipForm}/>


                {/* SHOULD WE SHOW ZIP FORM */}
                {this.renderZipForm()}                

                {/* BACKGROUND IMAGE */}
                <img className={styles.backgroundImage} 
                    src={conditionsImageURL} 
                    alt="" />
                

                {/* FRONT IMAGE AND CONDITIONS */}
                {this.renderContentArea()}


                {/* LOADING ICON */}
                {this.renderLoadingIcon()}
            </div>
        );
    }
    renderLoadingIcon() {
        const {isPullingData} = this.state;
        if ( !isPullingData) return null;

        return (
            <Loader type="Triangle" color="black" height={80} width={80} />
        );
    }
    renderZipForm() {

        const shouldShowForm = this.state.shouldRenderZipCodeForm;

        if (!shouldShowForm) return null;

        return (
            <ZipCodeForm 
                onClose={this.handleZipModalClose} 
                onSearch={this.handleZipModalChangeZip} />    
        );
    }
    renderContentArea() {
        const { currentTemp,
            currentConditions,
            reactionURL,
        } = this.state;
        
        return (
            <div className={styles.contentArea} >
                {/* FRONT IMAGE */}
                <img    alt="" 
                        className={styles.reactionImage} 
                        src={reactionURL}
                        onClick={this.fetchReactionImage}
                        />

                {/* WEATHER CONDITIONS */}
                <div className={styles.conditionsArea} >
                    <div className={styles.tempurature} >
                        {currentTemp}
                    </div>
                    <div className={styles.condition} >
                        {currentConditions}
                    </div>
                </div>
            </div>
        );
    }
}
    
    export default MainUI;




function rand(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
function randItem(array) {
    if (!array || !array.length) {
        return null;
    }
    return array[rand(0, array.length - 1)];
}



