import PBR from '../pbr2';
import { Material } from '../pbr2';

export default function draw() {

    let pbr = new PBR(undefined, 1024, 1024, 1);

    const clear_mat = new Material(0.6, 0.6, 0.7, 1.0, 0.0, 0.4, 0.0);
    pbr.clear(clear_mat);

    const paint = new Material(1.0, 1.0, 0.9, 1.0);
    paint.metallic = .2;
    paint.smoothness = .7;
    paint.height = .002;
    paint.height_blending = Material.AdditiveBlending;

    for (let line = 0; line < 10; line++) {
        let x = pbr.width * .5;
        let y = pbr.height * .5;
        let a = Math.random(0, 6.28);
        let deltaA = 0;

        for (let i = 0; i < 5000; i++) {
            x += Math.sin(a) * 1;
            y += Math.cos(a) * 1;
            a += deltaA;
            deltaA += random(-.002, .002);

            pbr.rect(x, y, 10, 10, paint);
            pbr.rect(x+1, y+1, 8, 8, paint);
            pbr.rect(x+2, y+2, 6, 6, paint);
        }
    }

    pbr.show();
}

function random(min = 0, max = 1) {
    return Math.random() * (max - min) + min;
}



function randomMiddle(min, max) {
    let r = Math.random() + Math.random() + Math.random();
    r /= 3;
    return min + r * (max - min);
}