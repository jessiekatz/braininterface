let img, img2;
let rectY = [];
let rectX = [];
let clicked = false;
let waveOffset = 0;


function preload() {
    img = loadImage('assets/images/brain2.png');
    img2 = loadImage('assets/images/brain4.png');
}

function setup() {
    let onCanvas = document.getElementById("switch");
    const pic = document.createElement("img");
    pic.src = "assets/images/off2.png";
    pic.width=250;
    onCanvas.appendChild(pic);

    let brain = document.getElementById("brain");
    let canvas = createCanvas(brain.offsetWidth, brain.offsetHeight);
    canvas.parent('brain');
    frameRate(30);
    img.resize(width, height); 

    
}

function draw() {
    background('rgba(0,0,0,0)');
    image(img, 0, 0, width, height); 
    if (clicked) {    
        console.log("hi")
        clear();
        image(img2, 0,0,width, height);
        drawMosaic(2, color(50, 50, 50)); 
    } 
    waveOffset += 0.05;
}

function onClick() {
    const myButton = document.getElementById('switch');

    myButton.addEventListener('click', function(event) {
        console.log('Button was clicked!');
        let c = document.getElementById("switch");

        while (c.firstChild) {
            c.removeChild(c.firstChild);
        }

        const p = document.createElement('img');
        p.src = "assets/images/on2.png";
        p.width = 250;
        // p.style.marginTop = '1.75em';
        clicked=true;
        c.appendChild(p);
    });
}

window.onload = onClick;

onClick();

const columnWidth = (rad) => rad * 2 + 2; 

const numberOfColumns = (rad) =>
  Math.ceil(width / columnWidth(rad));

function drawColumnDots(rad, offsetX) {
    let dotDiameter = 2 * rad;
    let dotHeightWithPadding = dotDiameter + 1;
    let numDotsInColumn = Math.floor(height / dotHeightWithPadding);

    for (let i = 0; i < numDotsInColumn; i++) {
        // Adjusted X to fit properly
        let X = offsetX + rad; 
        let Y = i * dotHeightWithPadding + rad + sin((i + waveOffset) * 0.5) * 10;

        if (X < img.width && Y < img.height) { 
            let dotColor = img.get(X, Y);
            noStroke();
            let r = dotColor[0];
            let g = dotColor[1];
            let b = dotColor[2];
            if (r == 0 && g == 0 && b == 0) {
                fill(0, 0, 0, 0);
            } else {      
                fill(r-20, g-20, b-20);
            }
            rectY.push(Y);
            rectX.push(X);

            rect(X, Y, dotDiameter, dotDiameter);
        }
    }
}

function drawMosaic(dotRadius, backgroundColor) {
    for (let i = 0; i < numberOfColumns(dotRadius); i++) {
        let offsetX = i * columnWidth(dotRadius);
        drawColumnDots(dotRadius, offsetX);
    }
}

