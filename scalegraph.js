function Scale(root_, type_) {

	this.root = root_;
	this.type = type_;
	this.linkedTo = [];

	//for searching
	this.parent = null;
	this.parents = [];
	this.visited = false;
	this.initChroma()
}

// Scale.prototype.addParent = function(node){
// 	if(node.level==this.level){
// 		return;
// 	}
// 	this.parents.push(node);
// 	this.level=node.level+1;
// }

Scale.prototype.initChroma = function() {
	var vals = {
		'dia':[0, 2, 4, 5, 7, 9, 11],
		'ac':[0, 2, 4, 6, 7, 9, 10],
		'HM':[0, 2, 4, 5, 7, 8, 11],
		'hm':[0, 2, 3, 5, 7, 8, 11],
		'hex':[0, 3, 4, 7, 8, 11],
		'oct':[0, 1, 3, 4, 6, 7, 9, 10],
		'wt':[0, 2, 4, 6, 8, 10]

	}

	this.chroma = []
	var temp = vals[this.type]
	for(var i = 0; i <temp.length; i++){
		this.chroma.push((temp[i]+this.root)%12);
	}

	this.chroma.sort(function(a, b){return a-b});
	//console.log('love')
}

var scaleIndices = { //for reference.... 
	'dia': 0,
	'ac': 1,
	'HM': 2,
	'hm': 3,
	'hex': 4,
	'wt': 5,
	'oct': 6,
}

function Graph() {
	var self = this;
	//scales are stored as a two dimensional array. Is this a good idea? Time will tell. 
	this.sets = []
	for (var i = 0; i < 12; i++) {
		this.sets[i] = new Array(7).fill(null) // a new array with room to hold all scales types
	}


	this.populate = function() {
		//populate all non-symetrical scales
		for (var i = 0; i < 12; i++) {
			self.sets[i][scaleIndices['dia']] = new Scale(i, 'dia')
			self.sets[i][scaleIndices['ac']] = new Scale(i, 'ac')
			self.sets[i][scaleIndices['HM']] = new Scale(i, 'HM')
			self.sets[i][scaleIndices['hm']] = new Scale(i, 'hm')
		}
		//hexatonic has 4 transpositions
		for (var i = 0; i < 4; i++) {
			self.sets[i][scaleIndices['hex']] = new Scale(i, 'hex')
		}
		//octatonic has 3 transpositions
		for (var i = 0; i < 3; i++) {
			self.sets[i][scaleIndices['oct']] = new Scale(i, 'oct')
		}
		//whole tone has 2 transpositions
		for (var i = 0; i < 2; i++) {
			self.sets[i][scaleIndices['wt']] = new Scale(i, 'wt')
		}
	}

	this.link = function() {

		//first, all the non-symetrical scales (all those with 12 distinct transpositions)
		for (var i = 0; i < 12; i++) {

			/*
				diatonic
			*/

			var current = self.sets[i][scaleIndices['dia']];
			//diatonic self reference: everything diatonic a fifth above or below
			current.linkedTo.push(self.sets[(i + 7) % 12][scaleIndices['dia']]);
			current.linkedTo.push(self.sets[(i + 5) % 12][scaleIndices['dia']]);
			//one possible connection to a HM scale, its parallel
			var parallelHM = self.sets[i][scaleIndices['HM']];
			current.linkedTo.push(parallelHM);
			parallelHM.linkedTo.push(current);
			//one possible connection to a hm scale, its relative
			var relativehm = self.sets[(i + 9) % 12][scaleIndices['hm']];
			current.linkedTo.push(relativehm);
			relativehm.linkedTo.push(current);
			//two possible connections to an acoustic scale : a fourth above or fourth below
			var fourthAbove = self.sets[(i + 5) % 12][scaleIndices['ac']];
			var fourthBelow = self.sets[(i + 7) % 12][scaleIndices['ac']]
			current.linkedTo.push(fourthAbove);
			current.linkedTo.push(fourthBelow);
			fourthAbove.linkedTo.push(current);
			fourthBelow.linkedTo.push(current)

			/*
				Harmonic Major
			*/

			var current = self.sets[i][scaleIndices['HM']];
			//one connection to parallel harmonic minor
			var parallelhm = self.sets[i][scaleIndices['hm']];
			current.linkedTo.push(parallelhm);
			parallelhm.linkedTo.push(current);
			//one connection to an acoustic that lies a whole step below
			var wholestepac = self.sets[(i + 10) % 12][scaleIndices['ac']];
			current.linkedTo.push(wholestepac);
			wholestepac.linkedTo.push(current);
			//one connection to an octatonic that lies a whole step below, mod 3 because there are only 3 distinct octatonics
			var wholestepoct = self.sets[(i + 10) % 3][scaleIndices['oct']];
			current.linkedTo.push(wholestepoct);
			//one connection to a parallel hexatonic, mod 4.  because there are only 4 distinct hexatonics
			var parallelhex = self.sets[i % 4][scaleIndices['hex']];
			current.linkedTo.push(parallelhex);


			/* 
				harmonic minor
			*/

			var current = self.sets[i][scaleIndices['hm']];
			//one connection to an acoustic that lies a fourth above
			var fourthAbove = self.sets[(i + 5) % 12][scaleIndices['ac']];
			current.linkedTo.push(fourthAbove);
			fourthAbove.linkedTo.push(current);
			//one connection to an octatonic that lies a perfect fourth above, mod 3 because there are only 3 distinct octatonics
			var fourthAbove = self.sets[(i + 5) % 3][scaleIndices['oct']];
			current.linkedTo.push(fourthAbove);
			//one connection to a parallel hexatonic, mod 4.  because there are only 4 distinct hexatonics
			var parallelhex = self.sets[i % 4][scaleIndices['hex']];
			current.linkedTo.push(parallelhex)

			/* 
				acoustic
				connections to diatonic and hm/HM were taken care of in their respective sections
			*/
			var current = self.sets[i][scaleIndices['ac']];
			//one connection to a parallel whole tone (mod 2 because there are only 2 distinct whole tone roms)
			var parallelwt = self.sets[i % 2][scaleIndices['wt']];
			current.linkedTo.push(parallelwt);
			//one connection to a parallel octatonic (mod 3 because there are only 3 distinct octatonics)
			var paralleloct = self.sets[i % 3][scaleIndices['oct']];
			current.linkedTo.push(paralleloct);

		}

		//two distinct whole tones
		for (var i = 0; i < 2; i++) {
			var current = self.sets[i][scaleIndices['wt']];
			//six connections to acoustic scales parallel to each of its tones (j*2 gives whole tones)
			for (var j = 0; j < 6; j++) {
				var acoustic = self.sets[i + (j * 2)][scaleIndices['ac']];
				current.linkedTo.push(acoustic)
			}
		}

		//three distinct octatonics
		for (var i = 0; i < 3; i++) {
			var current = self.sets[i][scaleIndices['oct']];
			//four connections to parallel acoustic scales 
			for (var j = 0; j < 4; j++) {
				var acoustic = self.sets[i + (j * 3)][scaleIndices['ac']]
				current.linkedTo.push(acoustic)
			}
			//four connections to hm scales, each a fifth above the transpositional root
			for (var j = 0; j < 4; j++) {
				var hm = self.sets[(i + 7 + (j * 3)) % 12][scaleIndices['hm']]
				current.linkedTo.push(hm)
			}
			//four connections to HM scales, each a whole step above the transpositional root
			for (var j = 0; j < 4; j++) {
				var HM = self.sets[(i + 2 + (j * 3)) % 12][scaleIndices['HM']]
				current.linkedTo.push(HM)
			}
		}

		//four distinct hexatonics
		for (var i = 0; i < 4; i++) {
			var current = self.sets[i][scaleIndices['hex']];
			//3 connections to parallel hm
			for (var j = 0; j < 3; j++) {
				var hm = self.sets[(i + (j * 4)) % 12][scaleIndices['hm']]
				current.linkedTo.push(hm)
			}
			//3 connections to parallel HM
			for (var j = 0; j < 3; j++) {
				var HM = self.sets[(i + (j * 4)) % 12][scaleIndices['HM']]
				current.linkedTo.push(HM)
			}
		}


	}



	this.populate()
	this.link()
}



// Graph.prototype.BFS = function(start_, end_) {
// 	//return an array of chords that represents the shortest path between two chords.
// 	var start = start_;
// 	var end = end_;
// 	var queue = [];
// 	start.visited = true;
// 	queue.push(start)
// 	while (queue.length > 0) {
// 		var current = queue.shift()
// 		if (current == end) {
// 			//found it
// 			break;
// 		}
// 		var linkedTo = current.linkedTo;
// 		for (var i = 0; i < linkedTo.length; i++) {
// 			var neighbor = linkedTo[i];
// 			if (!neighbor.visited) {
// 				neighbor.visited = true;
// 				neighbor.parent = current;
// 				queue.push(neighbor)

// 			}
// 		}
// 	}



// 	var path = []
// 	path.push(end)
// 	var next = end.parent;
// 	while (next != null) {
// 		path.push(next);
// 		next = next.parent;
// 	}

// 	//null out all the parents and visited
// 	this.sets.forEach(function(c) {
// 		c.forEach(function(s){
// 			if(s){
// 				s.parent=null;
// 				s.visited=null;
// 			}

// 		})
// 		// c.parent = null;
// 		// c.visited = false;
// 	})


// 	return path.reverse()

// }

// Graph.prototype.dfs = function(end, result, path){
// 	path.unshift(end);
// 	if(end.parents.length==0){
// 		//base case
// 		result.push(path);
// 		return
// 	}
// 	end.parents.forEach((p) => {
		
// 			this.dfs(p, result, path)
		
// 	})
// 	// for(var i = 0; i<end.parents.length; i++){
// 	// 	this.dfs(end.parents[i], result, path)
// 	// }

// 	path.shift();


// }


Graph.prototype.MBFS = function(start_, end_) {
	//return an array of arrays of chords that represents the shortest path between two chords.
	// the difference between this method and BFS is that this retrieves all possible shortest paths instead of the path found first. 
	this.sets.forEach(function(c) {
		c.forEach(function(s){
			if(s){
				s.parent=null;
				s.visited=null;
				s.parents = [];
				s.level=Infinity;
			}

		})
		// c.parent = null;
		// c.visited = false;
	})


	var start = start_;
	var end = end_;
	var queue = [];
	start.visited = true;
	start.level=0;
	queue.push(start)

	//first rank them
	while (queue.length > 0) {
		var current = queue.shift()
		if (current == end) {
			//found it
			break;
		}
		var linkedTo = current.linkedTo;
		for (var i = 0; i < linkedTo.length; i++) {
			var neighbor = linkedTo[i];
			if (!neighbor.visited) {
				//neighbor.visited = true;
				
				if(neighbor.level>current.level){
					neighbor.level = current.level+1;
					//neighbor.parents.push(current);
					queue.push(neighbor)
				}
				
			}
		}
		current.visited=true;
	}
	

	// this.sets.forEach(function(c) {
	// 	c.forEach(function(s){
	// 		if(s){
	// 			console.log(s.level)
	// 		}

	// 	})
	// 	// c.parent = null;
	// 	// c.visited = false;
	// })

	var result = []
	//this.getMultiPath(end, result, [])

	this.buildPaths(end, result, []);
	return result;

	// var result = []
	// this.dfs(end, result, []);
	// return result;


}

Graph.prototype.buildPaths=function(end, result, path){
	path.push(end)
	if(end.level==0){
		result.push(path.reverse())
		return
	}
	for(var i = 0; i<end.linkedTo.length;i++){
		if(end.linkedTo[i].level==end.level-1){
			this.buildPaths(end.linkedTo[i], result, path.slice())
		}
	}


	// while(end.level>0){
	// 	end.linkedTo.sort(function(a,b) {return (a.level > b.level) ? 1 : ((b.level > a.level) ? -1 : 0);} );
	// 	path.push(end);
	// 	console.log(end.level)
	// 	end = end.linkedTo[0];
	// }
	// return path;
}

// Graph.prototype.getMultiPath= function(end, result, path) {
// 	path.push(end)
// 	if(end.parents.length==0){
// 		result.push(path)
// 		return
// 	}
// 	for(var i = 0; i<end.parents.length; i++){
// 		if(end.parents[i].level<end.level){
// 			this.getMultiPath(end.parents[i], result, path)
// 		}
		
// 	}

// }



Graph.prototype.getPath = function(array) {
	//return a path that represents the shortest route through the scales contained in array.
	// each scale represented by an object { root: int, type: string}
	// array.forEach(function(s){
	// 	console.log(s.root)
	// })

	//check modulo
	array.forEach(function(s) {
		switch (s.type) {
			case 'hex':
				s.root = s.root % 4;
				break;
			case 'oct':
				s.root = s.root % 3;
				break;
			case 'wt':
				s.root = s.root % 2;
				break;
		}
	})

	var s0 = this.sets[array[0].root][scaleIndices[array[0].type]]
	var s1 = this.sets[array[1].root][scaleIndices[array[1].type]]
	return this.MBFS(s0, s1)
}


// g = new Graph()
// s1 = g.sets[0][0]
// // s2 = g.sets[1][6]
// console.log(s1)
// console.log(s2)
// console.log(g.getPath(s1, s2))