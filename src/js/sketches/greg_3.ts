import { PBR, Material, BlendMode } from '../pbr';
import { mat4 } from 'gl-matrix';
import * as voronoi from 'voronoi-diagram';

let pbr:PBR;
let pScale = 1; //512 is 1
export async function draw() {
     pbr = new PBR(undefined, 512*pScale, 512*pScale);

    //Tree Bark
    let baseMat = new Material();
    let baesCol = hexToRGB('#9e9c85');
    baseMat.red = baesCol.r;
    baseMat.green = baesCol.g;
    baseMat.blue = baesCol.b;
    baseMat.transparency = 1;
    baseMat.height = .25;
    baseMat.metallic = .1;
    baseMat.smoothness = .2;

    pbr.rect(0, 0, pbr.width,pbr.height, baseMat);

    let barkTemplateMat = new Material();
    let barkCol = hexToRGB('#000000');
    barkTemplateMat.red = barkCol.r;
    barkTemplateMat.green = barkCol.g;
    barkTemplateMat.blue = barkCol.b;
    barkTemplateMat.emission_red = undefined;
    barkTemplateMat.emission_green = undefined;
    barkTemplateMat.emission_blue = undefined;

    barkTemplateMat.transparency = .85;
    barkTemplateMat.metallic = undefined;
    barkTemplateMat.smoothness = undefined;
    barkTemplateMat.height = .5;


    let points:number[][] = [
        [0,0],[0,1],[1,1],[1,0]
    ];
    for(let i=0; i<30; i++){
        let x = rRange(.05, .95);
        let y = rRange(.05, .95);
        points.push([x, y]);
        pbr.ellipse(x*pbr.width, y*pbr.height, 10, 10, Material.white);
    }

    let v = voronoi(points);
    console.log(v.positions);
    for(let i=0; i<v.cells.length; ++i){
        let linePoints:number[][] = [];
        let cell:number[] = v.cells[i];
        console.log(cell);
        if(cell.indexOf(-1) >=0 ){
            console.log("found infinity");
            //ignore cells on the edge
            continue;
        };
        linePoints.push([v.positions[cell[0]][0] * pbr.width, v.positions[cell[0]][1] * pbr.height]);
        for(var j=1; j<cell.length; ++j){

            let x = v.positions[cell[j]][0];
            let y = v.positions[cell[j]][1];

            linePoints.push([x * pbr.width, y * pbr.height]);
        }
        let col:string = miscColors[Math.floor(rRange(0, miscColors.length))];
        barkTemplateMat.red = hexToRGB(col).r;
        barkTemplateMat.green = hexToRGB(col).g;
        barkTemplateMat.blue = hexToRGB(col).b;

        //draw the cell border
        pbr.line(linePoints,
            {width: 10,
            align: 'right',
            close: true},
            barkTemplateMat);

        pbr.ellipse(points[i][0]*pbr.width, points[i][1]*pbr.height, 5, 5, Material.white);
        //draw lines in to center
        // for(let n=0; n<linePoints.length; n++){
        //     let centerLine:number[][] = [linePoints[n]];
        //     centerLine.push( [points[i][0]*pbr.width, points[i][1]*pbr.height] );
        //     pbr.line(centerLine,
        //         {width: 6,
        //         align: 'center',
        //         close: true},
        //         barkTemplateMat);
        // }

        
    }
/*
    for(let i=0; i<20; i++){
        let lines = getRiverLines(rRange(0, pbr.width), -20, rRange(-.05, .05) , 1, 50*pScale, 30*pScale, .1, .2);
        console.log("lines length" + lines.length);
        let strokeW = rRange(40, 80)*pScale

        let tempBark = new Material(barkTemplateMat);

        let col:string = miscColors[Math.floor(rRange(0, miscColors.length))];
        barkTemplateMat.red = hexToRGB(col).r;
        barkTemplateMat.green = hexToRGB(col).g;
        barkTemplateMat.blue = hexToRGB(col).b;
        barkTemplateMat.height = rRange(.2, .4);

        //draw out each line
        for(let j=0; j<lines.length; j++){
            pbr.line(lines[j], strokeW, barkTemplateMat);
        }
        pbr.show();
        await resolveQuickly();
    }
    for(let i=0; i<100; i++){
        let lines = getRiverLines(rRange(0, pbr.width), pbr.height, rRange(-.01, .01) , -1, 50*pScale, 30*pScale, .1, .1);
        console.log("lines length" + lines.length);
        let strokeW = rRange(3, 15)*pScale

        let tempBark = new Material(barkTemplateMat);
        barkTemplateMat.transparency=rRange(.3, .4);
        barkTemplateMat.height_blend_mode=BlendMode.Additive;
        let col:string = miscColors[Math.floor(rRange(0, miscColors.length))];
        barkTemplateMat.red = hexToRGB(col).r;
        barkTemplateMat.green = hexToRGB(col).g;
        barkTemplateMat.blue = hexToRGB(col).b;
        barkTemplateMat.height = .1; //rRange(.2, .4);

        //draw out each line
        for(let j=0; j<lines.length; j++){
            pbr.line(lines[j], strokeW, barkTemplateMat);
        }
        pbr.show();
        await resolveQuickly();
    }

    for(let i=0; i<150; i++){
        let lines = getRiverLines(rRange(0, pbr.width), pbr.height, rRange(-.01, .01) , -1, 50*pScale, 30*pScale, .1, .1);
        console.log("lines length" + lines.length);
        let strokeW = rRange(1, 8)*pScale

        let tempBark = new Material(barkTemplateMat);
        barkTemplateMat.transparency=rRange(.5, .7);
        barkTemplateMat.height_blend_mode=BlendMode.Additive;
        let col:string = miscColors[Math.floor(rRange(0, miscColors.length))];
        barkTemplateMat.red = hexToRGB(col).r;
        barkTemplateMat.green = hexToRGB(col).g;
        barkTemplateMat.blue = hexToRGB(col).b;
        barkTemplateMat.height = 0; //rRange(.2, .4);

        //draw out each line
        for(let j=0; j<lines.length; j++){
            pbr.line(lines[j], strokeW, barkTemplateMat);
        }
        pbr.show();
        await resolveQuickly();
    }
*/

    pbr.show();
}
function drawBark(){



    //draw some narrower ones with some green
}
let barkColors:string[] = [
    '#b2c0a7','#4b5030', '#888773', '#9f9387'
];
let mossColors:string[] = [
    '#c3cdc4', '#d6d23d', '#567527', '#709625'
];
let miscColors:string[] = [
    '#650000', '#610167', '#c300b1', '#c1a500', '#ff0000', '#7c2b00', '#85796b', '#8b9563', '#ff8a00', '#355a6c', '#f20866',
    '#f9d851', '#89f279', '#79e5ee', '#c073c1'
];
function getRiverLines(startX:number, startY:number, dirX:number, dirY:number, maxLength:number, pointCount:number, branching=0, meander=.5){

    let x = startX;
    let y = startY;
    let lines:number[][][] = [];
    let points:number[][] = [[x,y]];


    let angle = Math.atan2(dirY, dirX);
    for(let p=0; p<pointCount; p++){
        let l = rRange(maxLength*.2, maxLength);
        x = x + l * Math.cos(angle);
        y = y + l * Math.sin(angle);
        points.push([x,y]);
        angle+= rRange(-meander,meander);
        if(Math.random()<branching){
            //add a branch
            let branchAngle = angle+((Math.random()*meander)-(meander*.5));
            let branchLines = getRiverLines(x, y, rRange(-1,1), rRange(-1,1), maxLength*.5,  10, rRange(0, branching*.5), meander);
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


/*
function drawScrapeRiver(startX:number, startY:number, dirX:number, dirY:number, maxLength:number, pointCount:number, branching=0, scratchWidth=1){
    let scraperMat = new Material();
    // scraperMat.red = 204/255;
    // scraperMat.green = 199/255;
    // scraperMat.blue = 185/255;
    scraperMat.red = undefined;
    scraperMat.green = undefined;
    scraperMat.blue = undefined;
    scraperMat.emission_red = undefined;
    scraperMat.emission_green = undefined;
    scraperMat.emission_blue = undefined;

    scraperMat.transparency = .15;
    scraperMat.metallic = undefined;
    scraperMat.smoothness = .2;
    scraperMat.height = .2;
    scraperMat.height_blend_mode = BlendMode.Normal;
    scraperMat.albedo_blend_mode = BlendMode.Multiply;

    let glowingScrapeMat = new Material(scraperMat);
    glowingScrapeMat.red = undefined;
    glowingScrapeMat.green = undefined;
    glowingScrapeMat.blue = undefined;
    glowingScrapeMat.transparency = 1;
    glowingScrapeMat.height = .1;
    glowingScrapeMat.emission_red = 255/255;
    glowingScrapeMat.emission_green = 94/255;
    glowingScrapeMat.emission_blue = 158/255;

    let meander = .8;
    // let branching = .4;

    //make a path
    
    // points.push([startX,startY]);
    //create a random line
    let x = startX;
    let y = startY;

    let points:number[][] = [[x,y]];
    let angle = Math.atan2(dirY, dirX);
    for(let p=0; p<pointCount; p++){
        let l = rRange(maxLength*.2, maxLength);
        x = x + l * Math.cos(angle);
        y = y + l * Math.sin(angle);
        points.push([x,y]);
        angle+= rRange(-meander,meander);
        if(Math.random()<branching){
            //add a branch
            let branchAngle = angle+((Math.random()*meander)-(meander*.5));
            drawScrapeRiver(x, y, rRange(-1,1), rRange(-1,1), maxLength*.5,  10, rRange(0, branching*.5), scratchWidth*.7);
        }
    }
    // console.log(angle);

    //randomize the points a bit and draw a thick scrape
    // let offsetPoints:number[][] = [];
    // let range = 4 * pScale;
    // for(let i = 0; i<points.length; i++){
    //     offsetPoints.push([points[i][0] + rRange(0,range), points[i][1]+ rRange(0,range)])
    // }
    // pbr.line(offsetPoints, scratchWidth, scraperMat);

    pbr.line(points, scratchWidth, scraperMat);
    
    // scratchWidth= 3 + Math.random()*9;
    pbr.line(points, scratchWidth*.9, scraperMat);
    pbr.line(points, scratchWidth*.8, scraperMat);
    pbr.line(points, scratchWidth*.7, scraperMat);

    let end = points[points.length-1];
    let centerX = end[0];
    let centerY = end[1];
    let s=2;
    for(let n=1; n<6; n++){
        s*=.9;
        pbr.ellipse(centerX-scratchWidth*s, centerY-scratchWidth*s, scratchWidth*(s*2), scratchWidth*(s*2), scraperMat);
    }
    
    

    pbr.line(points, scratchWidth*.6, glowingScrapeMat);
    pbr.ellipse(centerX-(scratchWidth*.7), centerY-(scratchWidth*.7), scratchWidth*1.4, scratchWidth*1.4, glowingScrapeMat);
    //scrape the path witha  thick line that's a little random
    //then a few finer less random scrapes

    //branches

}
*/

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