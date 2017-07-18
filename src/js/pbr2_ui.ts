declare var require: any;

var _ = require('lodash/core');

import { PBR } from './pbr2';
import { buffer_layouts, export_layouts } from './buffer_layouts';
import { saveAs } from 'file-saver';


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

    // _.forEach(buffer_layouts, (buffer_layout: any, buffer_name: string) => {
    //     let downloadLink = document.createElement("a");
    //     downloadLink.textContent = `download ${buffer_name}`;
    //     downloadLink.setAttribute("href", "#");
    //     downloadLink.setAttribute("class", "download-button");
    //     // downloadLink.setAttribute("download", `image_${buffer_name}.png`);

    //     var fileName = `image_${buffer_name}.png`;

    //     downloadLink.addEventListener("click", function download(event) {
    //         event.preventDefault();
    //         pbr.show(buffer_name);

    //         // let dataURL = pbr.canvas.toDataURL('image/png');
    //         // this.href = dataURL;

    //         pbr.canvas.toBlob((blob) => {
    //             console.log(this, fileName, blob);
    //             saveAs(blob, fileName);
    //         });
    //     });
    //     ui.appendChild(downloadLink);
    // });


    // make pack ms button
    // {
    //     let downloadLink = document.createElement("a");
    //     downloadLink.textContent = `download m+s`;
    //     downloadLink.setAttribute("href", "#");
    //     downloadLink.setAttribute("class", "download-button");
    //     // downloadLink.setAttribute("download", `image_${buffer_name}.png`);

    //     var fileName = `image_metallic_smooth.png`;

    //     downloadLink.addEventListener("click", function download(event) {
    //         event.preventDefault();
    //         pbr.pack({
    //             metallic: [1, 0, 0, 0],
    //             smoothness: [0, 0, 0, 1]
    //         });

    //         // let dataURL = pbr.canvas.toDataURL('image/png');
    //         // this.href = dataURL;

    //         pbr.canvas.toBlob((blob) => {
    //             console.log(this, fileName, blob);
    //             saveAs(blob, fileName);
    //         });
    //     });

    //     ui.appendChild(downloadLink);
    // }


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


}
