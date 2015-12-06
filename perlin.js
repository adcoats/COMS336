
/*
 * This is Ken Perlin's permutation array/hash from http://mrl.nyu.edu/~perlin/noise/
 */
var permutation = [ 151,160,137,91,90,15,
   131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
   190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
   88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
   77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
   102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
   135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
   5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
   223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
   129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
   251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
   49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
   138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
   ];

var p = [];

//var cycleCount = 0;
//var cycleMax = 255;

var THIRD_PI = Math.PI / 3;
var QUARTER_PI = Math.PI / 4;
var gradients2D = [ [0,1], [0, -1], [1, 0], [-1,0], [ Math.cos(THIRD_PI), Math.sin(THIRD_PI) ], [ -Math.cos(THIRD_PI), Math.sin(THIRD_PI) ], [ Math.cos(THIRD_PI), -Math.sin(THIRD_PI) ],
					[ -Math.cos(THIRD_PI), -Math.sin(THIRD_PI) ], [ Math.cos(QUARTER_PI), Math.sin(QUARTER_PI) ], [ -Math.cos(QUARTER_PI), Math.sin(QUARTER_PI) ], 
					[ Math.cos(QUARTER_PI), -Math.sin(QUARTER_PI) ], [ -Math.cos(QUARTER_PI), -Math.sin(QUARTER_PI) ]];
   
var isInit = false;   
   
/*
 * From http://freespace.virgin.net/hugo.elias/models/m_perlin.htm
 * and seen on many other articles/forums
 */
function coslerp( a, b, x ){
	
	x = ( 1 - Math.cos( x * Math.PI ) ) / 2;
	return ( a*(1-x) + b*x );
}

/*
 * The linear interpolation function from http://flafla2.github.io/2014/08/09/perlinnoise.html
 * and http://mrl.nyu.edu/~perlin/noise/
 */
function lerp( a, b, x ){
	return a + x * (b - a);
}

/*
 * Perlin's fade function 6t^5 - 15t^4 +10t^3 from http://flafla2.github.io/2014/08/09/perlinnoise.html
 * and http://mrl.nyu.edu/~perlin/noise/
 */
function fade( t ){
	
	return t * t * t * (t * (t * 6 - 15) + 10);
}

/*
 * Generating an array with the 256 permutation[] values between 0 and 255 that repeats the array once for a total size of 512.
 * As discussed at http://flafla2.github.io/2014/08/09/perlinnoise.html
 */
function populateRandomValueArray(){
	
	for( var i = 0; i < permutation.length; i++ ){
		p[p.length] = permutation[i];
	}
	
	for( i = 0; i < permutation.length; i++ ){
		p[p.length] = permutation[i];
	}
}

/*
 * Based on the Wikipedia Psuedocode here: https://en.wikipedia.org/wiki/Perlin_noise
 * and the alternate versions of Perlin's algorithm outlined here: http://riven8192.blogspot.com/2010/08/calculate-perlinnoise-twice-as-fast.html
 * and explained in more detail here: http://flafla2.github.io/2014/08/09/perlinnoise.html which cites the above.
 */
function grad( hash, x, y ){
	
	var gradIndex = hash % gradients2D.length;
	
	var dot = ( x*gradients2D[gradIndex][0] + y*gradients2D[gradIndex][1] );
	return dot;
}

/*
 * A 2D version of the algorithm outlined here: http://flafla2.github.io/2014/08/09/perlinnoise.html
 * and by Perlin here: http://mrl.nyu.edu/~perlin/noise/
 */
function perlin( x, y ){
	
	var xi = parseInt(x) % permutation.length;
	var yi = parseInt(y) % permutation.length;
	
	var xf = x - parseInt(x);
	var yf = y - parseInt(y);
	
	var u = fade(xf);
	var v = fade(yf);
	
	//var offset = cycleCount;// % cycleMax;
	var offset = 0;
	/*
	var aa = Math.floor( Math.random() * 255 );
	var ab = Math.floor( Math.random() * 255 );
	var ba = Math.floor( Math.random() * 255 );
	var bb = Math.floor( Math.random() * 255 );
	*/
	
	var aa = p[p[xi  + offset] + yi   + offset];
	var ab = p[p[xi  + offset] + yi+1 + offset];
	var ba = p[p[xi+1+ offset] + yi   + offset];
	var bb = p[p[xi+1+ offset] + yi+1 + offset];
	
	var x0 = lerp( grad(aa, xf, yf), grad(ba, xf, yf), u );
	var x1 = lerp( grad(ab, xf, yf), grad(bb, xf, yf), u );
	
	return ( lerp( x0, x1, v ) +1 )/2;
}

/*
 * A 2D version of the algorithm outlined here: http://flafla2.github.io/2014/08/09/perlinnoise.html
 */
function OctavePerlin( x, y, numOctaves, persistence ){
	
	var total = 0;
	var frequency = 1;
	var amplitude = 1;
	var maxValue = 0;
	
	//var printString = x.toString() + ", " + y.toString();
	//console.log(printString);
	
	for( var i = 0; i < numOctaves; i++ ){
		total += perlin( x * frequency, y * frequency) * amplitude;
		maxValue += amplitude;
		amplitude *= persistence;
		frequency *= 2;
	}
	
	return total/maxValue;
}

function getPerlinNoiseArray( width, height, numSteps, numOctaves, persistence ){
	
	if( !isInit ){
		populateRandomValueArray();
	}
	
	stepSizeX = width / numSteps;
	stepSizeY = height / numSteps;
	
	var arr = [];
	
	for( var i = 0; i < width; i+= stepSizeX ){
		for( var j = 0; j < height; j+=stepSizeY ){
			arr[arr.length] = OctavePerlin( i, j, numOctaves, persistence );
		}
	}
	/*
	cycleCount++;
	
	if( cycleCount == cycleMax ){
		cycleCount = 0;
	}*/
	
	return arr;
}

