declare var require: any;

var _ = require('lodash/core');

import { PBR } from './pbr2';
import { buffer_layouts } from './buffer_layouts';



export function bindUI(pbr: PBR) {
    let ui = document.querySelector(".ui");

    _.forEach(buffer_layouts, (buffer_layout: any, buffer_name: string) => {
        let showButton = document.createElement("button");
        showButton.textContent = buffer_name;

        showButton.addEventListener("click", () => {
            pbr.show(buffer_name);
        });

        ui.appendChild(showButton);
    });

    ui.appendChild(document.createElement("br"));
    ui.appendChild(document.createElement("br"));

    _.forEach(buffer_layouts, (buffer_layout: any, buffer_name: string) => {
        let downloadLink = document.createElement("a");
        downloadLink.textContent = `download ${buffer_name}`;
        downloadLink.setAttribute("href", "#");
        downloadLink.setAttribute("class", "download-button");
        downloadLink.setAttribute("download", `image_${buffer_name}.png`);

        downloadLink.addEventListener("click", function download() {
            pbr.show(buffer_name);
            let dataURL = pbr.canvas.toDataURL('image/png');
            console.log("dis", this);
            console.log("dataURL length " + dataURL.length);

            this.href = dataURL;
        });

        ui.appendChild(downloadLink);
    });

}
