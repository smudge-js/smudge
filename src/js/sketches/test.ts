import PBR from '../pbr1';
import {Material} from '../pbr1';

export default function draw(pbr: PBR) {

    const red = new Material(1.0, 0.0, 0.0, 1.0);
    red.height = 1.0;
    red.metallic = 1.0;
    red.smoothness = 1.0;

    pbr.clear();
    // pbr.clear(red);
    pbr.rect(10, 10, 10, 10, red);
}
