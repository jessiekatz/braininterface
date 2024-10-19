document.addEventListener("DOMContentLoaded", function () {
    const pix_size = 10;
    let pix_arr = [];
    let num_col;
    let num_row;
    let p5Instance = null;
    let clicked = false;
    let streams = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>Document</title><link rel="stylesheet" href="styles.css"></head><body><div id="container"><div id="brain"></div></script><script src="scripts.js"></script></body></html> let img;let rectY=[];let rectX=[];function preload(){img=loadImage('assets/images/brain-right.jpg');}function setup(){let brain=document.getElementById("brain");let canvas=createCanvas(brain.offsetWidth,brain.offsetHeight);canvas.parent('brain');frameRate(2);img.resdraw(){background('#e5e5e5');image(img,0,0,width,height);drawMosaic(3,color(50,50,5rad)=>rad*2+2;const numberOfColumns=(rad)0=00>Math011000.ceil(11w10001011000idth/columnWidth(rad))0011001001110;00001010101111100000011101000111111010010101100001110010011010000100111010110000111101101000010101010010000`;
    let thoughts = ["hello", "am i", "a", "red", "to the left", "i can", "see", "no", "be quiet", "sorry?", "what tennis players?"];
    let letters = [];
    let maxLetters = 8;

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

        p.textSize(24);
        p.textFont("VT323")
        p.stroke(0);
        p.textAlign(p.CENTER, p.CENTER);
        p.fill(0);

        for (let i = 0; i < maxLetters; i++) {
            let rand = p.random(0, 1);
            if (rand > 0.5) {
                letters.push(new FadingText(getRandomStreamSubstring(), p));
            } else {
                let randIndex = Math.floor(p.random(thoughts.length)); 
                letters.push(new FadingText(thoughts[randIndex], p));
            }
        }
        
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
        if (!clicked) {
            p.background(255, 242, 245);
        } else {
            p.background(255, 227, 245);
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

            for (let i = 0; i < letters.length; i++) {
                letters[i].display(p);
                letters[i].update(p);
            }
        }
    }

    function onClick() {
        const myButton = document.getElementById('switch');
        myButton.addEventListener('click', function() {
            clicked = true;
        });
    }
    
    window.onload = onClick;
    onClick();

    function getRandomStreamSubstring() {
        let startIdx = Math.floor(Math.random() * streams.length);
        let length = Math.floor(Math.random() * (25 - 5 + 1)) + 5;
        return streams.substring(startIdx, startIdx + length);
    }

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
            let average = Math.floor(total / 8);
            let d = p.dist(p.mouseX, p.mouseY, this.x + pix_size / 2, this.y + pix_size / 2);
            if (d < 20) {
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
            p.fill(233, 250, 230, this.pat);
            p.rect(this.x, this.y, pix_size * 1.75, pix_size * 1.75);
        }
    }

    class FadingText {
        constructor(text, p) {
            this.text = text;
            this.x = p.random(p.width);
            this.y = p.random(p.height);
            this.alpha = 0; 
            this.size = p.random(16, 32);
            this.fadeSpeed = p.random(1, 3);
            this.fadingIn = true; 
        }
    
        display(p) {
            p.fill(0, this.alpha);
            p.textSize(this.size);
            p.text(this.text, this.x, this.y);
        }
    
        update(p) {
            if (this.fadingIn) {
                this.alpha += this.fadeSpeed;
                if (this.alpha >= 150) { 
                    this.fadingIn = false;
                }
            } else {
                this.alpha -= this.fadeSpeed;
                if (this.alpha <= 0) {  
                    this.alpha = 0;
                    this.fadingIn = true;
                    this.x = p.random(p.width);
                    this.y = p.random(p.height);
                    this.text = getRandomStreamSubstring();
                    this.size = p.random(12,16);
                }
            }
        }
    }
    

    setupSketch("page");

    function removeSketch() {
        if (p5Instance) {
            p5Instance.remove();
        }
    }
});
