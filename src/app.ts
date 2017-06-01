
import { PBR } from './js/pbr1';

let pbr = new PBR();
draw();

function draw() {
    console.log("draw");
    
    pbr.rect(10, 10, 10, 10);
    pbr.rect(100, 100, 10, 10);
    pbr.rect(30, 300, 30, 10);
}
