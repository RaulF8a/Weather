import express from 'express';
import https from 'node:https';
import path from 'path';
import bodyParser from 'body-parser';

const app = express ();
const __dirname = path.resolve ();
app.use (bodyParser.urlencoded ({extended: true}));
app.use(express.static(__dirname + '/public'));

function provocarFalla () {  
    process.exit ();
}

app.get ("/", (req, res) =>{
    res.sendFile (`${__dirname}/index.html`);
});

app.post ("/", (req, res) =>{
    const query = req.body.cityName;
    const appid = "d874dd68b4ff4bfa964aec564069d233";
    const units = "metric";
    const url = `https://api.openweathermap.org/data/2.5/weather?units=${units}&q=${query}&appid=${appid}`;
    
    https.get (url, (response) => {
        response.on ("data", (data) => {
            const weatherData = JSON.parse (data);
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            const icon =  weatherData.weather[0].icon;
            const iconURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    
            res.write (`<h1>The temperature in ${query} is: ${temp}C</h1>`);
            res.write (`<p>The weather is currently ${description}</p>`);
            res.write (`<img src="${iconURL}">`);
    
            res.send ();
        })
    });

    if (Math.random () === 1){
        provocarFalla ();
    }
});

app.listen (4001, () =>{
    console.log ("Server is running on port 4001.");
});