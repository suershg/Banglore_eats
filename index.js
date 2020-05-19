const swiggy = require("./swiggy");
const db = require("./db").db;
const Restaurant = require("./models/restaurant");

(async ()=>{
    await swiggy.initialize();
    let data = await swiggy.retrieve("https://www.swiggy.com/restaurants/drunken-monkey-4th-block-jayanagar-bangalore-173591");
    const restrnt = await Restaurant.findOne({restaurantName : data["restaurantName"]})
                   
    if (restrnt == null)
    {
        console.log("hey its null");
        data["swiggy"] = "yes";
        const restrnt = new Restaurant(data);
        const doc = await restrnt.save()
                    .catch(err => {console.error()})
       // console.log(doc)
    }
    else
    {
        let temp = {};
        data["items"].forEach(obj => {
            temp[obj["itemName"]] = obj["sgyPrice"];
        });
        //console.log(temp);
        console.log(restrnt["items"].length);
        console.log(typeof(restrnt["items"]))
        restrnt["items"].forEach(item => {
            if(temp[item["itemName"]] != undefined)
            {
               //console.log(item);
               item["sgyPrice"] = temp[item["itemName"]];
            }
        });
        restrnt["swiggy"] = "yes"; 
        //restrnt["items"] = data["items"]; 
        await restrnt.save();
    }
    
   // console.log(data);
    await swiggy.end();
})(); 
  