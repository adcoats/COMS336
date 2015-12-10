//
// Same as BasicBump.js except that we include the "tangent" vector as
// a vertex attribute, in order to find and apply the TBN matrix in the 
// vertex shader.  See BetterBump.html.
//

// our model data
var theModel;


//normal map
//var imageFilename = "../normalmaps/rockNormal.png";
//var imageFilename = "../normalmaps/example2_normaldeep.jpg";
var imageFilename = "../normalmaps/brickwork_normal-map.png";

// choose a geometry

theModel = getSquareData();

// cube
//theModel = getModelData(new THREE.CubeGeometry(1, 1, 1));

// basic sphere
//theModel = getModelData(new THREE.SphereGeometry(1))

// sphere with more faces
//theModel = getModelData(new THREE.SphereGeometry(1, 48, 24));

// torus knot
//theModel = getModelData(new THREE.TorusKnotGeometry(1, .4, 128, 16));





function getSquareData()
{
  var vertices32 = new Float32Array([
-0.5, -0.5, 0.0,
0.5, -0.5, 0.0,
0.5, 0.5, 0.0,
-0.5, -0.5, 0.0,
0.5, 0.5, 0.0,
-0.5, 0.5, 0.0
]
  );

//normals n z-direction
  var normals32 = new Float32Array([
0.0, 0.0, 1.0,
0.0, 0.0, 1.0,
0.0, 0.0, 1.0,
0.0, 0.0, 1.0,
0.0, 0.0, 1.0,
0.0, 0.0, 1.0,
]);

//texture coordinates
  var texCoords32 = new Float32Array([
0.0, 0.0,
1.0, 0.0, 
1.0, 1.0,
0.0, 0.0,
1.0, 1.0, 
0.0, 1.0,
]);

//tangent vector to right
  var tangents32 = new Float32Array([
1.0, 0.0, 0.0,
1.0, 0.0, 0.0,
1.0, 0.0, 0.0,
1.0, 0.0, 0.0,
1.0, 0.0, 0.0,
1.0, 0.0, 0.0,
]);


//(**) Alt: tangent vector inconsistent in the two polygons
//var tangents32 = new Float32Array([
//1.0, 0.0, 0.0,
//1.0, 0.0, 0.0,
//1.0, 0.0, 0.0,
//0.0, 1.0, 0.0,
//0.0, 1.0, 0.0,
//0.0, 1.0, 0.0,
//]);

  return {
    numVertices: 6,
    vertices: vertices32,
    normals: normals32,
    vertexNormals: normals32,
    //reflectedNormals: new Float32Array(reflectedNormalsArray),
    texCoords: texCoords32,
    tangents: tangents32
  };
};

// given an instance of THREE.Geometry, returns an object
// containing raw data for vertices and normal vectors.
function getModelData(geom)
{
	var verticesArray = [];
	var normalsArray = [];
	var vertexNormalsArray = [];
	var reflectedNormalsArray = [];
	var count = 0;
	for (var f = 0; f < geom.faces.length; ++f)
	{
		var face = geom.faces[f];
		var v = geom.vertices[face.a];
		verticesArray.push(v.x);
		verticesArray.push(v.y);
		verticesArray.push(v.z);
		
		v = geom.vertices[face.b];
		verticesArray.push(v.x);
		verticesArray.push(v.y);
		verticesArray.push(v.z);
		
		v = geom.vertices[face.c];
		verticesArray.push(v.x);
		verticesArray.push(v.y);
		verticesArray.push(v.z);
		count += 3;
		
		var fn = face.normal;
		for (var i = 0; i < 3; ++i)
		{
			normalsArray.push(fn.x);
			normalsArray.push(fn.y);
			normalsArray.push(fn.z);
		}

		for (var i = 0; i < 3; ++i)
		{
			var vn = face.vertexNormals[i];
			vertexNormalsArray.push(vn.x);
			vertexNormalsArray.push(vn.y);
			vertexNormalsArray.push(vn.z);
		}
		
	}
	
  // texture coords
  //each element is an array of three Vector2
  var uvs = geom.faceVertexUvs[ 0 ];
  var texCoordArray = [];
  for (var a = 0; a < uvs.length; ++a)
  {
    for (var i = 0; i < 3; ++i)
    {
      var uv = uvs[a][i];
      texCoordArray.push(uv.x);
      texCoordArray.push(uv.y);
    }
  }

	return {
		numVertices: count,
		vertices: new Float32Array(verticesArray),
		normals: new Float32Array(normalsArray),
		vertexNormals: new Float32Array(vertexNormalsArray),
    reflectedNormals: new Float32Array(reflectedNormalsArray),
    texCoords: new Float32Array(texCoordArray)
	};
}


function makeNormalMatrixElements(model, view)
{
	var n = new Matrix4(view).multiply(model);
	n.transpose();
	n.invert();
	n = n.elements;
	return new Float32Array([
	n[0], n[1], n[2],
	n[4], n[5], n[6],
	n[8], n[9], n[10] ]);
}


var axisVertices = new Float32Array([
0.0, 0.0, 0.0,
1.5, 0.0, 0.0,
0.0, 0.0, 0.0, 
0.0, 1.5, 0.0, 
0.0, 0.0, 0.0, 
0.0, 0.0, 1.5]);

var axisColors = new Float32Array([
1.0, 0.0, 0.0, 1.0,
1.0, 0.0, 0.0, 1.0, 
0.0, 1.0, 0.0, 1.0, 
0.0, 1.0, 0.0, 1.0, 
0.0, 0.0, 1.0, 1.0,
0.0, 0.0, 1.0, 1.0]);

// A few global variables...

// light and material properties, remember this is column major

// generic white light
var lightPropElements = new Float32Array([
0.2, 0.2, 0.2,
0.7, 0.7, 0.7,
0.7, 0.7, 0.7
]);


// shiny brass
//var matPropElements = new Float32Array([
//0.33, 0.22, 0.03,
//0.78, 0.57, 0.11,
//0.99, 0.91, 0.81
//]);
//var shininess = 28.0;

// very fake looking white, useful for testing lights
var matPropElements = new Float32Array([
1, 1, 1,
1, 1, 1,
1, 1, 1
]);
var shininess = 20.0;

// clay or terracotta
//var matPropElements = new Float32Array([
//0.75, 0.38, 0.26,
//0.75, 0.38, 0.26,
//0.25, 0.20, 0.15 // weak specular highlight similar to diffuse color
//]);
//var shininess = 10.0;

// the OpenGL context
var gl;

// handle to a buffer on the GPU
var vertexBuffer;
var vertexNormalBuffer;
var texCoordBuffer;
var tangentBuffer;

var axisBuffer;
var axisColorBuffer;

//handle to the texture object on the GPU
var textureHandle;

// handle to the compiled shader program on the GPU
var lightingShader;
var colorShader;

// transformation matrices
var model = new Matrix4();

var axis = 'x';
var paused = true;

//instead of view and projection matrices, use a Camera
var camera = new Camera(30, 1.5);

//
////view matrix
//var view = new Matrix4().setLookAt(
//		1.77, 3.54, 3.06,   // eye
//		0, 0, 0,            // at - looking at the origin
//		0, 1, 0);           // up vector - y axis
//
//var projection = new Matrix4().setPerspective(30, 1.5, 0.1, 1000);

//translate keypress events to strings
//from http://javascript.info/tutorial/keyboard-events
function getChar(event) {
if (event.which == null) {
 return String.fromCharCode(event.keyCode) // IE
} else if (event.which!=0 && event.charCode!=0) {
 return String.fromCharCode(event.which)   // the rest
} else {
 return null // special key
}
}

//handler for key press events will choose which axis to
// rotate around
function handleKeyPress(event)
{
  var ch = getChar(event);
  if (camera.keyControl(ch)) return;
  
	switch(ch)
	{
	case ' ':
		paused = !paused;
		break;
	case 'x':
		axis = 'x';
		break;
	case 'y':
		axis = 'y';
		break;
	case 'z':
		axis = 'z';
		break;
	case 'o':
		model.setIdentity();
		axis = 'x';
		break;
		default:
			return;
	}
	return false;
}



// code to actually render our geometry
function draw()
{
  // clear the framebuffer
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BIT);

  // bind the shader
  gl.useProgram(lightingShader);

  // get the index for the a_Position attribute defined in the vertex shader
  var positionIndex = gl.getAttribLocation(lightingShader, 'a_Position');
  if (positionIndex < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  var normalIndex = gl.getAttribLocation(lightingShader, 'a_Normal');
  if (normalIndex < 0) {
	    console.log('Failed to get the storage location of a_Normal');
	    return;
	  }

  var texCoordIndex = gl.getAttribLocation(lightingShader, 'a_TexCoord');
  if (texCoordIndex < 0) {
    console.log('Failed to get the storage location of a_TexCoord');
    return;
  }

  var tangentIndex = gl.getAttribLocation(lightingShader, 'a_Tangent');
  if (tangentIndex < 0) {
    console.log('Failed to get the storage location of a_TexCoord');
    return;
  }
  
  // "enable" the a_position attribute 
  gl.enableVertexAttribArray(positionIndex);
  gl.enableVertexAttribArray(normalIndex);
  gl.enableVertexAttribArray(texCoordIndex);
  gl.enableVertexAttribArray(tangentIndex);
 
  // bind buffers for points 
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.vertexAttribPointer(positionIndex, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
  gl.vertexAttribPointer(normalIndex, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.vertexAttribPointer(texCoordIndex, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, tangentBuffer);
  gl.vertexAttribPointer(tangentIndex, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // set uniform in shader for projection * view * model transformation
  var view = camera.getView();
  var projection = camera.getProjection();

  var loc = gl.getUniformLocation(lightingShader, "model");
  gl.uniformMatrix4fv(loc, false, model.elements);
  loc = gl.getUniformLocation(lightingShader, "view");
  gl.uniformMatrix4fv(loc, false, view.elements);
  loc = gl.getUniformLocation(lightingShader, "projection");
  gl.uniformMatrix4fv(loc, false, projection.elements);
  loc = gl.getUniformLocation(lightingShader, "normalMatrix");
  gl.uniformMatrix3fv(loc, false, makeNormalMatrixElements(model, view));
  
  loc = gl.getUniformLocation(lightingShader, "lightPosition");
  gl.uniform4f(loc, 2.0, 4.0, 10.0, 1.0);

  // light and material properties
  loc = gl.getUniformLocation(lightingShader, "lightProperties");
  gl.uniformMatrix3fv(loc, false, lightPropElements);
  loc = gl.getUniformLocation(lightingShader, "materialProperties");
  gl.uniformMatrix3fv(loc, false, matPropElements);
  loc = gl.getUniformLocation(lightingShader, "shininess");
  gl.uniform1f(loc, shininess);
  
  // need to choose a texture unit, then bind the texture to TEXTURE_2D for that unit
  var textureUnit = 1;
  gl.activeTexture(gl.TEXTURE0 + textureUnit);
  gl.bindTexture(gl.TEXTURE_2D, textureHandle);
  loc = gl.getUniformLocation(lightingShader, "sampler");
  gl.uniform1i(loc, textureUnit);  
  
  
  gl.drawArrays(gl.TRIANGLES, 0, theModel.numVertices);
  
  gl.disableVertexAttribArray(positionIndex);
  gl.disableVertexAttribArray(normalIndex);

  
  // bind the shader
  gl.useProgram(colorShader);

  // get the index for the a_Position attribute defined in the vertex shader
  positionIndex = gl.getAttribLocation(colorShader, 'a_Position');
  if (positionIndex < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  var colorIndex = gl.getAttribLocation(colorShader, 'a_Color');
  if (colorIndex < 0) {
	    console.log('Failed to get the storage location of a_Normal');
	    return;
	  }
 
  // "enable" the a_position attribute 
  gl.enableVertexAttribArray(positionIndex);
  gl.enableVertexAttribArray(colorIndex);
 
  
  // draw axes (not transformed by model transformation)
  gl.bindBuffer(gl.ARRAY_BUFFER, axisBuffer);
  gl.vertexAttribPointer(positionIndex, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, axisColorBuffer);
  gl.vertexAttribPointer(colorIndex, 4, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
  // set transformation to projection * view only
  loc = gl.getUniformLocation(colorShader, "transform");
  transform = new Matrix4().multiply(projection).multiply(view);
  gl.uniformMatrix4fv(loc, false, transform.elements);

  // draw axes
  gl.drawArrays(gl.LINES, 0, 6);  
  
  // unbind shader and "disable" the attribute indices
  // (not really necessary when there is only one shader)
  gl.disableVertexAttribArray(positionIndex);
  gl.disableVertexAttribArray(colorIndex);
  gl.useProgram(null);

}


//entry point when page is loaded.  Wait for image to load before proceeding
function main() {
  var image = new Image();
  image.onload = function() { 
    // chain the next function
    startForReal(image); 
    };

  // starts loading the image asynchronously
  image.src = imageFilename;
}


// start here after loading image
function startForReal(image) {
	
  // retrieve <canvas> element
  var canvas = document.getElementById('theCanvas');

  // key handler
  window.onkeypress = handleKeyPress;

  // get the rendering context for WebGL, using the utility from the teal book
  gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // load and compile the shader pair, using utility from the teal book
  var vshaderSource = document.getElementById('vertexColorShader').textContent;
  var fshaderSource = document.getElementById('fragmentColorShader').textContent;
  if (!initShaders(gl, vshaderSource, fshaderSource)) {
    console.log('Failed to intialize shaders.');
    return;
  }
  colorShader = gl.program;
  gl.useProgram(null);
  
  // load and compile the shader pair, using utility from the teal book
  var vshaderSource = document.getElementById('vertexLightingShader').textContent;
  var fshaderSource = document.getElementById('fragmentLightingShader').textContent;
  if (!initShaders(gl, vshaderSource, fshaderSource)) {
    console.log('Failed to intialize shaders.');
    return;
  }
  lightingShader = gl.program;
  gl.useProgram(null);
  
  // buffer for vertex positions for triangles
  vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
	  console.log('Failed to create the buffer object');
	  return;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, theModel.vertices, gl.STATIC_DRAW);

  // buffer for vertex normals
  vertexNormalBuffer = gl.createBuffer();
  if (!vertexNormalBuffer) {
	  console.log('Failed to create the buffer object');
	  return;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
  
  // choose face normals, vertex normals, or wacky normals
  gl.bufferData(gl.ARRAY_BUFFER, theModel.normals, gl.STATIC_DRAW);
  //gl.bufferData(gl.ARRAY_BUFFER, theModel.vertexNormals, gl.STATIC_DRAW);
  //gl.bufferData(gl.ARRAY_BUFFER, theModel.reflectedNormals, gl.STATIC_DRAW);

  // buffer for tex coords
  texCoordBuffer = gl.createBuffer();
  if (!texCoordBuffer) {
    console.log('Failed to create the buffer object');
    return;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);  
  gl.bufferData(gl.ARRAY_BUFFER, theModel.texCoords, gl.STATIC_DRAW);
  
  // buffer for tangent vectors
  tangentBuffer = gl.createBuffer();
  if (!tangentBuffer) {
    console.log('Failed to create the buffer object');
    return;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, tangentBuffer);  
  gl.bufferData(gl.ARRAY_BUFFER, theModel.tangents, gl.STATIC_DRAW);

  
  // axes
  axisBuffer = gl.createBuffer();
  if (!axisBuffer) {
	  console.log('Failed to create the buffer object');
	  return;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, axisBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, axisVertices, gl.STATIC_DRAW);
  
  // buffer for axis colors
  axisColorBuffer = gl.createBuffer();
  if (!axisColorBuffer) {
	  console.log('Failed to create the buffer object');
	  return;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, axisColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, axisColors, gl.STATIC_DRAW);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // ask the GPU to create a texture object
  textureHandle = gl.createTexture();
  
  // choose a texture unit to use during setup, defaults to zero
  // (can use a different one when drawing)
  // max value is MAX_COMBINED_TEXTURE_IMAGE_UNITS
  gl.activeTexture(gl.TEXTURE0);
  
  // bind the texture
  gl.bindTexture(gl.TEXTURE_2D, textureHandle);
  
  // load the image bytes to the currently bound texture, flipping the vertical
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  
  // texture parameters are stored with the texture
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);  // default is REPEAT
  
  
  
  // specify a fill color for clearing the framebuffer
  gl.clearColor(0.0, 0.2, 0.2, 1.0);
  
  gl.enable(gl.DEPTH_TEST);
   
  // define an animation loop
  var animate = function() {
    draw();

    // increase the rotation by some amount, depending on the axis chosen
    var increment = 0.5;
    if (!paused)
    {
      switch(axis)
      {
      case 'x':
        model = new Matrix4().setRotate(increment, 1, 0, 0).multiply(model);
        axis = 'x';
        break;
      case 'y':
        axis = 'y';
        model = new Matrix4().setRotate(increment, 0, 1, 0).multiply(model);
        break;
      case 'z':
        axis = 'z';
        model = new Matrix4().setRotate(increment, 0, 0, 1).multiply(model);
        break;
      default:
      }
    }

    // request that the browser calls animate() again "as soon as it can"
    requestAnimationFrame(animate, canvas); 
  };
  
  // start drawing!
  animate();

  
}