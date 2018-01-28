declare var require: any;

const _ = require('lodash/core');

import { PBR } from '../pbr2';
import { bufferLayouts } from '../config/buffer_layouts';
import { export_layouts } from '../config/export_layouts';



import { PBRPreview } from './pbr_preview';

import '../../css/pbr5_ui.css';
import { Framebuffer } from '../private/framebuffer';


let pbrPreview: PBRPreview;

// export function showUI() {
//     pbrPreview.update();
// }

export function updatePBR(pbr: PBR) {
    const albedo: Framebuffer = getBuffer(pbr, "albedo");
    const height: Framebuffer = getBuffer(pbr, "height");
    const emission: Framebuffer = getBuffer(pbr, "emission");

    // pack the three_pbr_smooth_metallic buffer

    const smoothMetallic = new Framebuffer("three_pbr_smooth_metallic", pbr.gl, 1024, 1024, 4, 16);
    const clearColor = [1, 1, 0, 1];
    const layout = {
        smoothness: [0, -1, 0, 0], // negate smoothness.r and pack into g
        metallic: [0, 0, 1, 0], // pack metallic.r into b
    };
    pbr.pack(layout, clearColor, smoothMetallic);



    pbrPreview.update(pbr.gl, albedo, smoothMetallic, height, emission);
}

function getBuffer(pbr: PBR, bufferName: string): Framebuffer {
    const buffer = pbr.buffers[bufferName];
    if (!buffer) {
        console.error("Could not find buffer named: " + bufferName);
        return;
    }
    return buffer;
}

export function bindUI(pbr: PBR) {
    const uiHTML = require("./ui.html");
    const smudgeUI = document.createElement('div');
    smudgeUI.innerHTML = uiHTML;
    document.body.appendChild(smudgeUI);


    document.getElementById("channel-preview").appendChild(pbr.canvas);

    const ui = document.querySelector(".ui");

    // add channel select tabs/button
    const channelButtonsDiv = document.getElementById("channel-buttons");

    _.forEach(bufferLayouts, (bufferLayout: any, bufferName: string) => {
        const b = document.createElement("button");
        b.textContent = bufferName;
        b.addEventListener("click", (e) => {
            console.log(e.target);

            // set tab to active
            const children = channelButtonsDiv.childNodes;
            for (let i = 0; i < children.length; ++i) {
                (children[i] as HTMLButtonElement).className = '';
            }

            // for (const child of children) {
            //     (child as HTMLButtonElement).className = '';
            // }
            (e.target as HTMLButtonElement).className = "active";

            pbr.show(bufferName);
        });

        channelButtonsDiv.appendChild(b);
    });




    // add export buttons
    const exportButtonsDiv = document.getElementById("export-buttons");

    _.forEach(export_layouts, (layout: any, name: string) => {
        // let downloadLink = document.createElement("a");
        // downloadLink.textContent = name;
        // downloadLink.setAttribute("href", "#");
        // downloadLink.setAttribute("class", "download-button");

        const b = document.createElement("button");
        b.textContent = name;

        const fileName = `${name}.png`;

        b.addEventListener("click", function download(event) {
            event.preventDefault();
            pbr.pack(layout.layout, layout.clear);
            pbr.saveCanvasAs(fileName);
        });

        exportButtonsDiv.appendChild(b);
    });


    // set up three
    // threePreview(pbr);

    pbrPreview = new PBRPreview('pbr-preview');

    setTimeout(() => {
        // pbrPreview.update();
        updatePBR(pbr);
    }, 1);
}
