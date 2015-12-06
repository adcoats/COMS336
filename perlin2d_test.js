// code adapted from http://freespace.virgin.net/hugo.elias/models/m_perlin.htm

var persistence = 0.25;
var numOctaves = 2;


function noise(x, y)
{
	// var n = x + y * 57;
	// n = Math.pow(n * Math.pow(2, 13), n);
	// n = ( 1.0 - ( (n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0);
	// console.log(n);
	// return n;
	return Math.random();
}

function smoothNoise(x, y)
{
    var corners = ( noise(x-1, y-1) + noise(x+1, y-1) + noise(x-1, y+1) + noise(x+1, y+1) ) / 16;
    var sides   = ( noise(x-1, y)  +noise(x+1, y)  +noise(x, y-1)  +noise(x, y+1) ) /  8;
    var center  =  noise(x, y) / 4;
    return corners + sides + center;
}

function interpolate( a, b, x ){
	
	x = ( 1 - Math.cos( x * Math.PI ) ) / 2;
	return ( a*(1-x) + b*x );
}

function interpolatedNoise(x, y)
{
      integer_X    = Math.floor(x)
      fractional_X = x - integer_X

      integer_Y    = Math.floor(y)
      fractional_Y = y - integer_Y

      v1 = smoothNoise(integer_X,     integer_Y)
      v2 = smoothNoise(integer_X + 1, integer_Y)
      v3 = smoothNoise(integer_X,     integer_Y + 1)
      v4 = smoothNoise(integer_X + 1, integer_Y + 1)

      i1 = interpolate(v1 , v2 , fractional_X)
      i2 = interpolate(v3 , v4 , fractional_X)

      return interpolate(i1 , i2 , fractional_Y)
}

function perlinNoise_2D(x, y)
{
	var total = 0;
	for (var i = 0; i < numOctaves; i++)
	{
		var frequency = Math.pow(2, i);
		var amplitude = Math.pow(persistence, i);
		total += interpolatedNoise(x * frequency, y * frequency) * amplitude;
	}
	return total;
}

// returns an array of perlin noise.
// Meant to be interpreted as a square image
// with dimensions size/2 by size/2.
// e.g size = 1024 produces a 512x512 image.
function getPerlinNoiseArray(size, seed)
{
	var arr = [];
	var x = seed;
	var y = seed;
	for (var i = 0; i < size; i++)
	{
		arr[i] = perlinNoise_2D(x, y);
		x += 0.01;
		y += 0.01;
	}
	return arr;
}







