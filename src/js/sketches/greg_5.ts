import { PBR, Material, BlendMode } from '../pbr';
import { mat4 } from 'gl-matrix';
// import * as voronoi from 'voronoi-diagram';

let pbr:PBR;
let pScale = 2; //512 is 1
export async function draw() {
     pbr = new PBR(undefined, 512*pScale, 512*pScale);

    //Tree Bark
    let baseMat = new Material();
    let baesCol = hexToRGB('#f4e73f');
    baseMat.red = baesCol.r;
    baseMat.green = baesCol.g;
    baseMat.blue = baesCol.b;
    baseMat.transparency = 1;
    baseMat.height = .5;
    baseMat.metallic = .3;
    baseMat.smoothness = .4;

    // pbr.rect(0, 0, pbr.width,pbr.height, baseMat);

    let copperMat = new Material();
    let col = hexToRGB('#d9a063');
    copperMat.red = col.r;
    copperMat.green = col.g;
    copperMat.blue = col.b;
    copperMat.transparency = 1;
    copperMat.height = .5;
    copperMat.metallic = .8;
    copperMat.smoothness = .4;

    pbr.rect(0, 0, pbr.width,pbr.height, copperMat);
//fad0c0
    

    let bumpedUp = new Material(copperMat);
    // col = hexToRGB('#000000');
    // bumpedUp.red = col.r;
    // bumpedUp.green = col.g;
    // bumpedUp.blue = col.b;
    bumpedUp.transparency = 1;
    bumpedUp.height = .8;

    let bumpedDown = new Material(copperMat);
    // col = hexToRGB('#FFFFFF');
    // bumpedDown.red = col.r;
    // bumpedDown.green = col.g;
    // bumpedDown.blue = col.b;
    bumpedDown.transparency = 1;
    bumpedDown.height = .2;

    // let scalesMat = new Material();
    
    // scalesMat.red = undefined;
    // scalesMat.green = undefined;
    // scalesMat.blue = undefined;
    // scalesMat.height = .5;
    // scalesMat.transparency = 1;
    // scalesMat.metallic = undefined;
    // scalesMat.smoothness = undefined;
    // scalesMat.emission_red = 0;
    // scalesMat.emission_green = 0;
    // scalesMat.emission_blue = 0;

    // let scalesEdgeMat = new Material(scalesMat);

    // let scaleConnectorLight = new Material(scalesMat);
    // col = hexToRGB('#25dced');
    // // scaleConnectorLight.red = col.r;
    // // scaleConnectorLight.green = col.g;
    // // scaleConnectorLight.blue = col.b;
    // scaleConnectorLight.emission_red = col.r;
    // scaleConnectorLight.emission_green = col.g;
    // scaleConnectorLight.emission_blue = col.b;
    // scaleConnectorLight.height = .3;
        
    let lCount:number = 14;

    //draw the grid
    let gridCols = 8;
    let gridRows = 8;
    let gridSizeX = pbr.height / gridCols;
    let gridSizeY = pbr.width / gridRows;

    
    //draw lattice
    for(let c=0; c<=gridCols; c++){
        let curX = c*gridSizeX;
        let size = 10 * pScale
        for(let r=0; r <=gridRows; r++){
            let offsetX = 0;
            let offsetY = -gridSizeY*.5;;
            if(r%2==0){
                offsetX =  -gridSizeX*.5;
            }
            let curY = r*gridSizeY;
            drawLatticeUp(curX+(gridSizeX*.5) + offsetX, curY+(gridSizeY*.5) + offsetY, gridSizeX, gridSizeY, 20*pScale, bumpedUp);
            drawLatticeUp(curX+(gridSizeX*.5) + offsetX, curY+(gridSizeY*.5) + offsetY, gridSizeX, gridSizeY, 5*pScale, bumpedDown);

            drawLatticeDown(curX+(gridSizeX) + offsetX, curY+(gridSizeY*.5) + offsetY, gridSizeX, gridSizeY, 7.5*pScale, bumpedUp);
        }
    }
    //draw circles
    for(let c=0; c<=gridCols; c++){
        let curX = c*gridSizeX;
        let size = 40 * pScale;
        for(let r=0; r < gridRows; r++){
            let offsetX = 0;
            if(r%2==0){
                offsetX =  -gridSizeX*.5;
            }
            let curY = r*gridSizeY;
            centerEllipse(curX+(gridSizeX*.5) + offsetX, curY+(gridSizeY*.5), size, size, bumpedUp);

            centerEllipse(curX+(gridSizeX*.5) + offsetX, curY+(gridSizeY*.5), size*.5, size*.5, bumpedDown);
        }
    }

    pbr.show();
}
function drawLatticeDown(x:number,y:number,gridX:number, gridY:number, width:number, mat:Material){
    //draw 3 lines
    let line1:number[][]=[];
    let line2:number[][]=[];
    let line3:number[][]=[];

    //vertical down
    line1.push([x,y]);
    line1.push([x,y-gridY*.5]);
    pbr.line(line1,
        {width: width,
        align: 'center',
        close: false},
        mat);

    //diagonal left up
    line2.push([x,y]);
    line2.push([x-gridX*.5,y+gridY*.5]);
    pbr.line(line2,
        {width: width,
        align: 'center',
        close: false},
        mat);

    //diagonal right up
    line3.push([x,y]);
    line3.push([x+gridX*.5,y+gridY*.5]);
    pbr.line(line3,
        {width: width,
        align: 'center',
        close: false},
        mat);
}
function drawLatticeUp(x:number,y:number,gridX:number, gridY:number, width:number, mat:Material){
    //draw 3 lines
    let line1:number[][]=[];
    let line2:number[][]=[];
    let line3:number[][]=[];

    //vertical up
    line1.push([x,y]);
    line1.push([x,y+gridY*.5]);
    pbr.line(line1,
        {width: width,
        align: 'center',
        close: false},
        mat);

    //diagonal left down
    line2.push([x,y]);
    line2.push([x-gridX*.5,y-gridY*.5]);
    pbr.line(line2,
        {width: width,
        align: 'center',
        close: false},
        mat);

    //diagonal right down
    line3.push([x,y]);
    line3.push([x+gridX*.5,y-gridY*.5]);
    pbr.line(line3,
        {width: width,
        align: 'center',
        close: false},
        mat);
}

function getV(center:number[], length:number, angle:number, directionAngle:number ){ //angles in radians
    //based on the angle, length and the direction calulate the 2 ends
    let points:number[][] = [];
    let x = center[0];
    let y = center[1];

    let x1 = x + length * Math.cos(-angle+directionAngle);
    let y1 = y + length * Math.sin(-angle +directionAngle);
    points.push([x1,y1]);

    points.push(center);

    x1 = x + length * Math.cos(angle+directionAngle);
    y1 = y + length * Math.sin(angle+directionAngle);
    points.push([x1,y1]);

    return points;
}

let dotColors:string[] = [
    '#ffbe28', '#dda011', '#efa510', '#f9be27', '#ffc942', '#ffd641',
    '#ffb641', '#ffac41', '#ffc67f'
];

function getRiverLines(startX:number, startY:number, dirX:number, dirY:number, lengthRange:number[], pointCount:number, branching=0, meander=.5){

    let x = startX;
    let y = startY;
    let lines:number[][][] = [];
    let points:number[][] = [[x,y]];


    let angle = Math.atan2(dirY, dirX);
    for(let p=0; p<pointCount; p++){
        let l = rRange(lengthRange[0], lengthRange[1]);
        x = x + l * Math.cos(angle);
        y = y + l * Math.sin(angle);
        points.push([x,y]);
        angle+= rRange(-meander,meander);
        if(Math.random()<branching){
            //add a branch
            let branchAngle = angle+((Math.random()*meander)-(meander*.5));
            let branchLines = getRiverLines(x, y, rRange(-1,1), rRange(-1,1), lengthRange,  10, rRange(0, branching*.5), meander);
            for(let b=0; b<branchLines.length; b++){
                //add each branch into the line list
                lines.push(branchLines[b]);
            }
        }
    }
    lines.push(points);
    //return all the lines trunk and branches
    return lines;
}

function degToRad(_deg:number){
    return _deg * (Math.PI / 180);
}
//utils
function rRange(_min:number, _max:number){
    return _min + (Math.random()*(_max-_min));
}
 function hexToRGB(hex:string, bit8=false){
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if(bit8){
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    return result ? {
        r: parseInt(result[1], 16)/255,
        g: parseInt(result[2], 16)/255,
        b: parseInt(result[3], 16)/255
    } : null;
 }

function centerEllipse(x:number, y:number, sizeX:number, sizeY:number, mat:Material){
    pbr.ellipse(x-(sizeX*.5), y-(sizeY*.5), sizeX, sizeY, mat);
}

function resolveQuickly() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 1);
    });
}