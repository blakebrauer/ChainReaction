var DEBUG_MODE = false;
var cornerText = ["&#9562", "&#9556","&#9559","&#9565"];
var boardHeight = 36, boardWidth = 80;
var gameBoard;
var neighbors = [];
var gameLoop = false;
var highScore = 0;
var score = 0;


function pageLoad() {
    resetBoard();
}

function resetBoard(){
    if(!gameLoop){
        gameBoard = genRandomBoard(boardHeight, boardWidth);
        document.getElementById("gameText").innerHTML = boardToHTML(gameBoard);
    }
}

function boardToHTML(arr){
    var lr = boardHeight, lc = boardWidth;
    var output = "";
    for(var r = 0; r < lr; r++){ 
        for(var c = 0; c < lc; c++){
            output += "<span id='" + r + "," + c + "' onclick='charClicked(" + r + "," + c + ")'>";
            output += cornerText[arr[r][c]];
            output += "</span>";
        }
        output += "<br>";
    }
    return output;
}

function genRandomBoard(lr, lc){
    var out = [];
    for(var r = 0; r < lr; r++){
        var tempRow = [];
        for(var c = 0; c < lc; c++){
            tempRow.push( (Math.random()*4) | 0);
        }
        out.push(tempRow);
    }
    return out;
}

function charClicked(r, c){
    if(neighbors.length==0){
        neighbors = [[r,c]];
        gameLoop = setInterval(chainReact, 100);
    }
}

function changeCell(r, c){
    gameBoard[r][c] = (gameBoard[r][c]+1) % 4;
    document.getElementById(r + "," + c).innerHTML = cornerText[gameBoard[r][c]];
    score++;
}

function chainReact(){
    if(neighbors.length>0){
        for(var n = 0, l = neighbors.length; n<l; n++){
            changeCell(neighbors[n][0],neighbors[n][1]);
        }
        neighbors = getNeighbors(neighbors, gameBoard);
        document.getElementById("scoreText").textContent = score;
    } else {
        clearInterval(gameLoop);
        gameLoop = false;
        if(score>highScore){
            highScore=score;
            document.getElementById("highScoreText").textContent = highScore;
        }
        score = 0;
    }
}

function getNeighbors(parents, arr){
    var out = [];
    var h = arr.length, w = arr[0].length;
    for(var n = 0, l = parents.length; n<l; n++){
        var r = parents[n][0], c = parents[n][1];
        if(r-1>=0){
            if(arr[r][c] % 3 == 0 && arr[r-1][c] % 3 != 0){
                out.push([r-1,c]);
            }
        }
        if(c-1>=0){
            if(arr[r][c] >= 2 && arr[r][c-1] <= 1){
                out.push([r,c-1]);
            }
        }
        if(r+1<h){
            if(arr[r][c] % 3 != 0 && arr[r+1][c] % 3 == 0){
                out.push([r+1,c]);
            }
        }
        if(c+1<w){
            if(arr[r][c] <= 1 && arr[r][c+1] >= 2){
                out.push([r,c+1]);
            }
        }
    }
    return removeDuplicates(out);
}

/**
 * Removes duplicate values from an array
 *    have the same resulting string
 */
function removeDuplicates(arr) {
    var len=arr.length;
    var out=[];
    var strings = [];
    for(var i = 0; i<len; i++){
        strings.push(JSON.stringify(arr[i]));
    }
    for (var i=0;i<len;i++) {
        var flag = true;
        for (var j=i+1; j<len && flag; j++) {
            if (strings[i] == strings[j]){
                flag = false;
            }
        }
        if (flag){
            out.push(arr[i]);
        }
    }
    return out;
}

function setScoreCookie() {
    document.cookie = "highScore=" + highScore + "; expires=Tue, 19 Jan 2038 03:14:07 UTC";
}

function getScoreCookie() {
    var name = "highScore=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return parseInt(c.substring(name.length, c.length));
        }
    }
    return 0;
}