
// Skybox data

//var path = "../images/park/";
var path = "../images/sky/";
var imageNames = [
                  path + "px.jpg",
                  path + "nx.jpg",
                  path + "py.jpg",
                  path + "ny.jpg",
                  path + "pz.jpg",
                  path + "nz.jpg"
                  ];		  

// The scene and camera
var scene;		
var camera;

// object data
var islanddummy;

// The data texture for the water.
var waterDataTex;
var DIM = 32;
var numSteps = DIM * 2;

// Our array of Perlin Generated Values
var numOctaves = 3;
var persistence = 0.15;
var perlinValues;

// The water's radius
var WATER_RADIUS = 200;

var waterDrawCounter = 0;
var waterDrawCounterMax = 3;

// Wave constants
var WAVE_MAX = 2;
var WAVE_MIN = -1;
var WAVE_OFF = 1;

// Offset our array of perlin values
var offset = 0;
var offset2 = 0;
var offset3 = 0;
var maxOffset = numSteps * numSteps;

// The material for the water
var watermaterial;

// The water plane
var plane; // The Geometry
var water; // The mesh
var waterName = "water";

// animation control
var animate = true;

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

function cameraControl(c, ch)
{
  var distance = c.position.length();
  var q, q2;
  
  switch (ch)
  {
  // camera controls
  case 'w':
    c.translateZ(-1);
    return true;
  case 'a':
    c.translateX(-1);
    return true;
  case 's':
    c.translateZ(1);
    return true;
  case 'd':
    c.translateX(1);
    return true;
  case 'r':
    c.translateY(1);
    return true;
  case 'f':
    c.translateY(-1);
    return true;
  case 'j':
    // need to do extrinsic rotation about world y axis, so multiply camera's quaternion
    // on left
    q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0),  5 * Math.PI / 180);
    q2 = new THREE.Quaternion().copy(c.quaternion);
    c.quaternion.copy(q).multiply(q2);
    return true;
  case 'l':
    q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0),  -5 * Math.PI / 180);
    q2 = new THREE.Quaternion().copy(c.quaternion);
    c.quaternion.copy(q).multiply(q2);
    return true;
  case 'i':
    // intrinsic rotation about camera's x-axis
    c.rotateX(5 * Math.PI / 180);
    return true;
  case 'k':
    c.rotateX(-5 * Math.PI / 180);
    return true;
  case 'O':
    c.lookAt(new THREE.Vector3(0, 0, 0));
    return true;
  case 'S':
    c.fov = Math.min(80, c.fov + 5);
    c.updateProjectionMatrix();
    return true;
  case 'W':
    c.fov = Math.max(5, c.fov  - 5);
    c.updateProjectionMatrix();
    return true;

    // alternates for arrow keys
  case 'J':
    //this.orbitLeft(5, distance)
    c.translateZ(-distance);
    q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0),  5 * Math.PI / 180);
    q2 = new THREE.Quaternion().copy(c.quaternion);
    c.quaternion.copy(q).multiply(q2);
    c.translateZ(distance);
    return true;
  case 'L':
    //this.orbitRight(5, distance)  
    c.translateZ(-distance);
    q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0),  -5 * Math.PI / 180);
    q2 = new THREE.Quaternion().copy(c.quaternion);
    c.quaternion.copy(q).multiply(q2);
    c.translateZ(distance);
    return true;
  case 'I':
    //this.orbitUp(5, distance)      
    c.translateZ(-distance);
    c.rotateX(-5 * Math.PI / 180);
    c.translateZ(distance);
    return true;
  case 'K':
    //this.orbitDown(5, distance)  
    c.translateZ(-distance);
    c.rotateX(5 * Math.PI / 180);
    c.translateZ(distance);
    return true;
  case ' ':
	animate = !animate;
	return true;
  }
  return false;
}

function handleKeyPress(event)
{
  var ch = getChar(event);
  if (cameraControl(camera, ch)) return;
}

function draw2(){
	
	var x;
	var z;
	
	for( var i = 0; i < plane.vertices.length; i++ ){
		var x = Math.floor(lerp( 0, numSteps-1, (plane.vertices[i].x + 100 )));
		var y = Math.floor(lerp( 0, numSteps-1, (plane.vertices[i].y + 100 ))); 
		
		var perlinIndex = ((x * numSteps + y) + offset2) % perlinValues.length;
		var zOff = perlinValues[perlinIndex];
		
		var cur = plane.vertices[i].z
		
		var above = cur + WAVE_OFF;
		var below = cur - WAVE_OFF;
		
		if( above > WAVE_MAX ){
			above = WAVE_MAX;
		}
		
		if( below < WAVE_MIN ){
			below = WAVE_MIN;
		}
		
		//var zOffRanged = lerp( -2, 3, zOff)*.1 + plane.vertices[i].z*0.9;
		var zOffRanged;
		if (i > 0) {
			if (i < 150) {
				zOffRanged = ((3*lerp( below, above, zOff)) + plane.vertices[i-1].z)/4;
			}
			else { //+ plane.vertices[i-150].z
				zOffRanged = ((70*lerp( below, above, zOff)) + (25*plane.vertices[i-1].z) + (5*plane.vertices[i-150].z))/100;
				//zOffRanged = ((3*lerp( below, above, zOff)) + plane.vertices[i-1].z)/4;
			}
		}
		else {
			zOffRanged = lerp( below, above, zOff);
		}
		
		plane.vertices[i].setZ(zOffRanged);
		plane.verticesNeedUpdate = true;
		
		
	}
	
	offset2++;
	if( offset2 >= perlinValues.length ){
		offset2 = 0;
	}
}

function draw(){
  
	var waterRGBA = new Uint8Array(numSteps * numSteps * Math.pow(25, 2) * 4);
   
    var index;
   
	for(var i=0; i< waterRGBA.length; i++){
		
		index = (Math.floor(i + offset)) % perlinValues.length;
		
		waterRGBA[4*i] = waterRGBA[4*i + 1] = 0;
		waterRGBA[4*i + 2] = Math.floor(lerp(100,255,perlinValues[index]));
		waterRGBA[4*i + 3] = 255;
	}
	if(waterDataTex != null)
		waterDataTex.dispose();
	waterDataTex = new THREE.DataTexture( waterRGBA, numSteps*25, numSteps*25, THREE.RGBAFormat );
	waterDataTex.needsUpdate = true;
	watermaterial.normalMap = waterDataTex;
	
	
	// Redraw the water
	scene.remove( scene.getObjectByName(waterName) );
	
	var water = new THREE.Mesh( plane, watermaterial );
	water.rotateX(-1.571);
	water.position.set(0, 1, 0);
	water.name = waterName;
	scene.add(water);
	
	
	offset--;
	
	if( offset < 0 ){
		offset = maxOffset;
	}
	/*
	offset++;
	
	if( offset >= maxOffset ){
		offset = 0;
	}*/
}

function start()
{
  // assign camera controls
  window.onkeypress = handleKeyPress;
  
  // the scene
  scene = new THREE.Scene();
  
  // create camera
  camera = new THREE.PerspectiveCamera( 45, 1.5, 0.1, 1000 );
  camera.position.x = 78;
  camera.position.y = 78;
  camera.position.z = 78;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  
  // create a renderer for the scene on the canvas
  var ourCanvas = document.getElementById('theCanvas');
  var renderer = new THREE.WebGLRenderer({canvas: ourCanvas});

  // build the skybox
  
  // load the six images for the skybox
  var ourCubeMap = THREE.ImageUtils.loadTextureCube(imageNames);
  
  // Use a built-in Three.js shader for cube maps
  var cubeMapShader = THREE.ShaderLib["cube"];
  
  // point the shader to our texture
  cubeMapShader.uniforms[ "tCube" ].value = ourCubeMap;
  
  // make a ShaderMaterial using this shader's properties
  var material = new THREE.ShaderMaterial( {
      fragmentShader: cubeMapShader.fragmentShader,
      vertexShader: cubeMapShader.vertexShader,
      uniforms: cubeMapShader.uniforms,
      side: THREE.DoubleSide  // make sure we can see it from outside or inside
  } );

  
  // Make a cube geometry object for the skybox
  //var geometry = new THREE.BoxGeometry(1, 1, 1);
  var geometry = new THREE.SphereGeometry(1, 128, 128);

  // Create a mesh for the object, using the cube shader as the material
  var skybox = new THREE.Mesh( geometry, material );
  // Make the skybox big
  skybox.scale.set(200, 200, 200);
  
  // Add skybox to the scene
  scene.add( skybox );
  
  // Create scene objects
  
  // create a sphere geometry object
  var sphere = new THREE.SphereGeometry(1, 32, 32);
  
  // create island
  // load island texture
  var islandtexture = THREE.ImageUtils.loadTexture("../images/sand.jpg");
  // create sun material
  var islandmaterial = new THREE.MeshLambertMaterial( { map : islandtexture } );
  // create sun object
  var island = new THREE.Mesh( sphere, islandmaterial );
  island.scale.set(20, 20, 10);
  island.rotateX(1.571);

  scene.add(island);
  
  // create water
  //plane = new THREE.CircleGeometry( WATER_RADIUS, 128 );
  plane = new THREE.PlaneGeometry( 200, 200, 150, 150 );
  //var waterimage = THREE.ImageUtils.loadTexture("../images/water.jpg");
  //var watertexture = new THREE.MeshPhongMaterial( {color: 0x00FFFF} );
  //var watermaterial = new THREE.MeshPhongMaterial( {map : watertexture, side: THREE.DoubleSide, transparent : true, opacity : 0.6 } );
  watermaterial = new THREE.MeshPhongMaterial({color : 0xadd8e6, envMap : ourCubeMap, side: THREE.DoubleSide, reflectivity : .5, refractionRatio : 1.333, transparent : true, opacity : 0.6, specular: 0xffffff, shininess: 40});	// refractionRatio : 0.66,  side: THREE.DoubleSide,
  watermaterial.wireframe = false;
  
  
  var water = new THREE.Mesh( plane, watermaterial );
  water.rotateX(-1.571);
  water.position.set(0, 1, 0);
  water.name = waterName;
  scene.add(water);
  
  var square = new THREE.PlaneGeometry( 200, 200 );
  var squarematerial = new THREE.MeshLambertMaterial({color: 0x926239});
  var seafloor = new THREE.Mesh( square, squarematerial );
  seafloor.rotateX(-1.571);
  seafloor.position.set(0, -50, 0);
  scene.add(seafloor);
  
  
  // lights
  // sun
  var directionalLight = new THREE.DirectionalLight( 0xffffff);
  directionalLight.position.set( -1, 1, 1 );
  scene.add( directionalLight );
  
  // var directionalLight2 = new THREE.DirectionalLight( 0xffffff, 0.5);
  // directionalLight2.position.set( 1, 1, 1 );
  // scene.add( directionalLight2 );
  
  // var pointLight = new THREE.PointLight( 0xffffff, 2, 300 );
  // pointLight.position.set( -100, 100, 100 );
  // scene.add(pointLight);
  
  // var spotLight = new THREE.SpotLight( 0xffffff, 1, 300 );
  // spotLight.position.set( 0, 100, 0 );
  // spotLight.target = island;
  // scene.add(spotLight);
  
  // var pointLight2 = new THREE.PointLight( 0xffffff, 0.5, 300 );
  // pointLight2.position.set( 100, 100, -100 );
  // scene.add(pointLight2);
  
  //ambient
  var light = new THREE.AmbientLight( 0x333333 );
  scene.add( light );
	
  // Generate our array of Perlin Values
  perlinValues = getPerlinNoiseArray( DIM, DIM, numSteps, numOctaves, persistence );
  
  draw();
  //draw2();
  
  // Trying to limit the framerate: https://github.com/mrdoob/three.js/issues/642

  var render = function () {
	
	//requestAnimationFrame(render)
	if (animate)
	{
		//draw();
		waterDrawCounter++;
		if( waterDrawCounter == waterDrawCounterMax ){
			draw();
			draw2();
			waterDrawCounter = 0;
		}
	}
	renderer.render(scene, camera);

  };

  setInterval( function(){ 
	requestAnimationFrame(render);
  }, 1000 / 30 );
  
  //render();
}