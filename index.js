//Creating a capstone to pick random countries based on a person's preferred region...should it be a vacation decider?
//Function: Basic Decider --> barebones, pick a region of the world from a dropdown, submit, produces a set of random countries [5]
// second iteration: produces details about each country and maybe gives an option to do subregions

import express from "express";
import axios from "axios";
import bodyParser from "body-parser";


const app = express();
const port = 3000;
const apiUrl = "https://restcountries.com/v3.1/all?fields=name,capital,currencies,region,subregion,area,maps,languages,timezones"

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//renders front page and list of 
app.get("/", async (req,res)=> {
    const newRegion = [];
    const newSubregion = [];

    try {
        var response = await axios.get(apiUrl)

        for (var i = 0; i < response.data.length; i++) {
            
                newRegion.push(response.data.at(i).region)
                newSubregion.push(response.data.at(i).subregion)
            // console.log(response.data.at(i))
            
        }
       const uniqueRegion = [...new Set(newRegion)]
       const uniqueSubregion = [...new Set(newSubregion)]
        // console.log(uniqueRegion)

        res.render("index.ejs", {
            region: uniqueRegion,
            subregion: uniqueSubregion
        })
    
   
}  catch (error) {
console.log("OOPS, pulled back the following:"+ error.message)
res.render("index.ejs", {
    error: error.message,
  });
} 
});


app.post("/", async(req,res) => {
    const newRegion = [];
    const newSubregion = [];
    const countryList = [];
    // const regionList = [];
    // const subregionList = [];
    const miscList = [];
     var bodyRegion = req.body.region
    // var bodySubregion = req.body.subregion
 try {
    var response = await axios.get(apiUrl)
    var result = response.data.filter((country) => country.region == bodyRegion)
    // console.log(result)

        for (var i = 0; i < response.data.length; i++) {
                newRegion.push(response.data.at(i).region)
                newSubregion.push(response.data.at(i).subregion)

        }
        // console.log(response.data.at(i).region)
       const uniqueRegion = [...new Set(newRegion)]
       const uniqueSubregion = [...new Set(newSubregion)]


//This produces the list populated in the country ideas box
for (var i = 0; i < response.data.length; i++) {
            if (response.data.at(i).region == bodyRegion ) {

            countryList.push(response.data.at(i).name.common);


         }
        }

    var randomCountry =  Math.floor(Math.random() * countryList.length)
    var resultCapital = result.filter((List)=> List.name.common == countryList[randomCountry] )
    var subRegion = resultCapital[0].subregion
    var capital = resultCapital[0].capital
    var languageList = resultCapital[0].languages
    // Object.entries(languageList).forEach(([key, value]) => {
    //     console.log(`${key}: ${value}`);
    //     });
        // console.log(resultCapital);
        // console.log(languageList);
        // console.log(Object.entries(languageList));
        

        res.render("index.ejs", {
            region: uniqueRegion,
            subregion: uniqueSubregion,
            country: countryList[randomCountry],
            randomSubregion: subRegion,
            misc: capital[0],
            languages: languageList, //JSON.stringify(
        })

}  catch (error) {
console.log("OOPS, pulled back the following:"+ error.message)
res.render("index.ejs", {
error: error.message,
});
} 

});


app.listen(port, () => {
  console.log(`Server taking off on port: ${port}`);
 });