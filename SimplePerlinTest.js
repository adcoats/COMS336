
var camera;

var WIDTH = 900;
var HEIGHT = 600;

function main(){
	
	/*
	 * Set up the scene and camera.
	 */
	var scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 45, WIDTH / HEIGHT, 1, 1000 );
	camera.position.x = 0;
	camera.position.y = 2;
	camera.position.z = 5;
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	
	var ourCanvas = document.getElementById('theCanvas');
	var renderer = new THREE.WebGLRenderer({canvas: ourCanvas});
	renderer.setClearColor( 0xffa500 );
	
	/*
	 * Set up the lights.
	 */
	// sun
	var directionalLight = new THREE.DirectionalLight( 0xffffff );
	directionalLight.position.set( -1, 1, 1 );
	scene.add( directionalLight );
	
	// ambient
	var light = new THREE.AmbientLight( 0x333333 );
	scene.add( light );
	
	
	var dummyRGBA = new Uint8Array(16 * 16 * 4);
	for(var i=0; i< 16 * 16; i++){
		// RGB from 0 to 255
		dummyRGBA[4*i] = dummyRGBA[4*i + 1] = 0;
		dummyRGBA[4*i + 2] = 255*i/(16*16);
		// OPACITY
		dummyRGBA[4*i + 3] = 255;
	}

	dummyDataTex = new THREE.DataTexture( dummyRGBA, 16, 16, THREE.RGBAFormat );
	dummyDataTex.needsUpdate = true;

	
	
	/*
	 * Adding an object
	 */
	  // Make an object
	var geometry = new THREE.PlaneGeometry(1, 1, 1);
	//var material = new THREE.MeshBasicMaterial( {color: 0x00FaFF} );
	var material = new THREE.MeshPhongMaterial( {color: 0x00aaFF} );
	//var material = new THREE.MeshPhongMaterial( {map: dummyDataTex} );
	material.normalMap = dummyDataTex;
	var plane = new THREE.Mesh( geometry, material );
	plane.scale.set(1, 1, 1);
	  
	// Add it to the scene
	scene.add( plane );
	
	var render = function () {
		requestAnimationFrame( render );
		renderer.render(scene, camera);
	};

	render();
}

