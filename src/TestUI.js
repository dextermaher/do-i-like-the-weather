import React, { Component } from 'react';

class TestUI extends Component {
    constructor(props) {
        super(props);
        this.fetchCurrentConditions();
        this.state = {
          currentTemp : '--',
          currentConditions : '--',
          conditionsImageURL : 'https://pbs.twimg.com/profile_images/966804932866162688/RsZEA9iJ.jpg',
          weatherExampleURL : 'https://cdn-images-1.medium.com/max/1200/1*_EP0OeIPcQf-XiDyRSkoAQ.jpeg',
    
        }
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
    
      fetchCurrentConditions(){
        const url = 'http://dataservice.accuweather.com/currentconditions/v1/39671_PC?apikey=rvSVrxAEhkTPZ8Zzou6hLusbiaZAobB9';
        fetch(url).then((fresp) => fresp.json())
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
    
      render() {
        const { currentTemp, 
                currentConditions, 
                conditionsImageURL, 
                weatherExampleURL} = this.state;
    
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
