import {
  consoleReport,
  consoleWarn,
  consoleError,
  consoleInfo
} from "../logging";

export class Program {
  public program: WebGLProgram;

  private attribLocations: { [attrib: string]: number } = {};

  private uniformLocations: { [attrib: string]: WebGLUniformLocation } = {};

  constructor(
    readonly name = "unnamed",
    readonly gl: WebGLRenderingContext,
    readonly vertexSource: string,
    readonly fragmentSource: string
  ) {
    let error;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexSource);
    gl.compileShader(vertexShader);
    error = gl.getShaderInfoLog(vertexShader);
    if (error) {
      consoleReport(
        this.toString(),
        "vertexShader",
        gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)
      );
      consoleError(error);
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentSource);
    gl.compileShader(fragmentShader);
    error = gl.getShaderInfoLog(fragmentShader);
    if (error) {
      consoleReport(
        this.toString(),
        "fragmentShader",
        gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)
      );
      consoleError(error);
    }

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    consoleReport(
      this.toString(),
      "LINK_STATUS",
      gl.getProgramParameter(program, gl.LINK_STATUS)
    );

    gl.validateProgram(program);
    consoleReport(
      this.toString(),
      "VALIDATE_STATUS",
      gl.getProgramParameter(program, gl.VALIDATE_STATUS)
    );

    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
      const info = gl.getProgramInfoLog(program);
      throw new Error("Could not compile WebGL program. \n\n" + info);
    }

    this.program = program;
  }

  public use(): void {
    this.gl.useProgram(this.program);
  }

  public done(): void {
    // @todo loop through actual attribs and disable them
    this.gl.disableVertexAttribArray(0);
    this.gl.disableVertexAttribArray(1);
  }

  public getAttribLocation(attribute: string): number {
    let loc: number;
    if (this.attribLocations[attribute] !== undefined) {
      loc = this.attribLocations[attribute];
    } else {
      loc = this.gl.getAttribLocation(this.program, attribute);
      this.attribLocations[attribute] = loc;
      if (loc === -1) {
        consoleInfo(
          this.toString(),
          `Shader program attribute not found: ${attribute}`
        );
      }
    }
    return loc;
  }

  public setAttributeValue(
    attribute: string,
    buffer: WebGLBuffer,
    size: GLint,
    type: GLint,
    normalized: GLboolean,
    stride: GLsizei,
    offset: GLintptr
  ): void {
    const loc = this.getAttribLocation(attribute);
    if (loc === -1) {
      return;
    }
    this.gl.enableVertexAttribArray(loc);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.vertexAttribPointer(loc, size, type, normalized, stride, offset);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }

  public getUniformLocation(uniform: string): WebGLUniformLocation {
    let loc: WebGLUniformLocation;
    if (this.uniformLocations[uniform] !== undefined) {
      loc = this.uniformLocations[uniform];
    } else {
      loc = this.gl.getUniformLocation(this.program, uniform);
      this.uniformLocations[uniform] = loc;
      if (loc == null) {
        consoleError(
          this.toString(),
          `Shader program uniform not found: ${uniform}`
        );
      }
    }
    return loc;
  }
  public setUniformFloats(
    uniform: string,
    value: Float32Array | number[]
  ): void {
    const loc = this.getUniformLocation(uniform);

    if (value.length === 1) {
      this.gl.uniform1fv(loc, value);
    } else if (value.length === 2) {
      this.gl.uniform2fv(loc, value);
    } else if (value.length === 3) {
      this.gl.uniform3fv(loc, value);
    } else if (value.length === 4) {
      this.gl.uniform4fv(loc, value);
    } else {
      consoleError(
        this.toString(),
        `Invalid value length for setUniformFloats: ${value.length}`
      );
    }
  }

  public setUniformInts(uniform: string, value: Int32Array | number[]): void {
    const loc = this.getUniformLocation(uniform);

    if (loc == null) {
      consoleError(
        this.toString(),
        `Shader program uniform not found: ${uniform}`
      );
    }

    if (value.length === 1) {
      this.gl.uniform1iv(loc, value);
    } else if (value.length === 2) {
      this.gl.uniform2iv(loc, value);
    } else if (value.length === 3) {
      this.gl.uniform3iv(loc, value);
    } else if (value.length === 4) {
      this.gl.uniform4iv(loc, value);
    } else {
      consoleError(
        this.toString(),
        `Invalid value length for setUniformFloats: ${value.length}`
      );
    }
  }

  public setUniformMatrix(
    uniform: string,
    value: Float32Array | number[]
  ): void {
    const loc = this.getUniformLocation(uniform);

    if (value.length === 4) {
      this.gl.uniformMatrix2fv(loc, false, value);
    } else if (value.length === 9) {
      this.gl.uniformMatrix3fv(loc, false, value);
    } else if (value.length === 16) {
      this.gl.uniformMatrix4fv(loc, false, value);
    } else {
      consoleError(
        this.toString(),
        `Invalid value length for setUniformMatrix: ${value.length}`
      );
    }
  }

  public toString(): string {
    return `GLProgram "${this.name}"`;
  }
}
