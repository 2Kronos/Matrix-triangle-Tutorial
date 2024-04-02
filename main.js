const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error('WebGL not supported');
}

//Vertecies
const vertexData = [
    0, 1, 0,
    1, -1, 0,
    -1, -1, 0,
    -1.5, 0.5, 0,
    1.4, -0.4, 0,
];

//Buffer
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

//vertex shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
attribute vec3 position;
precision mediump float;

uniform mat4 u_ScaleMatrix;
uniform mat4 u_TranslateMatrix;
uniform mat4 u_RotateMatrix;

void main() {
        gl_Position = u_ScaleMatrix * u_TranslateMatrix * u_RotateMatrix * vec4(position, 1);
        gl_PointSize = 40.0;
}
`);

//Error checking for vertex shader
gl.compileShader(vertexShader);
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error('Vertex shader compilation error:', gl.getShaderInfoLog(vertexShader));
}

//Fragment shader
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
void main() {
    gl_FragColor = vec4(1, 0, 0, 1);
}
`);

//Error checking for fragment shader
gl.compileShader(fragmentShader);
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error('Fragment shader compilation error:', gl.getShaderInfoLog(fragmentShader));
}

//Program
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

//Error checking for program
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program linking error:', gl.getProgramInfoLog(program));
}

//Getting location of attribute
const positionLocation = gl.getAttribLocation(program, `position`);
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);

//Getting location of the matrixes unifroms
const uScaleMatrix = gl.getUniformLocation(program, `u_ScaleMatrix`);
const uTranslateMatrix = gl.getUniformLocation(program, `u_TranslateMatrix`);
const uRotateMatrix = gl.getUniformLocation(program, `u_RotateMatrix`);

//Scaling matrix 
var scaledMatrix = [
    0.4, 0, 0, 0,
    0, 0.4, 0, 0,
    0, 0, 0.4, 0,
    0, 0, 0, 1
];

var translatedMatrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
];

var theta = Math.PI / 40;

function animate() {
    requestAnimationFrame(animate);
    gl.clearColor(0.1, 0.3, 0.3, 1);

    // var rotateYMatrix = [
        //     Math.cos(theta), 0, Math.sin(theta), 0,
        //     0, 1, 0, 0,
        //     -Math.sin(theta), 0, Math.cos(theta), 0,
        //     0, 0, 0, 1
        // ];

    var rotateXMatrix = [
        1, 0, 0, 0,
        0, Math.cos(theta), -Math.sin(theta), 0,
        0, Math.sin(theta), Math.cos(theta), 0,
        0, 0, 0, 1
    ];
    

    // var rotateYMatrix = [
    //     Math.cos(theta), -Math.sin(theta), 0, 0,
    //     Math.sin(theta), Math.cos(theta), 0, 0,
    //     0, 0, 1, 0,
    //     0, 0, 0, 1
    // ];

    gl.uniformMatrix4fv(uScaleMatrix, false, scaledMatrix);
    gl.uniformMatrix4fv(uTranslateMatrix, false, translatedMatrix);
    gl.uniformMatrix4fv(uRotateMatrix, false, rotateXMatrix);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 3);
     gl.drawArrays(gl.POINTS, 0, 6);
    theta += 0.02;
}
animate();
