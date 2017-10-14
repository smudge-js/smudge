import { PBR, Material, BlendMode } from '../../pbr';
import { mat4 } from 'gl-matrix';
// import * as voronoi from 'voronoi-diagram';

let pbr:PBR;
let pScale = 1; //512 is 1
export async function draw() {
     pbr = new PBR(undefined, 512*pScale, 512*pScale);

    let baseMat = new Material();
    let baesCol = hexToRGB('#444444');
    baseMat.red = baesCol.r;
    baseMat.green = baesCol.g;
    baseMat.blue = baesCol.b;
    baseMat.transparency = 1;
    baseMat.height = .5;
    baseMat.metallic = .1;
    baseMat.smoothness = .2;
    pbr.rect(0, 0, pbr.width,pbr.height, baseMat);

    let filledMat = new Material();
    // let fillCol = hexToRGB('#FFFFFF');
    // filledMat.red = fillCol.r;
    // filledMat.green = fillCol.g;
    // filledMat.blue = fillCol.b;
    filledMat.red = undefined;
    filledMat.green = undefined;
    filledMat.blue = undefined;

    filledMat.transparency = 1;
    filledMat.height = 1;
    filledMat.metallic = undefined;
    filledMat.smoothness = undefined;

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

    //draw the grid
    let gridCols = 100;
    let gridRows = 100;
    let gridSizeX = pbr.height / gridCols;
    let gridSizeY = pbr.width / gridRows;

    //build the cells
    let fillRate=.8;
    let cells:number[][] = [];
    for(let c=0; c < gridCols; c++){
        let row:number[] = [];
        for(let r=0; r <= gridRows; r++){
            // let row:number[] = [];
            let val = Math.random();
            // if(val > .8) val =1;
            // if(val < .2) val = 0;
            row.push(val);
            // if(Math.random()>fillRate){
            //     row.push(1);
            // }else{
            //     row.push(0);
            // }
        }
        cells.push(row);
    }
    cells = smoothCells(cells);
    // console.log(cells);
    //draw cells
    for(let c=0; c<gridCols; c++){
        for(let r=0; r <=gridRows; r++){
            // console.log(cells[c][r]);
            // if(cells[c][r] == 1){
            // filledMat.transparency=cells[c][r];
            if(cells[c][r]>fillRate){
                filledMat.transparency=1;
            }else{
                filledMat.transparency=cells[c][r];
            }
            pbr.rect(gridSizeX*c, gridSizeY*r, gridSizeX, gridSizeY, filledMat);

            // }
        }
    }

    pbr.show();
}
function smoothCells(_cells:number[][]){
    let sCells:number[][] = [];
    for(let c=0; c<_cells.length; c++){
        let row:number[] = [];
        for(let r=0; r <=_cells[c].length; r++){
            let val = _cells[c][r];
            if(c==0 || r==0 || c == _cells.length-1 || r == _cells[c].length-1){
                row.push(val);
                continue;

            }
            //check all the cells around this cell
            let directNeighbors = 0;
            //direct
            directNeighbors += _cells[c-1][r]; //left
            directNeighbors += _cells[c+1][r]; //right
            directNeighbors += _cells[c][r-1]; //top
            directNeighbors += _cells[c][r+1]; //bottom
            //diagonal
            let diagNeighbors = 0;
            diagNeighbors += _cells[c-1][r-1];
            diagNeighbors += _cells[c+1][r-1];
            diagNeighbors += _cells[c-1][r+1];
            diagNeighbors += _cells[c+1][r+1];
            val = (directNeighbors*.5 + diagNeighbors *.2)*.5;
            // if(directNeighbors<2){
            //     val=0;
            // }
            // if(diagNeighbors>3){
            //     val*=1.2;
            // }

            row.push(val);
        }
        sCells.push(row);
    }
    return sCells;
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
