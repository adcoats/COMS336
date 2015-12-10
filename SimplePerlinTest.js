
var camera;

var WIDTH = 900;
var HEIGHT = 600;
var DIM = 256;
var numSteps = DIM * 2;

var perlinValues;
var dummyRGBA;
var dummyDataTex;
var scene;
var material;
var plane;
var geometry;

var drawCounter = 0;
var drawCounterMax = 1;

var offset = 0;

function assignPerlinValues(){
	perlinValues = getPerlinNoiseArray( DIM, DIM, numSteps, 2, 1/2 );
}

function draw(){
			
			dummyRGBA = new Uint8Array(numSteps * numSteps * 4);
			for(i=0; i< perlinValues.length; i++){
				
				// var x = i % numSteps;
				// var y = i - (x*numSteps);
				
				// var tmp = x + offset;
				// if( tmp > numSteps-1 ){
					// tmp = 0;
				// }
				
				//var index = tmp * numSteps + y;
				
				var index = (Math.floor(i + offset/2)) % perlinValues.length;
				
				dummyRGBA[4*i] = 0;//Math.floor(lerp(0,0, Math.cos(Math.PI*perlinValues[index])));
				dummyRGBA[4*i + 1] = 0;//Math.floor(lerp(0,0,Math.sin(Math.PI*perlinValues[index])));
				dummyRGBA[4*i + 2] = Math.floor(lerp(0,255,perlinValues[index]));
				dummyRGBA[4*i + 3] = 255;
				
			}

			dummyDataTex = new THREE.DataTexture( dummyRGBA, DIM, DIM, THREE.RGBAFormat );
			dummyDataTex.needsUpdate = true;

			scene.remove( scene.getObjectByName("plane") );
			
			material.normalMap = dummyDataTex;
			var plane = new THREE.Mesh( geometry, material );
			plane.scale.set(1, 1, 1);
			plane.name = "plane";
	  
			// Add it to the scene
			scene.add( plane );
			
			offset++;
			if( offset >= numSteps ){
				offset = 0;
			}
}

function main(){
	
	/*
	 * Set up the scene and camera.
	 */
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 45, WIDTH / HEIGHT, 1, 1000 );
	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 5;
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	
	var ourCanvas = document.getElementById('theCanvas');
	var renderer = new THREE.WebGLRenderer({canvas: ourCanvas});
	renderer.setClearColor( 0xbbbbbb );
	
	/*
	 * Set up the lights.
	 */
	// sun
	var directionalLight = new THREE.DirectionalLight( 0xffffff );
	directionalLight.position.set( -1.5, 1, 1 );
	scene.add( directionalLight );
	
	// ambient
	var light = new THREE.AmbientLight( 0x333333 );
	scene.add( light );
	
	assignPerlinValues();
	
	dummyRGBA = new Uint8Array(numSteps * numSteps * 4);
	for(var i=0; i< perlinValues.length; i++){
		
		dummyRGBA[4*i] = dummyRGBA[4*i + 1] = 0;
		dummyRGBA[4*i + 2] = Math.floor(lerp(0,255,perlinValues[i]));
		dummyRGBA[4*i + 3] = 255;
	}

	dummyDataTex = new THREE.DataTexture( dummyRGBA, DIM, DIM, THREE.RGBAFormat );
	dummyDataTex.needsUpdate = true;

	
	
	/*
	 * Adding an object
	 */
	  // Make an object
	geometry = new THREE.PlaneGeometry(3, 3, 3);
	//var material = new THREE.MeshBasicMaterial( {color: 0x00FaFF} );
	material = new THREE.MeshPhongMaterial( {color: 0x00eeee, shininess: 0.7, specular: 0xfffffff} );
	//var material = new THREE.MeshPhongMaterial( {map: dummyDataTex} );
	material.normalMap = dummyDataTex;
	plane = new THREE.Mesh( geometry, material );
	
	plane.scale.set(1, 1, 1);
	plane.name = "plane";
	  
	// Add it to the scene
	scene.add( plane );
	
	// var render = function () {
		// requestAnimationFrame( render );
		
		// if( drawCounter == drawCounterMax ){
			// draw();
			// drawCounter = 0;
		// }
		// drawCounter++;
			
		// renderer.render(scene, camera);
	// };

	// render();
	
var render = function () {
	
	//requestAnimationFrame(render)
		//draw();
		drawCounter++;
		if( drawCounter == drawCounterMax ){
			//draw();
			drawCounter = 0;
		}
	renderer.render(scene, camera);

  };

  setInterval( function(){ 
	requestAnimationFrame(render);
  }, 1000 / 30 );
}

