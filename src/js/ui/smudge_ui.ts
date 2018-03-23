declare var require: any;

import { Smudge } from '../smudge';
import { bufferLayouts } from '../config/buffer_layouts';
import { exportLayouts } from '../config/export_layouts';

import { PBRPreview } from './pbr_preview';

import './smudge_ui.css';
import { Framebuffer } from '../private/framebuffer';

import { forEach, defaults } from 'lodash';
const _ = { forEach, defaults };

import { wait } from '../util';
import { consoleError, consoleWarn } from '../logging';



export interface ISmudgeUIOptions {
    show2D?: boolean;
    show3D?: boolean;
    combine2D3D?: boolean;
    showChannelButtons?: boolean;
    showExportButtons?: boolean;
    targetElement?: HTMLElement;
}


export class SmudgeUI {
    private uiDiv: HTMLDivElement;
    private pbrPreview: PBRPreview;
    private options: ISmudgeUIOptions;

    constructor(private smudge: Smudge, opts?: ISmudgeUIOptions) {

        this.options = _.defaults(opts,
            {
                show2D: true,
                show3D: false,
                combine2D3D: true,
                showChannelButtons: true,
                showExportButtons: true,
                targetElement: undefined,
            });

        if (this.options.combine2D3D) {
            if (!this.options.show2D || !this.options.show3D) {
                consoleWarn("SmudgeUI: comine2D3D requires show2D and show3D, enabling.");
            }
            this.options.show2D = true;
            this.options.show3D = true;

        }

        this.uiDiv = document.createElement('div');
        this.uiDiv.classList.add('smudge-ui');
        if (this.options.targetElement) {
            this.options.targetElement.appendChild(this.uiDiv);
        } else {
            document.body.appendChild(this.uiDiv);
        }

        const uiHTML = require('./ui.html');
        this.uiDiv.insertAdjacentHTML('beforeend', uiHTML);


        if (this.options.show2D) {
            const target = this.uiDiv.querySelector('.preview-2d');
            target.appendChild(smudge.canvas);
        }

        if (this.options.show3D) {
            if (!(window as any).THREE) {
                consoleError('SmudgeUI option show3D requires three.js as peer dependency. Either set show3D to false (default) or include three.js before loading smudge.');
            }
            this.buildPBRPreview();
        }



        if (this.options.showChannelButtons) {
            this.buildChannelButtons();
        }
        if (this.options.showExportButtons) {
            this.buildExportButtons();
        }


    }

    public async updatePBR() {
        // collect the existing buffers
        const albedo: Framebuffer = this.smudge.getBuffer('albedo');
        const height: Framebuffer = this.smudge.getBuffer('height');
        const emission: Framebuffer = this.smudge.getBuffer('emission');

        // pack the three_pbr_smooth_metallic buffer
        const smoothMetallic = new Framebuffer('three_pbr_smooth_metallic', this.smudge.gl, 1024, 1024, 4, 16);
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

    public async showChannel(bufferOrName: Framebuffer | string = "albedo") {
        const channelButtonsDiv = this.uiDiv.querySelector('.channel-buttons');
        const channelButtons = channelButtonsDiv.querySelectorAll('.channel-button');
        for (let i = 0; i < channelButtons.length; ++i) {
            channelButtons[i].classList.remove('active');
        }

        if (typeof bufferOrName === "string") {
            const activeButton = channelButtonsDiv.querySelector(`.${bufferOrName}`);
            if (activeButton) {
                activeButton.classList.add('active');
            }
        }



        this.smudge.bufferToCanvas(bufferOrName);
    }

    private buildChannelButtons() {

        const channelButtonsDiv = this.uiDiv.querySelector('.channel-buttons');

        // channelButtonsDiv.insertAdjacentHTML('afterbegin', '<span class="label">SHOW</span>');

        _.forEach(bufferLayouts, (_bufferLayout, bufferName) => {
            const b = document.createElement('button');
            channelButtonsDiv.appendChild(b);

            b.classList.add('channel-button');
            b.classList.add(bufferName);
            b.textContent = bufferName;

            const showBuffer = () => {
                this.showChannel(bufferName);
            };

            // const activateChannelTab = (event: MouseEvent) => {
            //     // set tab to active
            //     const children = channelButtonsDiv.querySelectorAll('.channel-button');
            //     for (let i = 0; i < children.length; ++i) {
            //         children[i].classList.remove('active');
            //     }
            //     (event.target as HTMLButtonElement).classList.add('active');
            // };

            // b.addEventListener('click', activateChannelTab);
            b.addEventListener('click', showBuffer);
        });

        if (this.options.combine2D3D) {
            const preview3d = this.uiDiv.querySelector('.preview-3d');
            preview3d.classList.add('overlay');

            const show2DButton = document.createElement('button');
            channelButtonsDiv.appendChild(show2DButton);
            show2DButton.classList.add('active');
            show2DButton.textContent = '2D';

            const show3DButton = document.createElement('button');
            channelButtonsDiv.appendChild(show3DButton);
            show3DButton.textContent = '3D';


            show3DButton.addEventListener('click', () => {
                preview3d.classList.add('show');
                show2DButton.classList.remove('active');
                show3DButton.classList.add('active');
            });
            show2DButton.addEventListener('click', () => {
                preview3d.classList.remove('show');
                show2DButton.classList.add('active');
                show3DButton.classList.remove('active');
            });
        }
    }

    private buildExportButtons() {
        const exportButtonsDiv = this.uiDiv.querySelector('.export-buttons');
        exportButtonsDiv.insertAdjacentHTML('afterbegin', '<span class="label">EXPORT</span>');


        _.forEach(exportLayouts, (layout: any, name: string) => {
            const b = document.createElement('button');
            exportButtonsDiv.appendChild(b);
            b.textContent = name;


            let downloadExport;
            b.addEventListener('click', downloadExport = (event: MouseEvent) => {
                event.preventDefault();
                // this.smudge.pack(layout.layout, layout.clear);
                // this.smudge.saveCanvasAs(`${this.smudge.name}_${name}.png`);


                // const packBuffer = new Framebuffer('pack_buffer', this.smudge.gl, 1024, 1024, 4, 16);
                // this.smudge.pack(layout.layout, layout.clear, packBuffer);
                // this.smudge.saveBufferEXR(`${name}.exr`, packBuffer);

                // this.smudge.show(packBuffer);

                this.smudge.export(layout, `${this.smudge.name}_${name}`);

            });
        });
    }

    private buildPBRPreview() {
        this.pbrPreview = new PBRPreview('pbr-preview');
        const target = this.uiDiv.querySelector('.preview-3d');
        target.appendChild(this.pbrPreview.canvas);
    }


}
