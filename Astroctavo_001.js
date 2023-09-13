const myCanvas = document.getElementById("myCanvas");
const ctx = myCanvas.getContext("2d");

ctx.scale(1,1);

let fontDef = "80px Garamond";

ctx.font = `${fontDef}`;


let astrumAtrix = [];

const astrumCsv = document.getElementById("csvFile");

let minorArcanaArray = [];

let usedColArray = [[17, 21, 33, 42], [51, 45, 61, 70], [79, 73, 89, 98], [107, 101, 117, 126], [135, 129, 145, 154], [163, 157, 173, 182], [191, 185, 201, 210]];

let exclusionList = [];

const astrologicalClock = true;

const astrologicalClockOffset = 180;

const dividerArcDegDataColumn = 12;

const astrumSunOffsetColumn = 22;

const sunTimeOffsetColumn = 9;

const pointerLineWidth = 8; //px

const pointerLinesVal = [[0, 42], [71, 116], [236, 252], [330, 346], [395, 408], [456, 509], [536, 548], [575, 602]];

const pointerIniLength = 602;

const pointerCurrentLength = 2408;

const lengthRatio = pointerCurrentLength / pointerIniLength;

const pointerOriginX = Math.round(myCanvas.width / 2);

const pointerOriginY = Math.round(myCanvas.height / 2);

const exportArea = document.getElementById('exportArea');

let saveButtonState = 0;



//let textDim = Math.ceil(ctx.measureText("MM").width);

//console.log(textDim);

const cellDef = {

    lateralPadding: 10, /*px*/

    topPadding: 30, /* % of "M" width*/

    bottomPadding: 50 /* % of "M" width, defines textBaseline position relative to bottom of cell*/
}



function getMaxCellWidth(astrumArray, colIndex){

    let maxWidth = 0;

    let maxWidthItem = null;

    for(let i = 0; i < astrumArray.length; i++){

        if(Math.ceil(ctx.measureText(astrumArray[i][colIndex]).width) > maxWidth){ 
            
            maxWidth = Math.ceil(ctx.measureText(astrumArray[i][colIndex]).width);

            maxWidthItem = astrumArray[i][colIndex];
        }
    }

    //console.log(maxWidthItem);
    return(maxWidth);
}



function getFullMaxCellWidth(fullAstrumArray, fullAstrumUsedColArray, colIndex){

    let currentMaxWidth = 0;

    let localMaxWidth = 0;

    for(let i = 0; i < fullAstrumArray.length; i++){

        localMaxWidth = getMaxCellWidth(particularAstrumArray(i, fullAstrumArray, fullAstrumUsedColArray), colIndex);

        if(localMaxWidth > currentMaxWidth){currentMaxWidth = localMaxWidth;}
    }

    return(currentMaxWidth);
}



function getMaxCellWidthArray(fullAstrumArray, fullAstrumUsedColArray, colNumber){

    let maxCellWidthArray = [];

    for(let i = 0; i < colNumber + 1; i++){

        if(i === 0){

            maxCellWidthArray.push(Math.ceil(ctx.measureText("MM").width));
        }
        else{

            maxCellWidthArray.push(getFullMaxCellWidth(fullAstrumArray, fullAstrumUsedColArray, i - 1));
        }
    }

    return(maxCellWidthArray);
}

function getTableWidth(cellWidthArray, cellDefObj){

    let tableWidth = 0;

    for(let i = 0; i < cellWidthArray.length; i++){

        tableWidth = tableWidth + cellWidthArray[i] + 2 * cellDefObj.lateralPadding;
    }

    return(tableWidth);
}


function getCellHeight(cellDefObj){

    let mHeight = Math.ceil(ctx.measureText("M").width);

    let absTopPadding = Math.ceil((mHeight * cellDefObj.topPadding) / 100);

    let absBottomPadding = Math.ceil((mHeight * cellDefObj.bottomPadding) / 100);

    return(mHeight + absTopPadding + absBottomPadding);
}

console.log(`cell height: ${getCellHeight(cellDef)}`);

function getTableHeight(rowsNumber, cellDefObj){

    return(rowsNumber * getCellHeight(cellDefObj));
}



function coloursArrayCreate(fullAstrumArray){

    let localColArray = [];

    let shovelArray = [];

    for(let i = 0; i < fullAstrumArray.length; i++){

        for(let j = fullAstrumArray[i].length - 3; j < fullAstrumArray[i].length; j++){

            shovelArray.push(fullAstrumArray[i][j]);
        }

        localColArray.push(shovelArray);

        shovelArray = [];
    }

    return(localColArray);
}



function minorArcanaArrayCreate(){

    const suitsArray = ["Wands", "Disks", "Swords", "Cups"];

    let suitCounter = 0;

    let cardCounter = 0;

    let m = 1;

    let suit = "";

    let card = "";



    for(let i=0; i<36; i++){

        card = `${cardCounter + 2}`;

        cardCounter++;

        if(cardCounter === 9){cardCounter = 0}

        suit = suitsArray[suitCounter];

        m++;

        if(m === 4){
        
            m = 1;

            suitCounter++;

            if(suitCounter === 4){suitCounter = 0}
        
        }

        minorArcanaArray.push(`${card} of ${suit}`);

    }
}



minorArcanaArrayCreate();

function decanMinorArcane(position){

    let currentDecan = Math.trunc(position / 10);

    let currentArcana = minorArcanaArray[currentDecan];

    return(currentArcana);
}



function particularAstrumArray(currentIndex, fullAstrumArray, fullAstrumUsedColArray){

    let currentArray = [];

    let shovelArray = [];

    for(let i = 0; i < 7; i++){

        for(let j = 0; j < fullAstrumUsedColArray[i].length; j++){

            if(j === 1){

                shovelArray.push(decanMinorArcane(fullAstrumArray[currentIndex][fullAstrumUsedColArray[i][j]]));
            }
            else{
                
                shovelArray.push(fullAstrumArray[currentIndex][fullAstrumUsedColArray[i][j]]);
            }
        }

        currentArray.push(shovelArray);

        shovelArray = [];
    }

    return(currentArray);
}


function tableDraw(tableIndex, fullAstrumArray, fullAstrumUsedColArray, cellDefObj, tableDefObj, originX, originY){

    let colourR = tableDefObj.coloursArray[tableIndex][0];

    let colourG = tableDefObj.coloursArray[tableIndex][1];

    let colourB = tableDefObj.coloursArray[tableIndex][2];

    let cellTextY = Math.ceil(ctx.measureText("M").width) + Math.ceil((Math.ceil(ctx.measureText("M").width) * cellDefObj.topPadding) / 100);

    let currentAstrumArray = particularAstrumArray(tableIndex, fullAstrumArray, fullAstrumUsedColArray);

    let originYAccumulator = originY;

    let textOriginX = 0;

    let originXAccumulator = 0;

    for(let i = 0; i < currentAstrumArray.length + 2; i++){

        if(i === 0){

            ctx.fillStyle = `rgba(${colourR}, ${colourG}, ${colourB}, 1)`;

            ctx.fillRect(originX, originYAccumulator, getMaxCellWidthArray(fullAstrumArray, fullAstrumUsedColArray, 4)[0] + 2 * cellDef.lateralPadding, getCellHeight(cellDefObj));

            ctx.fillStyle = `rgba(${colourR}, ${colourG}, ${colourB}, ${tableDefObj.alphaChannels[0]})`;

            ctx.fillRect(originX + getMaxCellWidthArray(fullAstrumArray, fullAstrumUsedColArray, 4)[0] + 2 * cellDef.lateralPadding, originYAccumulator,
                            tableDefObj.tableWidth - getMaxCellWidthArray(fullAstrumArray, fullAstrumUsedColArray, 4)[0] - 2 * cellDef.lateralPadding, getCellHeight(cellDefObj));

            ctx.textAlign = "center";

            ctx.fillStyle = "black";

            ctx.font = `bolder ${fontDef}`;

            textOriginX = originX + getMaxCellWidthArray(fullAstrumArray, fullAstrumUsedColArray, 4)[0] + 2 * cellDef.lateralPadding +
            (tableDefObj.tableWidth - getMaxCellWidthArray(fullAstrumArray, fullAstrumUsedColArray, 4)[0] - 2 * cellDef.lateralPadding)/2;

            if(tableIndex === 0){
                
                ctx.fillText(`${fullAstrumArray[tableIndex][0]}`.toUpperCase(), textOriginX, originYAccumulator + cellTextY);
            }
            else{

                ctx.fillText(`${fullAstrumArray[tableIndex][13]}`.toUpperCase(), textOriginX, originYAccumulator + cellTextY);
            }

            ctx.font = `${fontDef}`;
        }
        else{

            originYAccumulator = originYAccumulator + getCellHeight(cellDefObj);

            if(i === 1){

                originXAccumulator = originX;

                ctx.fillStyle = `rgba(${colourR}, ${colourG}, ${colourB}, 1)`;

                ctx.fillRect(originXAccumulator, originYAccumulator, getMaxCellWidthArray(fullAstrumArray, fullAstrumUsedColArray, 4)[0] + 2 * cellDef.lateralPadding, getCellHeight(cellDefObj));

                originXAccumulator = originXAccumulator + tableDefObj.columnsWidthArray[0] + 2 * cellDef.lateralPadding;

                ctx.fillStyle = `rgba(${colourR}, ${colourG}, ${colourB}, ${tableDefObj.alphaChannels[1]})`;

                ctx.fillRect(originXAccumulator, originYAccumulator, tableDefObj.tableWidth - getMaxCellWidthArray(fullAstrumArray, fullAstrumUsedColArray, 4)[0] - 2 * cellDef.lateralPadding, getCellHeight(cellDefObj));

                ctx.textAlign = "center";

                ctx.fillStyle = "black";
    
                ctx.font = `bold ${fontDef}`;
                
                for(let m = 1; m < tableDefObj.columnsWidthArray.length; m++){
                    
                    textOriginX = originXAccumulator + (tableDefObj.columnsWidthArray[m] + cellDef.lateralPadding * 2) / 2;

                    ctx.fillText(`${tableDefObj.rowHeadersContent[m-1]}`, textOriginX, originYAccumulator + cellTextY);

                    originXAccumulator = originXAccumulator + tableDefObj.columnsWidthArray[m] + 2 * cellDef.lateralPadding;

                }

            }


            else{

                if(i%2 != 0){

                    ctx.fillStyle = `rgba(${colourR}, ${colourG}, ${colourB}, ${tableDefObj.alphaChannels[1]})`;
                }
                else{

                    ctx.fillStyle = `rgba(${colourR}, ${colourG}, ${colourB}, ${tableDefObj.alphaChannels[0]})`;
                }

                ctx.fillRect(originX, originYAccumulator, tableDefObj.tableWidth, getCellHeight(cellDefObj));

                

                ctx.fillStyle = "black";
    
                

                originXAccumulator = originX;

                for(let m = 0; m < tableDefObj.columnsWidthArray.length; m++){

                    if(m === 0){

                        ctx.textAlign = "center";

                        ctx.font = `bold ${fontDef}`;

                        textOriginX = originXAccumulator + (tableDefObj.columnsWidthArray[m] + cellDef.lateralPadding * 2) / 2;

                        ctx.fillText(`${tableDefObj.columnHeadersContent[i - 2]}`, textOriginX, originYAccumulator + cellTextY);

                        originXAccumulator = originXAccumulator + tableDefObj.columnsWidthArray[m] + cellDef.lateralPadding * 2;

                        ctx.font = `${fontDef}`;

                        ctx.textAlign = "right";
                    }
                    else{

                        textOriginX = originXAccumulator + tableDefObj.columnsWidthArray[m] + cellDef.lateralPadding;

                        ctx.fillText(`${currentAstrumArray[i - 2][m - 1]}`, textOriginX, originYAccumulator + cellTextY);

                        originXAccumulator = originXAccumulator + tableDefObj.columnsWidthArray[m] + cellDef.lateralPadding * 2;
                    }
                }
            }
        }
    }
}


function pointersDraw(astrumIndex, fullAstrumArray, offsetDataColumn, divideArcDataColumn, sunMinutesColumn, colourArray, currentPointerLineWidth, pointerLinesValArray, originX, originY, currentLengthRatio){


    const currentColour = colourArray[astrumIndex];

    const sunDegreesOffset = fullAstrumArray[0][sunMinutesColumn] / 4;
    const currentAstrumSunOffset = fullAstrumArray[astrumIndex][offsetDataColumn];
    const currentDividerArc = fullAstrumArray[0][divideArcDataColumn];

    const colourR = currentColour[0];
    const colourG = currentColour[1];
    const colourB = currentColour[2];

    ctx.strokeStyle = `rgb(${colourR}, ${colourG}, ${colourB})`;
    //ctx.lineWidth = currentPointerLineWidth;

    let rotationAngle = null;

    let astrologicalSwitch = null;

    if(astrologicalClock === true){

        astrologicalSwitch = 1;
    }
    else{

        astrologicalSwitch = 0;
    }

    ctx.translate(originX, originY);

    ctx.rotate((astrologicalSwitch * astrologicalClockOffset + sunDegreesOffset) * Math.PI / 180);

    ctx.translate(-originX, -originY);


    for(let j = 0; j < 7; j++){

        if(j === 0){

            if(astrumIndex === 0){

                rotationAngle = 0;
            }
            else{

                rotationAngle = currentAstrumSunOffset;
            }

            ctx.lineWidth = currentPointerLineWidth * 2;

        }
        else{

            rotationAngle = currentDividerArc;

            ctx.lineWidth = currentPointerLineWidth;
        }

        ctx.translate(originX, originY);

        ctx.rotate(rotationAngle * Math.PI / 180);

        ctx.translate(-originX, -originY);

        ctx.beginPath();

        for(let i = 0; i < pointerLinesValArray.length; i++){

            ctx.moveTo(originX, originY - currentLengthRatio * pointerLinesValArray[i][0]);

            ctx.lineTo(originX, originY - currentLengthRatio * pointerLinesValArray[i][1]);
        }

        ctx.stroke();
    }

    ctx.resetTransform();
}



astrumCsv.addEventListener("change", e => {

    //location.reload();
    e.preventDefault();

    //const tablesArea = document.getElementById("tablesArea");
    let currentFileName = null;
    const currentAstrumCsv = astrumCsv.files[0];
    const reader = new FileReader();

    reader.readAsText(currentAstrumCsv);

    currentFileName = currentAstrumCsv.name;

    currentFileName = currentFileName.slice(0, currentFileName.length - 4);

    console.log(currentFileName);

    reader.onerror = () => {

        console.log('an error has occured');
    }

    reader.onload = () => {

        let myText = reader.result;
        let astrumTextRaw = "";

        astrumTextRaw = astrumTextRaw.concat("", myText);

        let astrumAtrixRows = astrumTextRaw.split("\n");
        astrumAtrixRows.pop();

        for(let i = 0; i < astrumAtrixRows.length; i++){

            astrumAtrix.push(astrumAtrixRows[i].split(","));
        }

        astrumAtrix.shift();

        let tableRowsNumber = 9;

        let columnsWidthArray = getMaxCellWidthArray(astrumAtrix, usedColArray, 4);
        
        let allTablesWidth = getTableWidth(getMaxCellWidthArray(astrumAtrix, usedColArray, 4), cellDef);

        let allTablesHeight = getTableHeight(tableRowsNumber, cellDef);

        let currentColoursArray = coloursArrayCreate(astrumAtrix);

        let astrumSunOffset = [];

        for(let i = 0; i < astrumAtrix.length; i++){

            if(i === 0){

                astrumSunOffset.push("0");
            }
            else{
            
                astrumSunOffset.push(astrumAtrix[i][22]);
            }
        }



        const tableDef = {

            tableWidth: allTablesWidth,

            tableHeigth: allTablesHeight,

            lateralMargins: 20, /*px*/
        
            verticalMargins: 30, /*px*/
        
            coloursArray: currentColoursArray, /* R,G,B table for the specific colours used for each astrum table and graphical pointers */

            alphaChannels: [0.15, 0.25], //even/odd row alpha channel values for cell background colour

            rowHeaders: [0],

            rowHeadersContent: ["Sign", "Card", "Time", "GMT"],

            columnHeaders: [0],

            columnHeadersContent: ["I", "II", "III", "IV", "V", "VI", "VII"],

            rowTablesNumber: 3, //number of tables on a row

            columnsWidthArray: columnsWidthArray
        }


        let tableAreaCenter = myCanvas.offsetWidth / 2;

        let tableAreaOriginX = tableAreaCenter - (tableDef.tableWidth * tableDef.rowTablesNumber + (tableDef.rowTablesNumber - 1) * tableDef.lateralMargins) / 2;

        let currentTableAreaOriginX = tableAreaOriginX;

        let tableAreaOriginY = tableDef.verticalMargins;

        let tablesRowCounter = 0;

        ctx.fillStyle = "white";

        ctx.fillRect(0, 0, 6720, 6720);

        for(let i = 0; i < astrumAtrix.length; i++){

            tableDraw(i, astrumAtrix, usedColArray, cellDef, tableDef, currentTableAreaOriginX, tableAreaOriginY + tablesRowCounter * (tableDef.tableHeigth + tableDef.verticalMargins));

            if((i+1)%tableDef.rowTablesNumber === 0){

                currentTableAreaOriginX = tableAreaOriginX;

                tablesRowCounter++;
            
            }
            else{

                currentTableAreaOriginX = currentTableAreaOriginX + tableDef.tableWidth + tableDef.lateralMargins;
            }

        }

        const csvLoadButtons = document.getElementsByClassName("customFileUpload");

        for(let i = 0; i < csvLoadButtons.length; i++){

            csvLoadButtons[i].style.display = "none";
        }


        document.getElementById("downloadButton").style.display = "block";

        document.getElementById('downloadButton').addEventListener('click', function(e) {
            // Convert the canvas to a data URL
            //let canvasUrl = myCanvas.toDataURL("image/jpeg", 1);

            if(saveButtonState === 0){

                let canvasUrl = myCanvas.toDataURL();
                // Create an anchor, and set the href value to data URL
                const createEl = document.createElement('a');
                createEl.href = canvasUrl;
            
                // This is the name of the downloaded file
                createEl.download = `${currentFileName}_tables`;
            
                // Click the download button, causes a download, and then removes it
                createEl.click();
                createEl.remove();

                canvasUrl = null;
                createEl.href = null;

                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, 6720, 6720);

                ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);

                for(let i = 0; i < astrumAtrix.length; i++){
                    
                    pointersDraw(i, astrumAtrix, astrumSunOffsetColumn, dividerArcDegDataColumn, sunTimeOffsetColumn, currentColoursArray, pointerLineWidth, pointerLinesVal, pointerOriginX, pointerOriginY, lengthRatio);
                }

                saveButtonState = 1;

                document.getElementById('downloadButton').innerText = "descarca pointeri";



            }
            else{

                let canvasUrlPointers = myCanvas.toDataURL();
                // Create an anchor, and set the href value to data URL
                const createElPointers = document.createElement('a');
                createElPointers.href = canvasUrlPointers;
            
                // This is the name of the downloaded file
                createElPointers.download = `${currentFileName}_pointers`;
                createElPointers.target = "_blank";
            
                // Click the download button, causes a download, and then removes it
                createElPointers.click();
                createElPointers.remove();
                
                location.reload();
            }
        });

    }

})