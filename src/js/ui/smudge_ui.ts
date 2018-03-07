declare var require: any;

import { Smudge } from '../smudge';
import { bufferLayouts } from '../config/buffer_layouts';
import { exportLayouts } from '../config/export_layouts';

import { PBRPreview } from './pbr_preview';

import '../../css/smudge_ui.css';
import { Framebuffer } from '../private/framebuffer';

import { forEach } from 'lodash';
import { wait } from '../util';
const _ = { forEach };



export class SmudgeUI {
    private uiDiv: HTMLDivElement;
    private pbrPreview: PBRPreview;

    constructor(private smudge: Smudge) {
        this.uiDiv = document.createElement('div');
        document.body.appendChild(this.uiDiv);

        const uiHTML = require("./ui.html");
        this.uiDiv.innerHTML = uiHTML;

        document.getElementsByClassName("channel-preview")[0].appendChild(smudge.canvas);

        this.buildChannelButtons();
        this.buildExportButtons();
        this.buildPBRPreview();

    }

    public async updatePBR() {
        // collect the existing buffers
        const albedo: Framebuffer = this.smudge.getBuffer("albedo");
        const height: Framebuffer = this.smudge.getBuffer("height");
        const emission: Framebuffer = this.smudge.getBuffer("emission");

        // pack the three_pbr_smooth_metallic buffer
        const smoothMetallic = new Framebuffer("three_pbr_smooth_metallic", this.smudge.gl, 1024, 1024, 4, 16);
        const clearColor = [1, 1, 0, 1];
        const layout = {
            smoothness: [0, -1, 0, 0], // negate smoothness.r and pack into g
            metallic: [0, 0, 1, 0], // pack metallic.r into b
        };
        this.smudge.pack(layout, clearColor, smoothMetallic);

        // update buffers in preview
        this.pbrPreview.update(this.smudge.gl, albedo, smoothMetallic, height, emission);

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
                this.smudge.show(bufferName);
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
                this.smudge.pack(layout.layout, layout.clear);
                this.smudge.saveCanvasAs(`${this.smudge.name}_${name}.png`);


                const packBuffer = new Framebuffer("pack_buffer", this.smudge.gl, 1024, 1024, 4, 16);
                this.smudge.pack(layout.layout, layout.clear, packBuffer);
                this.smudge.saveBufferEXR(`${name}.exr`, packBuffer);

                this.smudge.show(packBuffer);

            });
        });
    }

    private buildPBRPreview() {
        this.pbrPreview = new PBRPreview('pbr-preview');
    }
}


