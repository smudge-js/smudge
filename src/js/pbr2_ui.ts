declare var require: any;

var _ = require('lodash/core');

import { PBR } from './pbr2';
import { buffer_layouts, export_layouts } from './buffer_layouts';
import { saveAs } from 'file-saver';

import { threePreview, threeUpdate } from './three_preview';

import '../css/pbr5_ui.css';


export function bindUI(pbr: PBR) {
    let ui = document.querySelector(".ui");

    // add channel select tabs/button
    let channel_buttons_div = document.getElementById("channel-buttons");

    _.forEach(buffer_layouts, (buffer_layout: any, buffer_name: string) => {
        let b = document.createElement("button");
        b.textContent = buffer_name;
        b.addEventListener("click", (e) => {
            console.log(e.target);

            // set tab to active
            let children = channel_buttons_div.childNodes;
            for (var i = 0; i < children.length; ++i) {
                (children[i] as HTMLButtonElement).className = '';
            }
            (e.target as HTMLButtonElement).className = "active";

            pbr.show(buffer_name);
        });

        channel_buttons_div.appendChild(b);
    });




    // add export buttons
    let export_buttons_div = document.getElementById("export-buttons");

    _.forEach(export_layouts, (layout: any, name: string) => {
        // let downloadLink = document.createElement("a");
        // downloadLink.textContent = name;
        // downloadLink.setAttribute("href", "#");
        // downloadLink.setAttribute("class", "download-button");

        let b = document.createElement("button");
        b.textContent = name;

        var fileName = `${name}.png`;

        b.addEventListener("click", function download(event) {
            event.preventDefault();
            pbr.pack(layout.layout, layout.clear);

            pbr.canvas.toBlob((blob) => {
                console.log(this, fileName, blob);
                saveAs(blob, fileName);
            });
        });

        export_buttons_div.appendChild(b);
    });


    // set up three
    threePreview(pbr);

    setTimeout(function () {
        threeUpdate(pbr);
    }, 1);
}


