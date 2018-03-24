import { Material2, Smudge, SmudgeUI } from '../src/js/index';

// create a smudge instance
const smudge = new Smudge('test_headless', 512, 512);

// draw
smudge.clear();
const simpleBlue = new Material2();
simpleBlue.albedo.color = [0, 0, 1];
smudge.rect(0, 0, 200, 200, simpleBlue);

// export button
const b = document.createElement('button');
document.body.appendChild(b);
b.textContent = "export";
b.addEventListener('click', () => {
    smudge.export('albedo', 'albedo');
});
