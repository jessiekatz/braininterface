document.addEventListener("DOMContentLoaded", function () {
    const pix_size = 10;
    let pix_arr = [];
    let num_col;
    let num_row;
    let p5Instance = null;
    let clicked = false;
    let streams = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>Document</title><link rel="stylesheet" href="styles.css"></head><body><div id="container"><div id="brain"></div></div><script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js"></script><script src="scripts.js"></script></body></html> let img;let rectY=[];let rectX=[];function preload(){img=loadImage('assets/images/brain-right.jpg');}function setup(){let brain=document.getElementById("brain");let canvas=createCanvas(brain.offsetWidth,brain.offsetHeight);canvas.parent('brain');frameRate(2);img.resize(width,height);}function draw(){background('#e5e5e5');image(img,0,0,width,height);drawMosaic(3,color(50,50,50));}const co0lumnWidth=(rad)=>rad*2+2;const numberOfColumns=(rad)0=00>Math011000.ceil(11w10001011000idth/columnWidth(rad))0011001001110;000010101011111000000111010001111110100101011000011100100011111100001011001000010010100100101001100111100001000101101000001110100001001110101100001111011010000101010100100000000000000000000000`;
let thoughts = ["hello", "am i", "a", "yes the viewing is"];
let letters = [];
let maxLetters = 20; // Max number of substrings on the screen at once

    function setupSketch(id) {
        const canvasParent = document.getElementById(id);
        
        if (!canvasParent) {
            console.error(`Element with id "${id}" not found`);
            return;
        }

        const sketch = (p) => {
            p.setup = () => setup(p, canvasParent);
            p.draw = () => draw(p);
        };

        p5Instance = new p5(sketch, canvasParent);
    }

    function setup(p, canvasParent) {
        p.createCanvas(canvasParent.offsetWidth, canvasParent.offsetHeight).parent(canvasParent);
        num_col = p.floor(p.width / pix_size);
        num_row = p.floor(p.height / pix_size);
        restart(p);
        p.frameRate(15);
    }

    function restart(p) {
        pix_arr = [];
        for (let c = 0; c < num_col; c++) {
            pix_arr[c] = [];
            for (let r = 0; r < num_row; r++) {
                let pix = new Pixel(c, r, p);
                pix_arr[c].push(pix);
            }
        }
        getNeighborhood(p);
    }

    function draw(p) {
        if (clicked == false) {
            p.background(255,242,245);
        } else {
            p.background(255, 227,245);
            for (let c = 0; c < num_col; c++) {
                for (let r = 0; r < num_row; r++) {
                    pix_arr[c][r].getnextPat(p);
                }
            }
            for (let c = 0; c < num_col; c++) {
                for (let r = 0; r < num_row; r++) {
                    pix_arr[c][r].draw_pix(p);
                }
            }
        } 

        for (let i = 0; i < letters.length; i++) {
            letters[i].display();
            letters[i].update();
          }
    }
    function onClick() {
        const myButton = document.getElementById('switch');
    
        myButton.addEventListener('click', function(event) {
            
            clicked=true;
        });
    }
    
    window.onload = onClick;
    
    onClick();

    function getNeighborhood(p) {
        for (let c = 0; c < num_col; c++) {
            for (let r = 0; r < num_row; r++) {
                let top = c - 1;
                let bottom = c + 1;
                let right = r + 1;
                let left = r - 1;

                if (top < 0) top = num_col - 1;
                if (bottom === num_col) bottom = 0;
                if (right === num_row) right = 0;
                if (left < 0) left = num_row - 1;

                pix_arr[c][r].neighbor.push(pix_arr[top][r]);
                pix_arr[c][r].neighbor.push(pix_arr[bottom][r]);
                pix_arr[c][r].neighbor.push(pix_arr[c][left]);
                pix_arr[c][r].neighbor.push(pix_arr[c][right]);
                pix_arr[c][r].neighbor.push(pix_arr[top][right]);
                pix_arr[c][r].neighbor.push(pix_arr[top][left]);
                pix_arr[c][r].neighbor.push(pix_arr[bottom][left]);
            }
        }
    }

    class Pixel {
        constructor(x, y, p) {
            this.x = x * pix_size;
            this.y = y * pix_size;
            this.lastPat = 0;
            this.nextPat = ((this.x / p.width) + (this.y / p.height)) * 12;
            this.pat = this.nextPat;
            this.neighbor = [];
        }

        getnextPat(p) {
            let total = 0;
            for (let i = 0; i < this.neighbor.length; i++) {
                total += this.neighbor[i].pat;
            }
            let average = p.int(total / 8);
            let d = p.dist(p.mouseX, p.mouseY, this.x + pix_size / 2, this.y + pix_size / 2);
            if (d < 20) {
                // Color change value
                this.nextPat = 250; 
            } else if (average === 0) {
                this.nextPat = 150;
            } else {
                this.nextPat = this.pat + average;
                if (this.lastPat > 0) {
                    this.nextPat -= this.lastPat;
                }
                if (this.nextPat > 255) {
                    this.nextPat = 100;
                } else if (this.nextPat < 0) {
                    this.nextPat = 0;
                }
            }
            this.lastPat = this.pat;
        }

        draw_pix(p) {
            p.noStroke();
            this.pat = this.nextPat;
            p.fill(233,250,230, this.pat);
            p.rect(this.x, this.y, pix_size * 1.75, pix_size * 1.75);
        }
    }

    setupSketch("page");

    function removeSketch() {
        if (p5Instance) {
            p5Instance.remove();
        }
    }
});


class FadingText {
    constructor(text) {
      this.text = text;
      this.x = random(width);
      this.y = random(height);
      this.alpha = random(50, 150);
      this.size = random(16, 32);
      this.fadeSpeed = random(0.5, 2);
      this.lifetime = random(50, 200); 
    }
    
    display() {
      fill(0, this.alpha); 
      textSize(this.size);
      text(this.text, this.x, this.y);
    }
    
    update() {
      this.alpha -= this.fadeSpeed;
      if (this.alpha < 0) {
        this.alpha = random(50, 150); 
        this.x = random(width); 
        this.y = random(height);
        this.text = random(streams.substring(0, 100)) + " " + random(thoughts); 
        this.size = random(16, 32); 
      }
    }
  }