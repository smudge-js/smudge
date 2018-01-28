import { consoleReport, consoleError } from '../logging';


export class Framebuffer {

    private rttFramebuffer: WebGLFramebuffer;
    private rttTexture: WebGLTexture;

    constructor(readonly name = "unnamed", readonly gl: WebGLRenderingContext, readonly width = 512, readonly height = 512, readonly channels = 4, readonly depth = 16) {

        if ([1, 4].indexOf(this.channels) === -1) {
            consoleError("channels should be 1 or 4");
            this.channels = channels = 4;
        }

        if ([8, 16].indexOf(this.depth) === -1) {
            consoleError("depth should be 8 or 16");
            this.depth = depth = 16;
        }

        const maxSize = Math.min(4096, gl.getParameter(gl.MAX_TEXTURE_SIZE));
        if (width > maxSize || height > maxSize) {
            consoleError(`Requested texture size (${width}) too big. Trying ${maxSize}.`);
            this.width = width = maxSize;
            this.height = height = maxSize;
        }



        // create framebuffer
        this.rttFramebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.rttFramebuffer);

        // create texture
        this.rttTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.rttTexture);

        const gl2 = gl as WebGL2RenderingContext;


        if (channels === 1 && depth === 8) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl2.R8, width, height, 0, gl2.RED, gl.UNSIGNED_BYTE, null);
        }
        if (channels === 1 && depth === 16) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl2.R16F, width, height, 0, gl2.RED, gl2.HALF_FLOAT, null);
        }
        if (channels === 4 && depth === 8) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl2.RGBA8, width, height, 0, gl2.RGBA, gl.UNSIGNED_BYTE, null);
        }
        if (channels === 4 && depth === 16) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl2.RGBA16F, width, height, 0, gl2.RGBA, gl2.HALF_FLOAT, null);
        }

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);

        // attach texture
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.rttTexture, 0);

        // check status
        consoleReport(`${this.toString()} Memory ${(width * height * channels * depth) / (8 * 1024 * 1024)}MB`);
        const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (status !== gl.FRAMEBUFFER_COMPLETE) {
            consoleReport(this.toString(), status === gl.FRAMEBUFFER_COMPLETE);
            consoleError("Failed to build Framebuffer: Incomplete or Unsupported: " + status);
        }

        // clean up
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    public toString(): string {
        return `Framebuffer "${this.name}"`;
    }

    public bind(): void {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.rttFramebuffer);
    }

    public bindTexture(textureUnit = this.gl.TEXTURE0): void {
        this.gl.activeTexture(textureUnit);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.rttTexture);
    }

}
