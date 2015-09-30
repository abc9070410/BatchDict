// ==UserScript==
// @name        Lyrics163
// @namespace   Lyrics163
// @description Lyrics163
// @include     http://music.163.com/*
// @version     1
// @grant       none
// ==/UserScript==

"use strict";

var gaData = [];
var gChecked = {
        word: true,
        phoneticSymbol: true,
        sound: false,
        lexical: true,
        explanation: true,
        example: true
    };

//window.onload = init;

init();

function init()
{
    console.log("[YD]INIT");

    setLayout();  

    updateSetting();
    
    addListener();
}

function addListener()
{
    var eDiv = document.getElementById("BUTTON_ID");
    eDiv.addEventListener("click", clickSearchButton);
}

function setLayout()
{
    var eBody = document.getElementsByTagName("body")[0];

    /*
    var eOutside = document.getElementsByClassName("sbx")[0];
    
    var eDiv = document.createElement("div");
    
    var sHTML = getTextareaHTML();
    
    eDiv.innerHTML = sHTML;
    eOutside.appendChild(eDiv);
    */
    
    console.log("H:" + eBody.clientHeight);

    var sHTML = ""
    
    sHTML += "<br><p class='Title'>　　批次字典</p><br>";
    sHTML += "<textarea id='TEXTAREA_ID' rows='4' class='Center'></textarea>";
    sHTML += "<hr><form class='Center'>";
    sHTML += "<input type='button' id='BUTTON_ID' value='開始查詢'></input>";
    sHTML += "　　<input type='checkbox' name='TABLE' value='word'>單字　";
    sHTML += "<input type='checkbox' name='TABLE' value='phoneticSymbol'>音標　";
    sHTML += "<input type='checkbox' name='TABLE' value='sound'>發音　";
    sHTML += "<input type='checkbox' name='TABLE' value='lexical'>詞性　";
    sHTML += "<input type='checkbox' name='TABLE' value='explanation'>解釋　";
    sHTML += "<input type='checkbox' name='TABLE' value='example'>例句　";
    sHTML += "</form><hr><br>";
    sHTML += "<p class='Title'>　　查詢結果</p><br><div id='RESULT_DIV_ID'></div>";
    sHTML += "<br><br>";
    
    eBody.innerHTML = sHTML;
    
    eBody.className = "Body";
}

function initChecked()
{
    var eCheckboxes = document.getElementsByTagName('input');

    for (var i = 0; i < eCheckboxes.length; i++) 
    {
        if (eCheckboxes[i].type == 'checkbox') 
        {
            if (eCheckboxes[i].value == "word")
            {
                eCheckboxes[i].checked = gChecked.word;
            }
            else if (eCheckboxes[i].value == "phoneticSymbol")
            {
                eCheckboxes[i].checked = gChecked.phoneticSymbol;
            }
            else if (eCheckboxes[i].value == "sound")
            {
                eCheckboxes[i].checked = gChecked.sound;
            }
            else if (eCheckboxes[i].value == "lexical")
            {
                eCheckboxes[i].checked = gChecked.lexical;
            }
            else if (eCheckboxes[i].value == "explanation")
            {
                eCheckboxes[i].checked = gChecked.explanation;
            }
            else if (eCheckboxes[i].value == "example")
            {
                eCheckboxes[i].checked = gChecked.example;
            }
            
            console.log(i + "_" + eCheckboxes[i].value + ":" + eCheckboxes[i].checked);
        }
    }
}

function updateChecked()
{
    var eCheckboxes = document.getElementsByTagName('input');

    for (var i = 0; i < eCheckboxes.length; i++) 
    {
        if (eCheckboxes[i].type == 'checkbox') 
        {
            if (eCheckboxes[i].value == "word")
            {
                gChecked.word = eCheckboxes[i].checked;
            }
            else if (eCheckboxes[i].value == "phoneticSymbol")
            {
                gChecked.phoneticSymbol = eCheckboxes[i].checked;
            }
            else if (eCheckboxes[i].value == "sound")
            {
                gChecked.sound = eCheckboxes[i].checked;
            }
            else if (eCheckboxes[i].value == "lexical")
            {
                gChecked.lexical = eCheckboxes[i].checked;
            }
            else if (eCheckboxes[i].value == "explanation")
            {
                gChecked.explanation = eCheckboxes[i].checked;
            }
            else if (eCheckboxes[i].value == "example")
            {
                gChecked.example = eCheckboxes[i].checked;
            }
            
            console.log(i + "_" + eCheckboxes[i].value + ":" + eCheckboxes[i].checked);
        }
    }
    
    //console.log("[YD]Table Checked: " + gChecked);
}

function initData()
{
    gaData = [{
        word: "單字",
        phoneticSymbol: "音標",
        sound: "發音",
        lexical: ["詞性"],
        explanation: [["解釋"]],
        example: [["例句"]]
    }];
}

function clickSearchButton()
{
    initData(); // clean the previous search result
    updateChecked();
    
    var eDiv = document.getElementById("TEXTAREA_ID");
    var sText = eDiv.value;
    console.log("[YD]TEXTAREA : " + sText);
    
    var sBaseUrl = "https://tw.dictionary.yahoo.com/dictionary?p=";
    
    var asWord = sText.split(/,|\s/g);
    
    console.log("[YD]Total " + asWord.length + " Words");
    
    for (var i = 0; i < asWord.length; i ++)
    {
        var sWord = asWord[i].trim();
        var sUrl = sBaseUrl + sWord;
        
        console.log("[YD]Search " + i + " : " + sWord);
        
        sendHttpRequest(sUrl, handleSearchResult, sWord, i + 1);
    }
    
}

function handleSearchResult()
{
    if (this.readyState == 4 ||
        (this.readyState == 3 && this.responseText.indexOf("synonym_terms") > 0))
    {
        if (gaData[this.index])
        {
            return;
        }
        
        console.log("-------------" + this.index + "----------------");
        
        var sHTML = this.responseText;
        var iBegin, iEnd;
        var i, j;
        var sPhoneticSymbol = "";
        var sSoundUrl = "";
        
        sHTML = sHTML.replace(/【口】/g, "");

        iBegin = sHTML.indexOf("KK[");
        if (iBegin > 0)
        {
            iEnd = sHTML.indexOf("<", iBegin);
            sPhoneticSymbol = sHTML.substring(iBegin, iEnd).trim();
        }
        
        iBegin = sHTML.indexOf(".mp3");
        if (iBegin > 0)
        {
            iEnd = sHTML.indexOf("&quot", iBegin);
            iBegin = sHTML.lastIndexOf("http", iEnd);
            sSoundUrl = sHTML.substring(iBegin, iEnd).trim();
            
            //console.log("SU:" + sSoundUrl);
        }
        
        //sHTML = sHTML.split("</li></ul></div></li>")[0];
        sHTML = sHTML.split("synonym_terms")[0];
        
        var asText = sHTML.split("class=\"fz-s mb-10\"");

        
        var sText = "";
        var asLexical = [];
        var aasExplanation = [];
        var aasExample = [];
        
        for (i = 0; i < asText.length - 1; i++)
        {
            sText = asText[i + 1].split("<h3 ")[0];
            iBegin = sText.indexOf(">") + 1;
            iEnd = sText.indexOf("<", iBegin);
            asLexical[i] = sText.substring(iBegin, iEnd);

            aasExplanation[i] = [];
            aasExample[i] = [];
            
            var asTemp = sText.split("<h4>");
            var sTemp = "";
            for (j = 0; j < asTemp.length - 1; j++)
            {
                sTemp = asTemp[j + 1];
                //console.log(j + "_" + sTemp);
                
                iBegin = sTemp.indexOf("<h4>") + 4;
                iEnd = sTemp.indexOf("</h4>", iBegin);
                aasExplanation[i][j] = sTemp.substring(iBegin, iEnd);
                
                iBegin = sTemp.indexOf("id=\"example\"");
                
                if (iBegin > 0)
                {
                    iBegin = sTemp.indexOf(">", iBegin) + 1;
                    iEnd = sTemp.indexOf("</span>", iBegin);
                    var sWithTag = sTemp.substring(iBegin, iEnd);
                    //aasExample[i][j] = sWithTag.replace(/<(?:.|\n)*?>/gm, '').trim();
                    aasExample[i][j] = sWithTag.replace(/(<([^>]+)>)/ig, "").trim();

                    iBegin = aasExample[i][j].indexOf("isplay: inline;");
                    if (iBegin < 0)
                    {
                        iBegin = aasExample[i][j].indexOf(": #") - 2;
                    }
                    if (iBegin > 0)
                    {
                        iEnd = aasExample[i][j].indexOf(">", iBegin) + 1;
                        var sRemove = aasExample[i][j].substring(iBegin, iEnd);
                        aasExample[i][j] = aasExample[i][j].replace(sRemove, "");
                    }
                }
            }
        }
        
        // for debug
        for (i = 0; i < asLexical.length; i++)
        {
            console.log(i + " : " + asLexical[i] + " : " + aasExplanation[i].length);
            
            for (j = 0; j < aasExplanation[i].length; j++)
            {
                console.log(j + "_" + aasExplanation[i][j]);
                
                if (aasExample[i][j])
                {
                    console.log(j + "_" + aasExample[i][j]);
                }
            }        
        }
        
        gaData[this.index] = {
            word: this.word,
            phoneticSymbol: sPhoneticSymbol,
            sound: sSoundUrl,
            lexical: asLexical,
            explanation: aasExplanation,
            example: aasExample
        }
        
        updateTable();
    }
}

function updateTable()
{
    var sHTML = "<table border='2' class='Center'>";
    
    for (var i = 0; i < gaData.length; i ++)
    {
        if (!gaData[i])
        {
            continue;
        }

        var aaTemp = gaData[i].explanation;
        
        for (var j = 0; j < aaTemp.length; j++)
        {
            for (var k = 0; k < aaTemp[j].length; k++)
            {
                sHTML += i == 0 ? "<tr class='TableTitle'>" : "<tr>";
                
                if (gChecked.word)
                {
                    sHTML += "<td>";
                    sHTML += (j == 0 && k == 0) ? gaData[i].word : "";
                    sHTML += "</td>";
                }
                
                if (gChecked.phoneticSymbol)
                {
                    sHTML += "<td>";
                    sHTML += (j == 0 && k == 0) ? gaData[i].phoneticSymbol : "";
                    sHTML += "</td>";
                }
                
                if (gChecked.sound)
                {
                    sHTML += "<td>";
                    sHTML += (j == 0 && k == 0 && gaData[i].sound.indexOf("http") == 0) ? "<a class='PLAY_SOUND'><img src='http://files.softicons.com/download/web-icons/web-2.0-blue-icons-by-axialis-team/png/16/Sound.png'></img></a>" : "";
                    
                    //console.log("-->" + "<audio id='SOUND_ID_" + i + "'><source src='" + gaData[i].sound  + "' type='audio/mpeg'></audio>" + "<div onclock='document.getElementById('SOUND_ID_" + i + "').play()'>Play</div>");
                    // "<audio id='SOUND_ID_" + i + "'><source src='" + gaData[i].sound  + "' type='audio/mpeg'></audio>" + 
                    
                    sHTML += "</td>";
                }
                
                if (gChecked.lexical)
                {
                    sHTML += "<td>";
                    sHTML += (k == 0) ? gaData[i].lexical[j] : "";
                    sHTML += "</td>";
                }
                if (gChecked.explanation)
                {
                    sHTML += "<td>";
                    sHTML += gaData[i].explanation[j][k];
                    sHTML += "</td>";   
                }
                if (gChecked.example)
                {
                    sHTML += "<td>";
                    sHTML += (gaData[i].example[j] && gaData[i].example[j][k]) ? gaData[i].example[j][k] : "";
                    sHTML += "</td>";      
                }                

                sHTML += "</tr>";
            }
        }

    }
    
    sHTML += "</table>";
    sHTML += "<div class='Center'>附註:　[U]:不可數名詞(uncountable)　　　[C]:可數名詞(countable)</div><br>";
    
    var sBehindHTML = "<!DOCTYPE html><html><head><meta charset='utf-8'></head><body>";
    var sAfterHTML = "</body></html>";
    var blob = new Blob([sBehindHTML + sHTML + sAfterHTML], {type: "text/plain;charset=utf-8"});
    var sUrl = URL.createObjectURL(blob);
    
    
    sHTML += "<a id='OUTPUT_TEXT_ID'>下載HTML表格</a><br>";
    sHTML += "<audio id='SOUND_ID'><source src='' type='audio/mpeg'></audio>";
    
    var eDiv = document.getElementById("RESULT_DIV_ID");
    eDiv.innerHTML = sHTML;
    
    
    eDiv = document.getElementById("OUTPUT_TEXT_ID");
    eDiv.href = sUrl;
    eDiv.onclick = clickOutputHTML;
    
    var aeDiv = document.getElementsByClassName("PLAY_SOUND");
    for (var l = 0; l < aeDiv.length; l++)
    {
        aeDiv[l].onclick = playAudio;
        aeDiv[l].index = l + 1; // gaData[0].sound is not a sound url
    }
}

function playAudio()
{
    console.log("[YD]Play Audio : " + this.index);
    
    var eDiv = document.getElementById("SOUND_ID");
    
    eDiv.src = gaData[this.index].sound;
    eDiv.play();
}

function clickOutputHTML()
{
    this.download = "查詢結果_" + getNowTime() + ".html";   
}

function sendHttpRequest(sUrl, onReadyFunction, sWord, i)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = onReadyFunction;
    xhr.open("GET", sUrl, true);
    xhr.send();
    xhr.index = i;
    xhr.word = sWord;
}




function updateSetting()
{
    initChecked();
}

function setIconEnable()
{
    chrome.extension.sendMessage({
        msg: "SetIcon"
    }, function(response) {
    });
}

function getNowTime() 
{
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
        var month = '0'+month;
    }
    if(day.toString().length == 1) {
        var day = '0'+day;
    }   
    if(hour.toString().length == 1) {
        var hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        var minute = '0'+minute;
    }
    if(second.toString().length == 1) {
        var second = '0'+second;
    }   
    
    return year + '' +month + '' + day + '' + hour + '' + minute + '' + second;
}


/*

# Yahoo Dictory

https://tw.search.yahoo.com/sugg/gossip/gossip-tw-vertical_ss/?output=fxjsonp&pubid=1306&command=關鍵字&l=1&bm=3&appid=ydictionary&t_stmp=1395646717427&pq=car&nresults=10&bck=5k2ebfd9car5i%26b%3D4%26d%3DiiKfWG5pYEKrHcXKy2cw2b1DxeVOoCX5gpzCaw--%26s%3D25%26i%3D2gKtgxrQENbFmvvA7N00&csrcpvid=8J_ReDExOS5aCct7UsVsshUcMjAyLlMv4PD_0F2o&vtestid=&mtestid=null&spaceId=1351200381&callback=YUI.Env.JSONP.yui_3_9_1_1_1440932726773_483

https://tw.dictionary.yahoo.com/dictionary?p=family

*/