//Created by Cameron Burdsall

/*
    TODO
        Think about adding mechanism to grab all the citations off a page and save them
*/

function updateListCount(arrayCount, arrayTitle, title)
{
    let index = arrayTitle.findIndex(pageTitle=>pageTitle === title);
    if (index > -1) //if Page is already stored, increase the count
    {
        if(arrayCount[index] == NaN) arrayCount[index] = 1;
        arrayCount[index]++;
        chrome.storage.local.set({listCount:arrayCount},function(){
        });
        return;
    }
    arrayCount.push(1); //push a new count starting at 1 onto the count array
    chrome.storage.local.set({listCount:arrayCount},function(){
    });
    return;
}

function updateListURL (array, pageURL)
{
    if (array.includes(pageURL)) return;
    array.push(pageURL);
    chrome.storage.local.set({listURL:array},function(){
                
    });
}

function updateListTitle (array, pageTitle)
{
    if (array.includes(pageTitle)) return;
    array.push(pageTitle);
    chrome.storage.local.set({listTitle:array},function(){
                
    });
}

function cutTitle (pageTitle)   {   return pageTitle.substring(0, pageTitle.length - 11);    }

let addPage = document.getElementById('addPage');
addPage.onclick = function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        let pageURL = tabs[0].url;
        let pageTitle = tabs[0].title;
        chrome.storage.local.get({listURL:[]}, function(dat) {
            //if (dat.listURL.includes(pageURL)) {    return;     }
            updateListURL(dat.listURL, pageURL);
            chrome.storage.local.get({listCount:[]}, function(result) {
                chrome.storage.local.get({listTitle:[]}, function(data){
                    pageTitle = cutTitle(pageTitle);
                    updateListCount(result.listCount, data.listTitle, pageTitle);
                    updateListTitle(data.listTitle, pageTitle);
                    if (data.listTitle.includes(pageTitle))
                    {
                        printHyperlinks();
                    }
                    else
                        document.getElementById('savedPages').innerHTML+="<h2><b><a href=" + pageURL + ">" + pageTitle + "</a></b></h2>";
                });
            });
        });
    });
};

function sleep(ms) {
    //function to wait for an inputted number of ms
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function printHyperlinks (){
    //display stored URLs
    //needs to be asyncronous to prevent strange behavior when loading stored information
    var URLS = [];
    var TITLES = [];
    var COUNTS = [];
    await sleep (20);
    document.getElementById('savedPages').innerHTML=""; //clear anything currently printed
    chrome.storage.local.get({listURL:[]}, function(result1) {
        chrome.storage.local.get({listTitle:[]}, function(result2) {
            chrome.storage.local.get({listCount:[]}, function (result3){
                URLS = result1.listURL;
                TITLES = result2.listTitle;
                COUNTS = result3.listCount;
                //insert Hyperlinks to the extension window
                for (let i = 0; i < URLS.length; i++)
                    document.getElementById('savedPages').innerHTML+="<h2><b><a href=" + URLS[i] + ">" + TITLES[i] +"</a></b></h2>";
            });
        });
    });
}

//clear stored URLs
let clearButton = document.getElementById('clearPages');
clearButton.onclick = function (){
    chrome.storage.local.clear(function(){
        console.log('Extension Storage Cleared');
        document.getElementById('savedPages').innerHTML="";
    });
}

//ensures that hyperlinks are printed upon opening the extension
printHyperlinks();