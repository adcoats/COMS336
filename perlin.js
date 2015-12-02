
/*
 * Credit to http://freespace.virgin.net/hugo.elias/models/m_perlin.htm
 */

function cosineInterpolation( a, b, x ){
	
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
