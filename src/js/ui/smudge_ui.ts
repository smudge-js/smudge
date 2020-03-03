declare var require: any;

import { forEach, defaults } from 'lodash';
const _ = { forEach, defaults };

import { saveAs } from 'file-saver';

import { Smudge } from '../smudge';
import { bufferLayouts } from '../config/buffer_layouts';
import { exportLayouts } from '../config/export_layouts';
import { PBRPreview } from './pbr_preview';
import './smudge_ui.css';
import { Framebuffer } from '../private/framebuffer';
import { wait } from '../util';
import { consoleError, consoleWarn } from '../logging';

export interface ISmudgeUIOptions {
  show2D?: boolean;
  show3D?: boolean;
  combine2D3D?: boolean;
  showChannelButtons?: boolean;
  showExportButtons?: boolean;
  targetElement?: HTMLElement;
  environmentMapPath?: string;
}

const scripts = document.getElementsByTagName('script');
// console.log("scripts", scripts);
const path = scripts[scripts.length - 1].src.split('?')[0]; // remove any ?query
// console.log(`Script path ${path}`);
const mydir =
  path
    .split('/')
    .slice(0, -1)
    .join('/') + '/';
// console.log(`Script served from ${mydir}`);

export class SmudgeUI {
  private uiDiv: HTMLDivElement;
  private pbrPreview: PBRPreview;
  private options: ISmudgeUIOptions;

  constructor(private smudge: Smudge, opts?: ISmudgeUIOptions) {
    this.options = _.defaults(opts, {
      show2D: true,
      show3D: true,
      combine2D3D: false,
      showChannelButtons: true,
      showExportButtons: true,
      targetElement: undefined,
      environmentMapPath: mydir + 'images/environment_studio.jpg',
    });

    if (this.options.combine2D3D) {
      if (!this.options.show2D || !this.options.show3D) {
        consoleWarn('SmudgeUI: comine2D3D requires show2D and show3D, enabling.');
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
        consoleError(
          'SmudgeUI option show3D requires three.js as peer dependency. Either set show3D to false (default) or include three.js before loading smudge.'
        );
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

  public async update3D() {
    // collect the existing buffers
    const albedo: Framebuffer = this.smudge.getBuffer('albedo');
    const height: Framebuffer = this.smudge.getBuffer('height');
    const emission: Framebuffer = this.smudge.getBuffer('emission');

    // pack the three_pbr_smooth_metallic buffer
    const smoothMetallic = new Framebuffer(
      'three_pbr_smooth_metallic',
      this.smudge.gl,
      1024,
      1024,
      4,
      16
    );
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

  public async update2D(bufferOrName: Framebuffer | string = 'albedo') {
    const channelButtonsDiv = this.uiDiv.querySelector('.channel-buttons');
    const channelButtons = channelButtonsDiv.querySelectorAll('.channel-button');
    for (let i = 0; i < channelButtons.length; ++i) {
      channelButtons[i].classList.remove('active');
    }

    if (typeof bufferOrName === 'string') {
      const activeButton = channelButtonsDiv.querySelector(`.${bufferOrName}`);
      if (activeButton) {
        activeButton.classList.add('active');
      }
    }
    this.smudge.bufferToCanvas(bufferOrName);
  }

  public show3D() {
    const preview3d = this.uiDiv.querySelector('.preview-3d');
    const show2DButton = this.uiDiv.querySelector('.show-2d');
    const show3DButton = this.uiDiv.querySelector('.show-3d');

    if (preview3d) {
      preview3d.classList.add('show');
    }
    if (show2DButton) {
      show2DButton.classList.remove('active');
    }
    if (show3DButton) {
      show3DButton.classList.add('active');
    }
  }
  public show2D() {
    const preview3d = this.uiDiv.querySelector('.preview-3d');
    const show2DButton = this.uiDiv.querySelector('.show-2d');
    const show3DButton = this.uiDiv.querySelector('.show-3d');

    if (preview3d) {
      preview3d.classList.remove('show');
    }
    if (show2DButton) {
      show2DButton.classList.add('active');
    }
    if (show3DButton) {
      show3DButton.classList.remove('active');
    }
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
        this.update2D(bufferName);
      };

      b.addEventListener('click', showBuffer);
    });

    if (this.options.combine2D3D) {
      const preview3d = this.uiDiv.querySelector('.preview-3d');
      preview3d.classList.add('overlay');

      const show2DButton = document.createElement('button');
      channelButtonsDiv.appendChild(show2DButton);
      show2DButton.classList.add('active', 'show-2d');
      show2DButton.textContent = '2D';

      const show3DButton = document.createElement('button');
      channelButtonsDiv.appendChild(show3DButton);
      show3DButton.classList.add('show-3d');
      show3DButton.textContent = '3D';

      show3DButton.addEventListener('click', () => {
        this.show3D();
      });
      show2DButton.addEventListener('click', () => {
        this.show2D();
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

      const downloadExport = (event: MouseEvent) => {
        event.preventDefault();
        this.smudge.export(layout, `${this.smudge.name}_${name}`);
      };

      b.addEventListener('click', downloadExport);
    });

    if (this.options.show3D) {
      const b = document.createElement('button');
      exportButtonsDiv.appendChild(b);
      b.textContent = '3D';
      const download3D = (event: MouseEvent) => {
        event.preventDefault();
        const fileName = `${this.smudge.name}_render.png`;
        this.pbrPreview.canvas.toBlob((blob) => {
          saveAs(blob, fileName);
        });
      };
      b.addEventListener('click', download3D);
    }
  }

  private buildPBRPreview() {
    this.pbrPreview = new PBRPreview('pbr-preview');
    this.pbrPreview.loadEnvironmentMap(this.options.environmentMapPath);
    const target = this.uiDiv.querySelector('.preview-3d');
    target.appendChild(this.pbrPreview.canvas);
  }
}
