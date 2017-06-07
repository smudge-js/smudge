
import PBR from './js/pbr1';

let pbr = new PBR();

draw();

function draw() {
    const red = [1.0, 0.0, 0.0, 1.0];
    const green = [0.0, 1.0, 0.0, 1.0];
    const blue = [0.0, 0.0, 1.0, 1.0];

    pbr.rect(10, 10, 10, 10, red, .25);
    pbr.rect(10, 30, 30, 10, green, .5);
    pbr.rect(10, 50, 30, 30, blue, .75);
    pbr.rect(1, 1, 1, 1);
    pbr.rect(1, 3, 510, 1);

    pbr.show();
}


let show_albedo_button = document.querySelector("#show_albedo");
show_albedo_button.addEventListener("click", () => pbr.show_albedo());

let show_height_button = document.querySelector("#show_height");
show_height_button.addEventListener("click", () => pbr.show_height());
