
Arik Coats
Evan Dye

ComS 336
Fall, 2015

/**********
 * Contents of the Submission
 **********/
 
1. project.htm
	- The file to run the project
2. project.js
	- Source code for the project
3. perlin.js
	- The code to generate Perlin Noise
4. Image Folder
	- Skybox Images
	- Sand Image
5. Libraries
	- Teal Book Libraries
	- Three.js Library
6. PowerPoint Presentation
7. README.txt
	- Read this first!

/**********
 * Running the Demo
 **********/
1. Run a local python server from the project root folder
2. Navigate to the correct localhost port
3. Select project.htm 
	
/**********
 * Sources:
 **********/

General References:
-------------------

These sources were used primarily as resources for understanding Perlin noise and its use in generating surfaces such as water.
-https://tutorialsplay.com/opengl/2014/09/26/lesson-15-water-with-opengl-on-the-gpu-with-glsl/
-http://flafla2.github.io/2014/08/09/perlinnoise.html
-http://freespace.virgin.net/hugo.elias/models/m_perlin.htm (the cosine interpolation function was found here, but ultimately not used).
-https://en.wikipedia.org/wiki/Perlin_noise

Image & Non-Perlin Code References:
----------------------

-The THREE.js code for creating and using a DataTexture was directly taken from: http://stackoverflow.com/questions/28188775/generate-texture-from-array-in-threejs.
-Skybox and Camera code were taken from Steve's examples.  The Skybox image was also from Steve's example images.
-The sand image used on the sphere is taken from http://mapdb.obsidianconflict.net/texture:eastern-europe-texture-pack
-Limiting the framerate: https://github.com/mrdoob/three.js/issues/642
-The noise image used in the PowerPoint was generated using one of our test programs.

Perlin Noise References:
------------------------

-Ken Perlin's code for noise is found here: http://mrl.nyu.edu/~perlin/noise/
	-His 256 value array of values was directly used from this source.
-The previous source and flafla2's breakdown of the code at this site http://flafla2.github.io/2014/08/09/perlinnoise.html were used as the primary sources for implementing Perlin Noise.
	-Much of the code is similar or the same, although it was modified for 2-dimensions rather than 3-dimensions.
-The Wikipedia article:  https://en.wikipedia.org/wiki/Perlin_noise
	-The pseudocode was useful in understanding and adapting the perlin noise to 3-Dimensions.
	-Wikipedia suggested using gradients on the unit circle, although we chose the vectors on our own.
	
See the file perlin.js for more information.

/**********
 * Other Content
 **********/
 To see more tests not included in the submission, you can look at our github: https://github.com/adcoats/COMS336