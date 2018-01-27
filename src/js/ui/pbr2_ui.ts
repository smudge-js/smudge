declare var require: any;

const _ = require('lodash/core');

import { PBR } from '../pbr2';
import { bufferLayouts } from '../config/buffer_layouts';
import { export_layouts } from '../config/export_layouts';



import { PBRPreview } from './pbr_preview';

import '../../css/pbr5_ui.css';


let pbrPreview: PBRPreview;

export function showUI() {
    pbrPreview.update();
}

export function bindUI(pbr: PBR) {
    const uiHTML = require("html-loader!./ui.html");
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

    pbrPreview = new PBRPreview(pbr, 'pbr-preview');

    setTimeout(() => {
        pbrPreview.update();
    }, 1);
}
