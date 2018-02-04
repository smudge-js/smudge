import { PBR, Material2 } from '../../index';

// import { Matrix } from '../../draw/matrix';

export async function draw() {

    const pbr = new PBR(undefined, 512, 512);

    // const paper = new Material2();
    // paper.albedo.color = [.8, .8, .8];
    // paper.smoothness.color = .5;
    // pbr.clear(paper);

    const redLight = new Material2();
    redLight.albedo.color = 0;
    redLight.emission.color = [1, 0, 0, 1];
    pbr.rect(10, 10, 10, 10, redLight);

    const matteSpray = new Material2();
    matteSpray.smoothness.color = .2;
    pbr.rect(10, 30, 100, 100, matteSpray);



    const goldFoil = new Material2();
    goldFoil.albedo.color = [.4, .4, 0];
    goldFoil.smoothness.color = .8;
    goldFoil.height.color = .1;
    pbr.rect(10, 140, 100, 100, goldFoil);


    pbr.show();
}


