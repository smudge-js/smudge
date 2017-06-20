// import {PBR} from '../pbr2';
// import {Material, BlendMode} from '../material';

import { PBR, Material, BlendMode } from '../pbr';


export function draw() {

    let pbr = new PBR(undefined, 1024, 1024);

    const clear = new Material(0.5, 0.5, 0.5, 1.0, 0.0, 0.0, 0.0);
    pbr.clear();

    for (let i = 0; i < 100000; i++) {
        let mat = new Material(Math.random(), Math.random(), Math.random(), .5);
        let x = Math.random() * 1024;
        let y = Math.random() * 1024;
        pbr.rect(x, y, 10, 10, mat);

    }




    pbr.show();


}
