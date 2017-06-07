
import PBR from './js/pbr1';

let pbr = new PBR();

draw();

function draw() {
    sketch_dullRedShinyGreen();
    pbr.show();
}

function sketch_testPattern() {
    const red = [1.0, 0.0, 0.0, 1.0];
    const green = [0.0, 1.0, 0.0, 1.0];
    const blue = [0.0, 0.0, 1.0, 1.0];

    pbr.rect(10, 10, 10, 10, red, .25);
    pbr.rect(10, 30, 30, 10, green, .5);
    pbr.rect(10, 50, 30, 30, blue, .75);
    pbr.rect(1, 1, 1, 1);
    pbr.rect(1, 3, 510, 1);
}

function sketch_dullRedShinyGreen() {
    pbr.rect(0, 0, 512, 512, [.5, .5, .5, 1], 0);


    for (let i = 0; i < 1000; i++) {
        let x = random(10, 502);
        let y = random(10, 502);
        pbr.rect(x - 5, y - 5, 30, 30, [0, random(.3, .6), 0, 1], .1)
    }


    for (let i = 0; i < 100; i++) {
        let x = random(10, 502);
        let y = random(10, 502);
        pbr.rect(x - 5, y - 5, 30, 30, [random(0, 1), 0, 0, 1], 1)
    }
}

function random(min = 0, max = 1): number {
    return Math.random() * (max - min) + min;
}

let show_albedo_button = document.querySelector("#show_albedo");
show_albedo_button.addEventListener("click", () => pbr.show_albedo());

let show_height_button = document.querySelector("#show_height");
show_height_button.addEventListener("click", () => pbr.show_height());

let download_albedo_button = document.querySelector("#download_albedo") as HTMLAnchorElement;
download_albedo_button.addEventListener("click", () => {
    download_albedo_button.href = pbr.get_albedo();
});
let download_height_button = document.querySelector("#download_height") as HTMLAnchorElement;
download_height_button.addEventListener("click", () => {
    download_height_button.href = pbr.get_height();
});
