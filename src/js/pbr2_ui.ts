declare var require: any;

var _ = require('lodash/core');

import { PBR } from './pbr2';
import { buffer_layouts, export_layouts } from './buffer_layouts';
import { saveAs } from 'file-saver';

import { threePreview, threeUpdate } from './three_preview';

// declare threePreview: any;

export function bindUI(pbr: PBR) {
    let ui = document.querySelector(".ui");

    _.forEach(buffer_layouts, (buffer_layout: any, buffer_name: string) => {
        let showButton = document.createElement("button");
        showButton.textContent = buffer_name;

        showButton.addEventListener("click", () => {
            pbr.show(buffer_name);
            threeUpdate(pbr.buffers);
        });

        ui.appendChild(showButton);

    });

    ui.appendChild(document.createElement("br"));
    ui.appendChild(document.createElement("br"));


    _.forEach(export_layouts, (layout: any, name: string) => {
        let downloadLink = document.createElement("a");
        downloadLink.textContent = name;
        downloadLink.setAttribute("href", "#");
        downloadLink.setAttribute("class", "download-button");

        var fileName = `${name}.png`;

        downloadLink.addEventListener("click", function download(event) {
            event.preventDefault();
            pbr.pack(layout.layout, layout.clear);

            pbr.canvas.toBlob((blob) => {
                console.log(this, fileName, blob);
                saveAs(blob, fileName);
            });
        });

        ui.appendChild(downloadLink);
    });

    threePreview(pbr.buffers);

    setTimeout(function () {
        pbr.show("albedo");
        threeUpdate(pbr.buffers);
    }, 1000);
}


