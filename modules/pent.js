import {
	Graph,
	scaleIndices,
	intersection
} from './graph.js'

class Pent {
	constructor(root_, type_) {

		this.root = root_;
		this.type = type_;
		this.linkedTo = [];
		this.visited = false;
		this.initChroma()

	}

	initChroma() {
		var vals = {
			'red': [0, 1, 5, 7, 8],
			'green': [0, 2, 5, 7, 9],
			'blue': [0, 4, 5, 7, 11]
		}

		this.chroma = []
		var temp = vals[this.type]
		for (var i = 0; i < temp.length; i++) {
			this.chroma.push((temp[i] + this.root) % 12);
		}

		this.chroma.sort(function(a, b) {
			return a - b
		});
		//console.log('love')

	}

	findYourNeighbors(sets) {
		//console.log(this.chroma)
		//loop through sets, a two dimensional array, and link yourself to those sets that have exactly three chroma in common
		for (var i = 0; i < sets.length; i++) {
			for (var j = 0; j < sets[i].length; j++) {
				if (sets[i][j] != this && sets[i][j]!=null) {
					//console.log(intersection)
					// console.log(intersection(this.chroma, sets[i][j].chroma))
					if (intersection(this.chroma, sets[i][j].chroma) ==3
						&&!containsRuns(this.chroma, sets[i][j].chroma)
						) {
						this.linkedTo.push(sets[i][j])
					}
				}
			}
		}
	}
}


function containsRuns(arr1_, arr2_){
	let arr1 = arr1_;
	let arr2 = arr2_;
	let arr = arr2.concat(arr1)
	let set = new Set(arr)
	arr = Array.from(set).sort(function(a,b){
		return a-b;
	})

	let seq = 0;
	// console.log(arr.sort(function(a, b){
	// 	return a-b
	// }))
	// console.log(arr)
	for(var i = 0;i<arr.length;i++){
		if(arr[(i+1)%arr.length]==((arr[i]+1)%12)){
			// console.log(i)
			seq++;
		} else {
			seq = 0
		}
		if(seq>=2){
			return true
		}
	}
	return false
	//return arr
}
// console.log(containsRuns([11, 0, 4, 6, 7],[11, 3, 4, 6, 10]))



export class PentGraph extends Graph {
	constructor() {
		super()
		this.populate();
		this.link();
	}

	populate() {
		// var self = this;
		//populate all non-symetrical scales
		for (var i = 0; i < 12; i++) {
			this.sets[i][scaleIndices['red']] = new Pent(i, 'red')
			this.sets[i][scaleIndices['green']] = new Pent(i, 'green')
			this.sets[i][scaleIndices['blue']] = new Pent(i, 'blue')
		}
	}

	link() {

		for (var i = 0; i < this.sets.length; i++) {
			for (var j = 0; j < this.sets[i].length; j++) {
				//for every extant pent
				if (this.sets[i][j]) {
					this.sets[i][j].findYourNeighbors(this.sets)
				}

			}
		}


	}

	getPath(array) {
		//return a path that represents the shortest route through the scales contained in array.
		// each scale represented by an object { root: int, type: string}
		// array.forEach(function(s){
		// 	console.log(s.root)
		// })


		var s0 = this.sets[array[0].root][scaleIndices[array[0].type]]
		var s1 = this.sets[array[1].root][scaleIndices[array[1].type]]
		return this.BFS(s0, s1)
	}
}