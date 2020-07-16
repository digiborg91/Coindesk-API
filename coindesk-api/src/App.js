import React, {useState, useEffect } from 'react';
import {Dimmer, Loader, Select, Card} from 'semantic-ui-react';
import Chart from 'react-apexcharts';
import './App.css';


const options = [
  { value: 'USD', text: 'USD'}, 
  { value: 'EUR', text: 'EUR'}, 
  { value: 'GBP', text: 'GBP'}
];

function App() {
  const [loading, setLoading] = useState(true);
  const [priceData, setPriceData] = useState(null);
  const [currency, setCurrency] = useState("USD")
  const [chartData, setChartData] = useState(null);
  const [series, setSeries] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
      const data = await res.json();
      setPriceData(data.bpi);
      getChartData()
    }
    fetchData();
  }, [] )

  const handleSelect = (e, data) => {
      setCurrency(data.value);
  }

  const getChartData = async () => {
      const res = await fetch('https://api.coindesk.com/v1/bpi/historical/close.json')
      const data = await res.json();
      const categories = Object.keys(data.bpi);
      const series = Object.values(data.bpi);
      setChartData({
        xaxis: {
          categories: categories
        }
      })

      setSeries ([
        {
          name: 'Bitcoin Price',
          data: series
        }
      ])

      setLoading(false);
  }

  return (
    <div className="App">
        <div className='nav'>
          Coindesk API Practice
        </div>
        {
          loading ? (
            <div>
              <Dimmer active inverted>
                <Loader>Loading</Loader>
              </Dimmer>
              </div>
          ) : (
            <>
              <div className="price-container">
                <div className="form">
                  <Select placeholder="Select your currency" onChange={handleSelect} options={options}></Select>
                </div>
                <div className="price">
                  <Card>
                    <Card.Content>
                      <Card.Header>{currency} Currency</Card.Header>
                      <Card.Description>
                        {priceData[currency].rate}
                      </Card.Description>
                    </Card.Content>
                  </Card>
                </div>
              </div>
              <div className="chart">
              <Chart options={chartData}
                series={series}
                type="line"
                width="1200"
                height="300"
                />
              </div>
            </>
              )
          }     
    </div>
  );
}

export default App;
