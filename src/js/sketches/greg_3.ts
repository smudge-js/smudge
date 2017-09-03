import { PBR, Material, BlendMode } from '../pbr';
import { mat4 } from 'gl-matrix';

let pbr:PBR;
let pScale = 4; //512 is 1
export async function draw() {
     pbr = new PBR(undefined, 512*pScale, 512*pScale);



    //cross stich

    let baseMat = new Material();
    baseMat.red = 196/255;
    baseMat.green = 190/255;
    baseMat.blue = 170/255;
    baseMat.transparency = 1;
    baseMat.height = .95;
    baseMat.metallic = .35;
    baseMat.smoothness = .8;

    pbr.rect(0, 0, pbr.width,pbr.height, baseMat);

    //make a bunch of scratches
    for(let r=0; r<5; r++){
        let startX = rRange(pbr.width*.1, pbr.width*.9);
        let startY = rRange(pbr.height*.1, pbr.height*.9);
        for(let i=0; i<6; i++){
            drawScrapeRiver(startX, startY, (Math.random()*2)-1 , (Math.random()*2)-1, 30*pScale, 5*pScale, .4, 3 + Math.random()*9 *pScale);

            await resolveQuickly();
        }
        
    }
    pbr.show();
}



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

function rRange(_min:number, _max:number){
    return _min + (Math.random()*(_max-_min));
}

function resolveQuickly() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 1);
    });
}