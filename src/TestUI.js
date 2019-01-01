import React, { Component } from 'react';

class TestUI extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentTemp : '--',
            currentConditions : '--',
            conditionsImageURL : undefined,
            weatherExampleURL : undefined,    
        }

        this.updateWeatherInfo();
      }
      setTemp = (ev) => {
        ev.preventDefault(); 
        const cur = this.state.currentTemp;
        const u1 = this.state.conditionsImageURL;
        const u2 = this.state.weatherExampleURL;
    
        this.setState(
          {
            currentTemp : cur + 10,
            conditionsImageURL : u2,
            weatherExampleURL : u1,
          }
        );
      }
      updateWeatherInfo() {
        this.fetchCurrentConditions()
            .then(() => {
                this.fetchBackgroundImage();
                this.fetchReactionImage();
            }) 
            .catch((er) =>{
                console.log(er);
            });
      }
      fetchCurrentConditions(){
        const url = 'http://dataservice.accuweather.com/currentconditions/v1/39671_PC?ACCUWE&apikey=rvSVrxAEhkTPZ8Zzou6hLusbiaZAobB9';
        return fetch(url).then((fresp) => fresp.json())
                   .then( (cwr) => 
                    { 
                      console.log(cwr);
                      if (cwr && cwr[0] && cwr[0].Temperature) {
                        this.setState(
                            {
                              currentTemp : cwr[0].Temperature.Imperial.Value,
                              currentConditions : cwr[0].WeatherText,
                            }
                          );
                      }
                    })
                    .catch((er) =>{
                        console.log(er);
                    })
      }

      fetchBackgroundImage() {
        const {currentConditions} = this.state;
        // encodeURI('http://www.here.com/this that')

        let phrase = `${currentConditions || 'foggy'} skies`;
        // phrase = 'rain';
        // phrase = 'cloudy';
        // phrase = 'snow';
        // phrase = 'hail';

// todo: use flickr group to search
        const photoDataUrl = `https://api.flickr.com/services/rest/?BACKGROUND&text=${phrase}&method=flickr.photos.search&api_key=c69b8f9f5fee24232d061c0133679430&format=json&nojsoncallback=1`;
        fetch(photoDataUrl).then((fresp) => fresp.json())
                   .then( (flickrSearchResponse) => 
                    { 
                        const photoData = flickrSearchResponse.photos.photo[0];
                        const photoUrl = `https://farm${photoData.farm}.staticflickr.com/${photoData.server}/${photoData.id}_${photoData.secret}.jpg`;
                        this.setState({ weatherExampleURL : photoUrl })
                    })
                    .catch((er) =>{
                        console.log(er);
                    })
      }

      fetchReactionImage() {
        const {currentConditions} = this.state;
        // encodeURI('http://www.here.com/this that')

        let phrase = `${currentConditions || 'foggy'} person`;

        const photoDataUrl = `https://api.flickr.com/services/rest/?REACTION&text=${phrase}&method=flickr.photos.search&api_key=c69b8f9f5fee24232d061c0133679430&format=json&nojsoncallback=1`;
        fetch(photoDataUrl).then((fresp) => fresp.json())
                   .then( (flickrSearchResponse) => 
                    { 
                        const photoData = flickrSearchResponse.photos.photo[0];
                        const photoUrl = `https://farm${photoData.farm}.staticflickr.com/${photoData.server}/${photoData.id}_${photoData.secret}.jpg`;
                        this.setState({ conditionsImageURL : photoUrl })
                    })
                    .catch((er) =>{
                        console.log(er);
                    })
      }
    
      render() {
        const { currentTemp, 
                currentConditions, 
                conditionsImageURL, 
                weatherExampleURL,
            } = this.state;
    
        
        return (
          <div>
            <div className='toolbar'>
              <a href="/" onClick={this.setTemp}>Change Temp</a>
            </div>
            <div className='testToolArea'>        
              <div className='toolItem'>
                <div>Weather</div>
                <div>{currentTemp}</div>
                <div>{currentConditions}</div>
                <img alt="" className='testImage' src={conditionsImageURL} />
              </div>
    
              <div className='toolItem'>
                <div>Flickr</div>
                <img alt="" className='testImage' src={weatherExampleURL} />
              </div>
            </div>
          </div>
        );
      }
}

export default TestUI;
