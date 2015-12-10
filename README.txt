
Arik Coats
Evan Dye

ComS 336
Fall, 2015

Sources:

General References:
These sources were used primarily as resources for understanding Perlin noise and its use in generating surfaces such as water.

-https://tutorialsplay.com/opengl/2014/09/26/lesson-15-water-with-opengl-on-the-gpu-with-glsl/
-http://flafla2.github.io/2014/08/09/perlinnoise.html
-http://freespace.virgin.net/hugo.elias/models/m_perlin.htm (the cosine interpolation function was found here, but ultimately not used).
-https://en.wikipedia.org/wiki/Perlin_noise

Non-Perlin References:

-The THREE.js code for creating and using a DataTexture was directly taken from: http://stackoverflow.com/questions/28188775/generate-texture-from-array-in-threejs.
-Skybox and Camera code were taken from Steve's examples.  The Skybox image was also from Steve's example images.
-The sand image used on the sphere is taken from http://mapdb.obsidianconflict.net/texture:eastern-europe-texture-pack

Perlin Noise References:

-Ken Perlin's code for noise is found here: http://mrl.nyu.edu/~perlin/noise/
	-His 256 value array of values was directly used from this source.
-The previous source and flafla2's breakdown of the code at this site http://flafla2.github.io/2014/08/09/perlinnoise.html were used as the primary sources for implementing Perlin Noise.
	-Much of the code is similar or the same, although it was modified for 2-dimensions rather than 3-dimensions.
-The Wikipedia article:  https://en.wikipedia.org/wiki/Perlin_noise
	-The pseudocode was useful in understanding and adapting the perlin noise to 3-Dimensions.
	-Wikipedia suggested using gradients on the unit circle, although we chose the vectors on our own.
	
See the file perlin.js for more information.
