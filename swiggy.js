const puppeteer = require('puppeteer');
let page = null;
let browser = null;
const restrntInfo = {

    initialize : async function()
                {

                                let url = "https://www.swiggy.com";
                                browser = await puppeteer.launch({headless : false });
                                page = await browser.newPage();
                                page.setDefaultNavigationTimeout(0); 
                                await page.goto(url, { waitUntil: "networkidle2" });
                                await page.type('#location', 'bengalore');

                                const [response] = await Promise.all([
                                    page.waitForNavigation(),
                                    setTimeout(function(){page.click("._3lmRa")}, 9000)
                                ]); 

                                console.log("new page url", page.url());
                
                },

    retrieve :   async function(link)
                {
                    await page.goto(link, {waitUntil : "networkidle2" });
                    console.log("new page url", page.url());
        
                    let data = await page.evaluate(() => {
                            let restaurantName = document.querySelector("h1._3aqeL").innerText;
                            let tag = document.querySelector("div._3Plw0.JMACF").innerText;
                            let address = document.querySelector("div.Gf2NS._2Y6HW").innerText;
                            let rating = document.querySelector("div._2l3H5 > span").innerText;
                            let peopleRated = document.querySelector("span._1iYuU").innerText;
                    
                            return {
                                restaurantName, 
                                tag,
                                address,
                                rating,
                                peopleRated
                            }
                     });
                    //console.log(data);
                    data["weblink"] = link;
                    data["items"] = "";
                    
                    const data2 = await page.evaluate(
                        function()
                        {
                                            let x = document.querySelector("div._1J_la").innerText
                                            let arr = x.split("\n")
                                            let arr1 = []
                                            let len = arr.length - 1
                                            init = 0
                                            if(arr[0] == "Recommended" || arr[1] == "Recommended")
                                            {
                                                for(let i=3; i < len; i++)
                                                {
                                                    if(arr[i].includes("ITEM"))
                                                    {
                                                        init = i;
                                                        break;
                                                    }
                                                }
                                            }
                                            for(let i=init; i <= len; i++)
                                            {
                                                if(arr[i] == "BESTSELLER"  || arr[i].includes("ITEM") || arr[i].includes("Out of") || arr[i] == "ADD" || arr[i] == "+" || arr[i] == "Customisable" || arr[i].includes("available") )
                                                {
                                
                                                    continue;
                                                }
                                                if( (i < len && arr[i+1].includes("ITEM")) || (i <= len-2 && isNaN(Number(arr[i])) && arr[i+2].includes("ITEM")) || arr[i].includes("MUST TRY")) 
                                                {
                                                        continue;
                                                }
                                                arr1.push(arr[i])
                                            }
                                        
                                            let j = 0
                                            let leng = arr1.length - 1
                                            let items = []
                                            while( j <= leng )
                                            {
                                                let item = {}
                                                item["itemName"] = arr1[j++];
                                                if(isNaN(Number(arr1[j])))
                                                    item["description"] =  arr1[j++];
                                                else
                                                    item["description"] = "---";
                                                if(!isNaN(Number(arr1[j])))
                                                {
                                                        price = arr1[j++];
                                                        if(price > 100000)
                                                        { 
                                                            price = price % 1000;
                                                        }
                                                        else if(price > 1000)
                                                        {
                                                            price = price % 100;
                                                        }
                                                        item["sgyPrice"] = price;
                                                }
                                                else
                                                {
                                                        console.error("price found as text");
                                                }
                                                items.push(item);
                                            }
                                            return items;
                    }
                    );
                    data["items"] = data2;
                    return data;

                },

    end : async function ()
          {
                await browser.close()
          }   

}

module.exports = restrntInfo;






/*
const puppeteer = require('puppeteer');
async function retrieve(link)  {

            let url = "https://www.swiggy.com"
            let url1 = link
            let browser = await puppeteer.launch({headless : false });
            let page = await browser.newPage();
            page.setDefaultNavigationTimeout(0); 
            await page.goto(url, { waitUntil: "networkidle2" });
            await page.type('#location', 'bengalore');

            const [response] = await Promise.all([
                page.waitForNavigation(),
                setTimeout(function(){page.click("._3lmRa")}, 9000)
            ]);

            console.log("new page url", page.url());
            await page.goto(url1, {waitUntil : "networkidle2" });
            console.log("new page url", page.url());

            let data = await page.evaluate(() => {
                    let name = document.querySelector("h1._3aqeL").innerText;
                    let tag = document.querySelector("div._3Plw0.JMACF").innerText;
                    let address = document.querySelector("div.Gf2NS._2Y6HW").innerText;
                    let rating = document.querySelector("div._2l3H5 > span").innerText;
                    let people = document.querySelector("span._1iYuU").innerText;
            
                    return {
                        name, 
                        tag,
                        address,
                        rating,
                        people
                    }
             });
            //console.log(data);
            data["items"] = "";
            
            const data2 = await page.evaluate(
                function(){
                    let x = document.querySelector("div._1J_la").innerText
                    let arr = x.split("\n")
                    let arr1 = []
                    let len = arr.length - 1
                    init = 0
                    if(arr[0] == "Recommended" || arr[1] == "Recommended")
                    {
                        for(let i=3; i < len; i++)
                        {
                            if(arr[i].includes("ITEM"))
                            {
                                init = i;
                                break;
                            }
                        }
                    }
                    for(let i=init; i <= len; i++)
                    {
                        if(arr[i] == "BESTSELLER"  || arr[i].includes("ITEM") || arr[i].includes("Out of") || arr[i] == "ADD" || arr[i] == "+" || arr[i] == "Customisable" || arr[i].includes("available") )
                        {
        
                            continue;
                        }
                        if( (i < len && arr[i+1].includes("ITEM")) || (i <= len-2 && isNaN(Number(arr[i])) && arr[i+2].includes("ITEM")) || arr[i].includes("MUST TRY")) 
                        {
                                continue;
                        }
                        arr1.push(arr[i])
                    }
                
                    let j = 0
                    let leng = arr1.length - 1
                    let items = {}
                    while( j <= leng )
                    {
                        itemName = arr1[j++];
                        if(isNaN(Number(arr1[j])))
                            itemName = itemName + "(" + arr1[j++] + ")";
                        if(!isNaN(Number(arr1[j])))
                        {
                            price = arr1[j++];
                            if(price > 100000)
                            { 
                                price = price % 1000;
                            }
                            else if(price > 1000)
                            {
                                price = price % 100;
                            }
                            items[itemName] = price;
                        }
                        else
                        {
                            console.error("price found as text");
                        }
                    }
                    return items;
                }
            );
            await browser.close();
            data["items"] = data2;
            return data;
}

exports.retrieved = retrieve;


*/