import PBR from '../pbr1';
import {Material} from '../pbr1';

export default function draw(pbr: PBR) {
    const clear = new Material(0.5, 0.6, 0.5, 1.0, 0.0, 0.3, 0.0);
    pbr.rect(0, 0, 512, 512, clear);

    const paint1 = new Material(.8, .9, .9, .3, 0.2, 0.99, 0.1);
    const paint2 = new Material(.8, .9, .9, .3, 0.2, 0.99, 0.2);


    let a = 0;
    let d = 1;
    let x = 256;
    let y = 256;

    for (let p = 0; p < 10; p++) {
        x = random(0, 512);
        y = random(0, 512);
        paint1.red *= .9;
        paint1.green *= .9;
        paint1.blue *= .9;
        paint2.red *= .9;
        paint2.green *= .9;
        paint2.blue *= .9;
        paint1.height += .01;
        paint2.height += .01;


        for (let i = 0; i < 10000; i++) {
            x += Math.sin(a) * d;
            y += Math.cos(a) * d;
            if (x > 512) x -= 512;
            if (y > 512) y -= 512;
            if (y < 0) y += 512;
            if (x < 0) x += 512;
            a += random(-.5, .5);
            pbr.rect(x - 1, y - 1, 4, 4, paint1);
            pbr.rect(x, y, 2, 2, paint2);
        }
    }

}

function random(min = 0, max = 1): number {
    return Math.random() * (max - min) + min;
}
