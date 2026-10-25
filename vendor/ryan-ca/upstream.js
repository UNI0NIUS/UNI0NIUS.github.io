//my jam on a really cool CA visualization on the old thealef.net


const canvas = document.getElementById("canvas")

// var height = document.getElementById("stuff").clientHeight
var height = window.innerHeight
// var xmax = window.innerWidth
var xmax = document.body.clientWidth
// var ymax = height+200
var ymax = height

var ctx = canvas.getContext('2d')

ctx.canvas.width = xmax
ctx.canvas.height = ymax

var blockSize = 2

var xmax = Math.floor(xmax/blockSize)
var ymax = Math.floor(ymax/blockSize)

var numColors = 5
rgbColors = genRgbColors()
colors = rgbColors.map(rgbToHex)

window.addEventListener("keydown", (e) => {
    if(e.key == 'c'){
        console.log(colors)
        rgbColors = genRgbColors()
        colors = rgbColors.map(rgbToHex)
    }
})

var numRules = Math.pow(numColors,3*numColors-2)
var ruleNumber = Math.floor(Math.random()*numRules)

var seedRadius = 10

var row = []
var y = 0
var direction = 1

var go = false

window.addEventListener("resize",(e) => {
    if(window.innerWidth != ctx.canvas.width){
        stopAndGo()
    }
})

window.addEventListener("load",begin)


function begin(){
    // height = document.getElementById("stuff").clientHeight
    height = window.innerHeight
    xmax = xmax = document.body.clientWidth
    ymax = height
    ctx.canvas.width = xmax
    ctx.canvas.height = ymax
    xmax = Math.floor(xmax/blockSize)
    ymax = Math.floor(ymax/blockSize)

    y = 0
    direction = 1
    row = []
    for(x = 0; x < xmax; x++){
        row.push(Math.floor(Math.random()*numColors))
    }

    go = true

    render()
}

function stopAndGo(){
    go = false
    setTimeout(begin,10)
}

function render() {
    if(go){
        //clear next row
        ctx.clearRect(0,y*blockSize,xmax*blockSize,blockSize)
        for(x = 0; x < xmax; x++){
            drawPixel(x,y,row[x])
        }

        //compute next row
        row = nextRow(row,ruleNumber)

        //draw next row
        if(y < ymax/2+seedRadius && y > ymax/2-seedRadius){
            r = Math.sqrt(seedRadius*seedRadius-Math.pow(y - ymax/2,2))
            for(i = 0; i < 2*r; i++){
                row[Math.floor(xmax/2-r)+i] = Math.floor(Math.random()*numColors)
            }
        }

        //reverse if at boundary
        if(y >= ymax-1){
            direction = -1
            // ruleNumber = Math.floor(Math.random()*numRules)
            rgbColors = updateRgbColors()
            colors = rgbColors.map(rgbToHex)
        }
        else if(y == 0){
            direction = 1
            ruleNumber = Math.floor(Math.random()*numRules)
            rgbColors = updateRgbColors()
            colors = rgbColors.map(rgbToHex)
        }

        //iterate and recurse
        y+=direction
        setTimeout(render,8)
    }
    
}

function nextRow(lastRow,n){
    result = []
    for(j = 0; j < xmax; j++){
        i = (j - 1+xmax)%xmax
        k = (j+1)%xmax
        result.push(rule(lastRow[i]+lastRow[j]+lastRow[k],n))
    }
    return result
}

function rule(a,n){
    // Wolfram "totalistic cellular automaton"
    //two lines of magic
    var bitString = n.toString(numColors)
    if(a >= bitString.length){
        return 0
    }
    else {
        return parseInt(bitString[a])
    }
}

function genRgbColors(){
    var result = []
    for(var i = 0; i < numColors; i++){
        result.push([
            Math.floor(Math.random()*255),
            Math.floor(Math.random()*255),
            Math.floor(Math.random()*255)
        ])
    }
    return result
}

function updateRgbColors(){
    var result = []
    for(var i = 0; i < numColors; i++){
        result.push(
            [
                Math.abs((rgbColors[i][0] + Math.floor(Math.random()*60-30))%255),
                Math.abs((rgbColors[i][1] + Math.floor(Math.random()*60-30))%255),
                Math.abs((rgbColors[i][2] + Math.floor(Math.random()*60-30))%255)
            ]
        )
    }
    return result
}

function drawPixel(x,y,p){
    ctx.fillStyle = colors[p]
    ctx.fillRect(x*blockSize,y*blockSize,blockSize,blockSize)
}


function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(c) {
    return "#" + componentToHex(c[0]) + componentToHex(c[1]) + componentToHex(c[2]);
}
