import { PBR, Material, BlendMode } from '../../pbr';
import { mat4 } from 'gl-matrix';

let pbr:PBR;
export function draw() {
     pbr = new PBR(undefined, 2048, 2048);



    //cross stich

    let clothBase = new Material();
    clothBase.red = 117/255;
    clothBase.green = 69/255;
    clothBase.blue = 35/255;
    clothBase.transparency = 1;
    clothBase.height = .1;
    // clothBase.metallic = 0;
    // clothBase.smoothness = .6;
    // clothBase.height = .3;

    pbr.rect(0, 0, pbr.width,pbr.height, clothBase);

    console.log(clothBase);

    let lightBrownStitch = new Material();
    lightBrownStitch.red = 117/255;
    lightBrownStitch.green = 69/255;
    lightBrownStitch.blue = 35/255;
    lightBrownStitch.transparency = 1;
    lightBrownStitch.metallic = .3;
    lightBrownStitch.smoothness = .2;
    lightBrownStitch.height = .25;
    lightBrownStitch.height_blend_mode = BlendMode.Additive;

    let brownStitch = new Material();
    brownStitch.red = 102/255;
    brownStitch.green = 58/255;
    brownStitch.blue = 27/255;
    brownStitch.transparency = 1;
    brownStitch.metallic = .1;
    brownStitch.smoothness = .2;
    brownStitch.height = .3;
    brownStitch.height_blend_mode = BlendMode.Additive;
    // pbr.line([
    //     [50, 50],
    //     [50, 200]
    // ], 10, lightBrownStitch);

    let cCount= 160;
    let rCount = 160;

    let rand = 8;
    let cSpace = pbr.width/cCount;
    let rSpace = pbr.height/rCount;

    for(let c=0; c<cCount; c++){
        pbr.line([
            [c * cSpace + (Math.random()*rand), 0],
            [c * cSpace + (Math.random()*rand), pbr.height]
        ], 4, lightBrownStitch);
    }

    for(let r=0; r<rCount; r++){
        pbr.line([
            [0, r * rSpace + (Math.random()*rand)],
            [pbr.width, r * rSpace + (Math.random()*rand)]
        ], 4, brownStitch);
    }
    cCount*=2.33;
    cSpace = pbr.width/cCount;
    for(let c=0; c<cCount; c++){
        pbr.line([
            [c * cSpace + (Math.random()*rand), 0],
            [c * cSpace + (Math.random()*rand), pbr.height]
        ], 2, lightBrownStitch);
    }
    rCount*=1.8;
    rSpace = pbr.height/rCount;
    for(let r=0; r<rCount; r++){
        pbr.line([
            [0, r * rSpace + (Math.random()*rand)],
            [pbr.width, r * rSpace + (Math.random()*rand)]
        ], 2, brownStitch);
    }
    //knock everything down a bit
    let yellowTint = new Material();
    yellowTint.red = 255/255;
    yellowTint.green = 203/255;
    yellowTint.blue = 63/255;
    yellowTint.height = undefined;
    yellowTint.transparency = .2;
    pbr.rect(0, 0, pbr.width,pbr.height, yellowTint);

    let buttonCount = 200;

    let buttons=[];
    for(let b=0; b<buttonCount; b++){
        let randS = 60; //40+ Math.random()*20;

        let randX = randS + Math.random()*(pbr.width-randS*2);
        let randY = randS + Math.random()*(pbr.height-randS*2);

        buttons.push({x:randX, y:randY, s:randS});
    }
    for(let b=0; b<buttons.length; b++){
        //do all the indents
        makeButtonIndent(buttons[b].x, buttons[b].y, buttons[b].s, buttons[b].s);
    }
    for(let b=0; b<buttons.length; b++){
        //do all the buttons
        makeButton(buttons[b].x, buttons[b].y, buttons[b].s, buttons[b].s);
    }
    //makeButtonIndent
    //makeButton(randX, randY, randS, randS);

    /*
    let redPaint = new Material();
    redPaint.red = 1;
    redPaint.green = .2;
    redPaint.blue = 0;
    redPaint.transparency = 1;
    redPaint.metallic = .5;
    redPaint.smoothness = .5;

    let greenPaint = new Material(0, 1, 0, 1);

    pbr.rect(10, 10, 100, 100, redPaint);

    pbr.quad([
        [10, 210],
        [10, 300],
        [150, 350],
        [100, 210],
    ], redPaint);

    let m = mat4.create();
    mat4.translate(m, m, [55, 55, 0]);
    mat4.rotateZ(m, m, 3.1415 * .25);
    mat4.translate(m, m, [-55, -55, 0]);

    pbr.line([
        [10, 10],
        [110, 10],
        [110, 110],
        [10, 110]

    ], 10, greenPaint, m);
*/
    pbr.show();
}

function makeButtonIndent(centerX:number, centerY:number, w:number, h:number){
    let indentHeightMat = new Material();
    indentHeightMat.red = undefined;
    indentHeightMat.green = undefined;
    indentHeightMat.blue = undefined;
    indentHeightMat.metallic = undefined;
    indentHeightMat.smoothness = undefined;
    indentHeightMat.transparency = .3;
    indentHeightMat.height = .1;

    let size = w*3;

    for(let i=0; i<5; i++){
        let offsetX = centerX - (size*.5);
        let offsetY = centerY - (size*.5);
        pbr.ellipse(offsetX, offsetY, size, size, indentHeightMat);
        size*=.75;
    }
    // let size=w*2;
    // let offsetX = centerX - (size*.5);
    // let offsetY = centerY - (size*.5);
    // pbr.ellipse(offsetX, offsetY, size, size, indentHeightMat);
    // size=w*1.5;
    // offsetX = centerX - (size*.5);
    // offsetY = centerY - (size*.5);
    // pbr.ellipse(offsetX, offsetY, size, size, indentHeightMat);

}

function makeButton(centerX:number, centerY:number, w:number, h:number){
    let buttonMat = new Material();
    buttonMat.red = 210/255;
    buttonMat.green = 215/255;
    buttonMat.blue = 210/255;
    buttonMat.transparency = 1;
    buttonMat.metallic = .6;
    buttonMat.smoothness = .8;
    buttonMat.height = .9;
    //first depress all the area around the button with ellipses
    // pbr.ellipse(centerX, centerY, w, h, buttonMat);
    //then put the button in
    let size = w;
    let offsetX = centerX - (size*.5);
    let offsetY = centerY - (size*.5);
    pbr.ellipse(offsetX, offsetY, size, size, buttonMat);
    size*=.85;
}
