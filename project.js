
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
		
var axis = 'z';
var paused = false;
var camera;


// object data

var islanddummy;


// animation control
var animate = true;

var move = 0.01;

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
    c.translateZ(-0.3);
    return true;
  case 'a':
    c.translateX(-0.3);
    return true;
  case 's':
    c.translateZ(0.3);
    return true;
  case 'd':
    c.translateX(0.3);
    return true;
  case 'r':
    c.translateY(0.3);
    return true;
  case 'f':
    c.translateY(-0.3);
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

function start()
{
  // assign camera controls
  window.onkeypress = handleKeyPress;
  
  // the scene
  var scene = new THREE.Scene();
  
  // create camera
  camera = new THREE.PerspectiveCamera( 45, 1.5, 0.1, 1000 );
  camera.position.x = 78;
  camera.position.y = 60;
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
  var plane = new THREE.CircleGeometry( 200, 128 );
  var watertexture = THREE.ImageUtils.loadTexture("../images/water.jpg");
  //var watermaterial = new THREE.MeshPhongMaterial( {map : watertexture, side: THREE.DoubleSide, transparent : true, opacity : 0.6 } );
  var watermaterial = new THREE.MeshPhongMaterial({color : 0xadd8e6, envMap : ourCubeMap, side: THREE.DoubleSide, reflectivity : .75, refractionRatio : 1.333, transparent : true, opacity : 0.6});	// refractionRatio : 0.66,  side: THREE.DoubleSide,
  watermaterial.wireframe = false;
  var water = new THREE.Mesh( plane, watermaterial );
  water.rotateX(-1.571);
  water.position.set(0, 1, 0);
  scene.add(water);
  
  // lights
  
  // sun
  var directionalLight = new THREE.DirectionalLight( 0xffffff );
  directionalLight.position.set( -1, 1, 1 );
  scene.add( directionalLight );
  
  // ambient
  var light = new THREE.AmbientLight( 0x333333 );
  scene.add( light );
	
  // construct hierarchy
  
  
  

  var render = function () {
    requestAnimationFrame( render );
	if (animate)
	{
		// add animation
	}
	renderer.render(scene, camera);
  };

  render();
}