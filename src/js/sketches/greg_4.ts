import { PBR, Material, BlendMode } from '../pbr';
import { mat4 } from 'gl-matrix';
import * as voronoi from 'voronoi-diagram';

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
    

    let scalesMat = new Material();
    
    scalesMat.red = undefined;
    scalesMat.green = undefined;
    scalesMat.blue = undefined;
    scalesMat.height = .5;
    scalesMat.transparency = 1;
    scalesMat.metallic = undefined;
    scalesMat.smoothness = undefined;
    scalesMat.emission_red = 0;
    scalesMat.emission_green = 0;
    scalesMat.emission_blue = 0;

    let scalesEdgeMat = new Material(scalesMat);

    let scaleConnectorLight = new Material(scalesMat);
    col = hexToRGB('#25dced');
    // scaleConnectorLight.red = col.r;
    // scaleConnectorLight.green = col.g;
    // scaleConnectorLight.blue = col.b;
    scaleConnectorLight.emission_red = col.r;
    scaleConnectorLight.emission_green = col.g;
    scaleConnectorLight.emission_blue = col.b;
    scaleConnectorLight.height = .3;
        
    let lCount:number = 14;
    //run 2 passes
    for(let n=0; n<4; n++){
        let vLinePoints:number[][] = [];
        //store ot her for multiple passes
        // let heightList:number[]=[];
        for(let i=0; i<lCount; i++){
            vLinePoints =  getRiverLines((i/lCount) * (pbr.width+30*pScale), 0, 0, 1, [15*pScale, 15*pScale], 50, 0, .1)[0];
            // let vLinePoints:number[][] =  getRiverLines(i/lCount, 0, 0, 1, 80*pScale, 12, 0, .4)[0];
            for(let p=vLinePoints.length-1; p>1; p--){
                //get the angle to the next point
                let dX = vLinePoints[p][0] - vLinePoints[p-1][0];
                let dY = vLinePoints[p][1] - vLinePoints[p-1][1];
                let direction = Math.atan2(dY, dX);

                let vpoints:number[][] = getV(vLinePoints[p], 40*pScale, degToRad(60), direction+Math.PI);
                console.log(vpoints);
                let h = rRange(.3, .8);
                //store the random height for next pass
                // heightList.push(h);

                scalesMat.height = h;
                pbr.line(vpoints,
                    {width: 10*pScale,
                    align: 'left',
                    close: false},
                    scalesMat);

                let size = 15*pScale;
                scalesMat.height = h*1.07;
                pbr.ellipse(vLinePoints[p][0]-size*.5, vLinePoints[p][1]-size*.5, size, size, scalesMat);

                size = 5*pScale;
                pbr.ellipse(vLinePoints[p][0]-size*.5, vLinePoints[p][1]-size*.5, size, size, scaleConnectorLight);
            }
            //do another pass of jus the circles
            // for(let p=vLinePoints.length-1; p>1; p--){
            //     let size = 20*pScale;
            //     // scalesMat.height = heightList[p];
            //     pbr.ellipse(vLinePoints[p][0]-size*.5, vLinePoints[p][1]-size*.5, size, size, scalesMat);
            // }
        }
        
        
        
        lCount*=.33;
    }

    pbr.show();
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


function resolveQuickly() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 1);
    });
}