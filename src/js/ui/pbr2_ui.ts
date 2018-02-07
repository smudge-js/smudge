declare var require: any;

import { PBR } from '../pbr2';
import { bufferLayouts } from '../config/buffer_layouts';
import { exportLayouts } from '../config/export_layouts';

import { PBRPreview } from './pbr_preview';

import '../../css/pbr5_ui.css';
import { Framebuffer } from '../private/framebuffer';

import { forEach } from 'lodash';
import { wait } from '../util';
const _ = { forEach };



export class SmudgeUI {
    private uiDiv: HTMLDivElement;
    private pbrPreview: PBRPreview;

    constructor(private pbr: PBR) {
        this.uiDiv = document.createElement('div');
        document.body.appendChild(this.uiDiv);

        const uiHTML = require("./ui.html");
        this.uiDiv.innerHTML = uiHTML;

        document.getElementsByClassName("channel-preview")[0].appendChild(pbr.canvas);

        this.buildChannelButtons();
        this.buildExportButtons();
        this.buildPBRPreview();

    }

    public async updatePBR() {
        // collect the existing buffers
        const albedo: Framebuffer = this.pbr.getBuffer("albedo");
        const height: Framebuffer = this.pbr.getBuffer("height");
        const emission: Framebuffer = this.pbr.getBuffer("emission");

        // pack the three_pbr_smooth_metallic buffer
        const smoothMetallic = new Framebuffer("three_pbr_smooth_metallic", this.pbr.gl, 1024, 1024, 4, 16);
        const clearColor = [1, 1, 0, 1];
        const layout = {
            smoothness: [0, -1, 0, 0], // negate smoothness.r and pack into g
            metallic: [0, 0, 1, 0], // pack metallic.r into b
        };
        this.pbr.pack(layout, clearColor, smoothMetallic);

        // update buffers in preview
        this.pbrPreview.update(this.pbr.gl, albedo, smoothMetallic, height, emission);

        return wait();
    }

    private buildChannelButtons() {
        const channelButtonsDiv = this.uiDiv.getElementsByClassName("channel-buttons")[0];

        _.forEach(bufferLayouts, (_bufferLayout, bufferName) => {
            const b = document.createElement("button");
            channelButtonsDiv.appendChild(b);
            b.textContent = bufferName;

            let showBuffer;
            b.addEventListener("click", showBuffer = (event: MouseEvent) => {
                // set tab to active
                const children = channelButtonsDiv.childNodes;
                for (let i = 0; i < children.length; ++i) {
                    (children[i] as HTMLButtonElement).className = '';
                }
                (event.target as HTMLButtonElement).className = "active";

                // show it
                this.pbr.show(bufferName);
            });
        });
    }

    private buildExportButtons() {
        const exportButtonsDiv = document.getElementsByClassName("export-buttons")[0];

        _.forEach(exportLayouts, (layout: any, name: string) => {
            const b = document.createElement("button");
            exportButtonsDiv.appendChild(b);
            b.textContent = name;


            let downloadExport;
            b.addEventListener("click", downloadExport = (event: MouseEvent) => {
                event.preventDefault();
                this.pbr.pack(layout.layout, layout.clear);
                this.pbr.saveCanvasAs(`${name}.png`);
            });
        });
    }

    private buildPBRPreview() {
        this.pbrPreview = new PBRPreview('pbr-preview');
    }
}





// let pbrPreview: PBRPreview;







// export function updatePBR(pbr: PBR) {
//     const albedo: Framebuffer = getBuffer(pbr, "albedo");
//     const height: Framebuffer = getBuffer(pbr, "height");
//     const emission: Framebuffer = getBuffer(pbr, "emission");

//     // pack the three_pbr_smooth_metallic buffer

//     const smoothMetallic = new Framebuffer("three_pbr_smooth_metallic", pbr.gl, 1024, 1024, 4, 16);
//     const clearColor = [1, 1, 0, 1];
//     const layout = {
//         smoothness: [0, -1, 0, 0], // negate smoothness.r and pack into g
//         metallic: [0, 0, 1, 0], // pack metallic.r into b
//     };
//     pbr.pack(layout, clearColor, smoothMetallic);



//     pbrPreview.update(pbr.gl, albedo, smoothMetallic, height, emission);
// }



// export function bindUI(pbr: PBR) {
//     const uiHTML = require("./ui.html");
//     const smudgeUI = document.createElement('div');
//     smudgeUI.innerHTML = uiHTML;
//     document.body.appendChild(smudgeUI);


//     document.getElementById("channel-preview").appendChild(pbr.canvas);

//     // const ui = document.querySelector(".ui");

//     // add channel select tabs/button
//     const channelButtonsDiv = document.getElementById("channel-buttons");

//     _.forEach(bufferLayouts, (_bufferLayout, bufferName) => {
//         const b = document.createElement("button");
//         b.textContent = bufferName;
//         b.addEventListener("click", (e) => {
//             consoleTrace(e.target);

//             // set tab to active
//             const children = channelButtonsDiv.childNodes;
//             for (let i = 0; i < children.length; ++i) {
//                 (children[i] as HTMLButtonElement).className = '';
//             }

//             // for (const child of children) {
//             //     (child as HTMLButtonElement).className = '';
//             // }
//             (e.target as HTMLButtonElement).className = "active";

//             pbr.show(bufferName);
//         });

//         channelButtonsDiv.appendChild(b);
//     });




//     // add export buttons
//     const exportButtonsDiv = document.getElementById("export-buttons");

//     _.forEach(exportLayouts, (layout: any, name: string) => {
//         // let downloadLink = document.createElement("a");
//         // downloadLink.textContent = name;
//         // downloadLink.setAttribute("href", "#");
//         // downloadLink.setAttribute("class", "download-button");

//         const b = document.createElement("button");
//         b.textContent = name;

//         const fileName = `${name}.png`;

//         b.addEventListener("click", function download(event) {
//             event.preventDefault();
//             pbr.pack(layout.layout, layout.clear);
//             pbr.saveCanvasAs(fileName);
//         });

//         exportButtonsDiv.appendChild(b);
//     });


//     // set up three
//     // threePreview(pbr);

//     pbrPreview = new PBRPreview('pbr-preview');

//     setTimeout(() => {
//         // pbrPreview.update();
//         updatePBR(pbr);
//     }, 1);
// }
