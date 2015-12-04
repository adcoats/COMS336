
/*
 * Credit to http://freespace.virgin.net/hugo.elias/models/m_perlin.htm
 */

function interpolate( a, b, x ){
	
	x = ( 1 - cos( x * Math.PI ) ) / 2;
	return ( a*(1-x) + b*x );
}

function getNoise2D( x, y ){
	
		return Math.random();
}

function smoothNoise2D( x, y ){
	
	var corners = ( getNoise2D(x-1,y-1) + getNoise2D(x+1,y-1) + getNoise2D(x-1,y+1) + getNoise(x+1,y+1) ) / 16;
	var sides = ( getNoise2D(x-1,y) + getNoise2D(x+1,y) + getNoise2D(x,y+1) + getNoise(x,y-1) ) / 8;
	var center = getNoise2D( x, y ) / 4;
	
	return corners + sides + center;
}

function interpolatedNoise2D( x, y ){
	
	var int_x = x.parseInt();
	var fractional_x = x - int_x;
	
	var int_y = y.parseInt();
	var fractional_y = y - int_y;
	
	var v1 = smoothNoise2D( int_x, int_y );
	var v2 = smoothNoise2D( int_x + 1, int_y );
	var v3 = smoothNoise2D( int_x, int_y + 1 );
	var v4 = smoothNoise2D( int_x + 1, int_y + 1 );
	
	i1 = interpolate( v1, v2, fractional_x );
	i2 = interpolate( v3, v4, fractional_x );
	
	return interpolate( i1, i2, fractional_y );
}

function getPerlinNoise2D( x, y ){
	
	var total = 0;
	var persistence = 0.5;
	var numOctaves = 4;
	
	for( i = 0; i < numOctaves; i++ ){
		
		var frequency = pow( 2, i );
		var amplitude = pow( persistence, i );
		
		total = total + interpolatedNoise2D( x * frequency, y * frequency ) * amplitude;
	}
	
	return total;
}


function generateDataArray( width, height ){
	
	var toReturn = [];
	var tot = width * height;
	
	for( x = 0; x < width; x++ ){
		for( y = 0; y < height; y++ ){
			toReturn[toReturn.length] = getPerlinNoise( x, y );
		}
	}
	
	return toReturn;
}


