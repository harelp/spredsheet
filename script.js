/* 
    Author: Harel Peri
    Purpose: JS(Sem 3) - Project 1
*/

// ------------------------------------------------|
// global vars and arrays
var _columns = 10,
    _rows = 20,
    _isChrome = ((window.navigator.userAgent).indexOf("Chrome") !== -1),
    _currentCell,
    _rcArray,
    _tblArray = [];
// ------------------------------------------------|
// Creates a dynamic table in html
function Table() 
{
    var divHTML = "<table width='100%' height='100%' border='0' cellpadding='0' cellspacing='0'>";
    divHTML += "<tr><th></th>";

    for (var j = 0; j < _columns; j++)
        divHTML += "<th class='thclass'>" + String.fromCharCode(j + 65) + "</th>";

    // closing row tag for the headers
    divHTML += "</tr>";

    // now do the main table area
    for (var i = 1; i <= _rows; i++) 
    {
        divHTML += "<tr>";
        // ...first column of the current row (row label)
        divHTML += "<td id='" + i + "_0' class='BaseColumn'>" + i + "</td>";

        // ... the rest of the _columns
        for (var j = 1; j <= _columns; j++)
            divHTML += "<td id='" + i + "_" + j + "' class='AlphaColumn' onclick='ClickCell(this)'></td>";

        // ...end of row
        divHTML += "</tr>";
    }

    // finally add the end of table tag
    divHTML += "</table>";
    document.getElementById("table").innerHTML = divHTML;
    // invokes two dim array func as we create the table in html page
    TwoDArray();
    document.getElementById("txtFilter").value = "";
    document.getElementById("span").innerHTML = "Current Cell: "
}
// ------------------------------------------------|
// Filtertext button function
function FilterText(ref) 
{
    if (ref.id === "txtFilter") 
    {
        filterSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789():=+-";
    }         
    if (_isChrome) 
    {
        if (window.event.keyCode === 13) 
        {
            // checks if click is not null
            let click = document.getElementById(_currentCell);
            console.log(!!click);
            if(click !== null)
            {
                // depending on textfilter value does different functionallity
                if (ref.value.toUpperCase().includes("=sum(")) 
                {
                    _tblArray[_rcArray[0]][_rcArray[1]] = ref.value;
                    CalculateCell(_rcArray[0],_rcArray[1]);
                }
                else 
                {
                    _tblArray[_rcArray[0]][_rcArray[1]] = ref.value;
                    click.innerHTML = _tblArray[_rcArray[0]][_rcArray[1]];
                    Recalculate();
                } 
                // empty the current cell id so user has to click again on the cell
                click.style.borderColor = "#f1f1f1";
                _currentCell = "";
            }
            else alert("Select a cell!");
        }
        else if (!nCharOK(window.event.keyCode)) 
        {
            window.event.returnValue = null;
        }
    }
}
// ------------------------------------------------|
// creates two dim array
function TwoDArray()
{
    for (var i = 0; i <= _rows; i++)
    {
        _tblArray[i] = [];
        for (var j = 0; j <= _columns; j++)
            _tblArray[i][j] = "";
    }
}
// ------------------------------------------------|
// recalculation func to recalc every forumals
function Recalculate()
{
    for (var i = 1; i <= _rows; i++)
    {
        for (var j = 1; j <= _columns; j++)
        {
            // checks if the _tblArray has "=sum" if yes than invokes the calculatecell func
            if (_tblArray[i][j].toUpperCase().includes("=SUM"))
                CalculateCell(i, j);         
        }
    }
}
// ------------------------------------------------|
// Calc fun to calulate values depending on the formula 
function CalculateCell(row, col)
{
    var tokenArray = GetFormula(_tblArray[row][col]);
    // token array contains "ar" array from getFormula func
    if (tokenArray !== null){
        // converts char to num and assigns it from index to index;
        var fromRowIndex = parseInt(tokenArray[1].substr(1, tokenArray[1].length - 1));
        var fromColIndex = tokenArray[1].substr(0, 1).toLowerCase().charCodeAt(0) - 97 + 1;

        var toRowIndex = parseInt(tokenArray[2].substr(1, tokenArray[2].length - 1));
        var toColIndex = tokenArray[2].substr(0, 1).toLowerCase().charCodeAt(0) - 97 + 1;

        var sumTotal = 0;


        for (var i = fromRowIndex; i <= toRowIndex ; i++)
        {
            for (var j = fromColIndex; j <= toColIndex; j++)
            {
                if (IsFloat(_tblArray[i][j]))
                {
                    sumTotal += parseFloat(_tblArray[i][j]);
                }
            }
        }

        // assinging the total to cell id that has the forumla
        var cell = row + "_" + col;
        var ref = document.getElementById(cell)
        ref.innerHTML = sumTotal;
    }
}
// ------------------------------------------------|
// checks if the tblarray value is a num or not
function IsFloat(s){
    var ch = "";
    var justFloat = "0123456789.";
    
    for (var i = 0; i < s.length; i++)
    {
        ch = s.substr(i, 1);
    
        if (justFloat.indexOf(ch) == -1)
            return false;
    }
    return true;
}
// ------------------------------------------------|
// clickCell function gets the id when a user clicks on a cell
function ClickCell(ref) 
{
    _rcArray = ref.id.split('_');
    _currentCell = ref.id;
    ref.style.borderColor = "#000";
    document.getElementById("txtFilter").value = _tblArray[_rcArray[0]][_rcArray[1]];
    document.getElementById("span").innerHTML = "Current Cell: " + String.fromCharCode(64 + parseInt(_rcArray[1])) + _rcArray[0];
}
// ------------------------------------------------|
// filter the currently entered character to see that it is part of the acceptable character set
function nCharOK(c) 
{
    let ch = (String.fromCharCode(c));
    ch = ch.toUpperCase();
    // if the current character is not found in the set of all numbers
    // set the flag variable to fail
    if (filterSet.indexOf(ch) !== -1)
        return true;
    else 
        return false;
}
// ------------------------------------------------|
// Clear function
let ClearAll = () => Table();
// ------------------------------------------------|
// Gets the formula from calc func and returns array;
function GetFormula(tbValue)
{
    var pattern = /[:|\(|\)]/;
    var ar = tbValue.split(pattern);
    var sum = ar[0].toUpperCase();
    
    if (ar.length < 3)
        return null;
    else if (sum !== "=SUM")
        return null;
    else
        return ar;
}