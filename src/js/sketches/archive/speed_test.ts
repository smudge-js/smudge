// import {PBR} from '../pbr2';
// import {Material, BlendMode} from '../material';

import { PBR, Material, BlendMode } from '../pbr';

let pbr: PBR;

export function draw() {

    pbr = new PBR(undefined, 512, 512);




    // setInterval(step, 1);


    window.requestAnimationFrame(step);

}

let x = 0;
let y = 0;
let start: Date;
let frames = 0;
function step() {

    const clearingMat = new Material(0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0);
    const red = new Material({
        red: 1
    });

    // console.time("pbr_frame");
    pbr.clear(clearingMat);

    x = ++x % pbr.width;
    // console.log(x);
    // console.time("pbr_rects");
    for (let i = 0; i < 1000; i++) {
        pbr.rect(x, Math.random() * pbr.height, 100, 100);
    }
    // console.timeEnd("pbr_rects");
    // console.time("pbr_show");
    pbr.show();
    // console.timeEnd("pbr_show");
    // console.timeEnd("pbr_frame");

    if (!start) {
        start = new Date();
    }
    const now = new Date();
    const ms = <any>now - <any>start + 1;


    if (frames % 10 === 0) {
        console.log(`fps: ${Math.floor(frames / ms * 1000)}`);
    }


    ++frames;

    if (frames <= 100) {
        window.requestAnimationFrame(step);
    }
}
