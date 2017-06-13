import PBR from '../pbr1';
import {Material} from '../pbr1';




export default function draw(pbr: PBR) {


    const clear = new Material(0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0);

    const red = new Material(1.0, 0.0, 0.0, 1.0);
    red.height = 1.0;
    red.metallic = 1.0;
    red.smoothness = 1.0;

    const green = new Material(0.0, 1.0, 0.0, 1.0);
    green.height = 1.0;
    green.metallic = 0.0;
    green.smoothness = 1.0;

    const blue = new Material(0.0, 0.0, 1.0, 1.0);
    blue.height = 1.0;
    blue.metallic = 1.0;
    blue.smoothness = 0.0;


    pbr.rect(0, 0, pbr.width, pbr.height, clear);


    pbr.rect(10, 10, 10, 10, red);
    pbr.rect(30.25, 10, 10, 10, red);
    pbr.rect(50.5, 10, 10, 10, red);

    pbr.rect(10, 30, 30, 10, green);
    pbr.rect(10, 50, 30, 30, blue);
    pbr.rect(1, 1, 1, 1);
    pbr.rect(1, 3, 510, 1);


    pbr.rect(10, 100, 100, 100);

    pbr.rect(10, 210, 200, 10, red);

    let src_alpha = .01;
    const black_fade = new Material(0.0, 0.0, 0.0, src_alpha);
    let t = 1;
    for (let x = 0; x < 1000; x++) {
        pbr.rect(10, 210, x / 5, 10, black_fade);
        t = 0 * src_alpha + t * (1.0 - src_alpha);
    }
    console.log(t, t < .5 / 255);




}
