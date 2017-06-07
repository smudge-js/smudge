
import PBR from './js/pbr1';
import {Material} from './js/pbr1';
let pbr = new PBR();

draw();

function draw() {
    sketch_dullRedShinyGreen();
    pbr.show();
}

function sketch_testPattern() {
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

    pbr.rect(0, 0, 512, 512, clear);

    pbr.rect(10, 10, 10, 10, red);
    pbr.rect(10, 30, 30, 10, green);
    pbr.rect(10, 50, 30, 30, blue);
    pbr.rect(1, 1, 1, 1);
    pbr.rect(1, 3, 510, 1);
}

function sketch_dullRedShinyGreen() {
    const clear = new Material(.5, .5, .5, 1.0, 0.0, 0.0, .5);
    const red = new Material(1.0, 0.0, 0.0, .01, 0.0, 0.0, 0.0);
    const green = new Material(0.0, 1.0, 0.0, .01, 0.0, 1.0, 1.0);

    pbr.rect(0, 0, 512, 512, clear);

    for (let i = 0; i < 100; i++) {
        let x = random(10, 502);
        let y = random(10, 502);
        pbr.rect(x - 5, y - 5, 30, 30, red);
    }

    for (let i = 0; i < 100; i++) {
        let x = random(10, 502);
        let y = random(10, 502);
        pbr.rect(x - 5, y - 5, 30, 30, green);
    }
}

function random(min = 0, max = 1): number {
    return Math.random() * (max - min) + min;
}

let show_albedo_button = document.querySelector("#show_albedo");
show_albedo_button.addEventListener("click", () => pbr.show_albedo());
let download_albedo_button = document.querySelector("#download_albedo") as HTMLAnchorElement;
download_albedo_button.addEventListener("click", () => {
    download_albedo_button.href = pbr.get_albedo();
});

let show_metallic_button = document.querySelector("#show_metallic");
show_metallic_button.addEventListener("click", () => pbr.show_metallic());
let download_metallic_button = document.querySelector("#download_metallic") as HTMLAnchorElement;
download_metallic_button.addEventListener("click", () => {
    download_metallic_button.href = pbr.get_metallic();
});


let show_height_button = document.querySelector("#show_height");
show_height_button.addEventListener("click", () => pbr.show_height());
let download_height_button = document.querySelector("#download_height") as HTMLAnchorElement;
download_height_button.addEventListener("click", () => {
    download_height_button.href = pbr.get_height();
});
