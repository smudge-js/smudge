import PBR from '../pbr1';
import {Material} from '../pbr1';

export default function draw(pbr: PBR) {
    const clear = new Material(0.5, 0.6, 0.5, 1.0, 0.0, 0.3, 0.0);
    pbr.rect(0, 0, 1024, 1024, clear);


    // new Material(red, green, blue, transparency, metallic, smoothness, height, emission_red, emission_green, emission_blue)
    const paint1 = new Material(.8, .9, .9, .3, 0.2, 0.99, 0.1);
    // const paint2 = new Material(.8, .9, .9, .3, 0.2, 0.99, 0.5);


    let a = 0;
    let d = 1;
    let x = 256;
    let y = 256;

    for (let p = 0; p < 20; p++) {
        x = random(0, 1024);
        y = random(0, 1024);
        paint1.red *= .9;
        paint1.green *= .9;
        paint1.blue *= .9;
        // paint2.red *= .9;
        // paint2.green *= .9;
        // paint2.blue *= .9;
        paint1.height += .01;
        // paint2.height += .01;

    

        for (let i = 0; i < 10000; i++) {
            x += Math.sin(a) * d;
            y += Math.cos(a) * d;
            if (x > 1024) x -= 1024;
            if (y > 1024) y -= 1024;
            if (y < 0) y += 1024;
            if (x < 0) x += 1024;
            a += random(-.5, .5);
            pbr.rect(x - 2, y - 2, 8, 8, paint1);
            // pbr.rect(x, y, 4, 4, paint2);
        }
    }

}

function random(min = 0, max = 1): number {
    return Math.random() * (max - min) + min;
}
