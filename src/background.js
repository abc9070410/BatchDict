chrome.browserAction.onClicked.addListener(onClickButton);

function onClickButton()
{
    console.log("onClick");
    
    window.open("http://tw.dictionary.search.yahoo.com/search?p=BatchDict", "_blank");

}