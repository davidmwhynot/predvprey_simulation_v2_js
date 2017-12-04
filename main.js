// GLOBALS
var running = false;
var ready = false;

// DEFAULTS
let widthDef = 200;
let heightDef = 100;
let numPreyStartDef = 1;
let numPredStartDef = 1;
let frameRateDef = 60;

// CLASSES
class Simulation {
	constructor(width, height, numPreyStart, numPredStart) {
		console.log('in simulation constructor');
		this.numPreyStart = numPreyStart;
		this.numPredStart = numPredStart;
		this.xSize = width;
		this.ySize = height;

		this.board = document.getElementById('board');

		this.running = false;
		this.ready = false;

		this.pop = new Population();
	}
	// BUTTON METHODS - called by the click handlers
	setup() {
		console.log('in simulation setup');
		// check if the simulation is running already or not
		if(this.running) {
			console.log('simulation is running');
		} else {
			console.log('simulation is not running');
			if(this.ready == false) {
				console.log('initializing board');
				this.init();
				this.ready = true;
			}
		}
	}
	step() {
		// console.log('in simulation step');
		// 1 check if the simulation is ready or not
		if(this.ready) {
			//console.log('simulation is intialized');
			// 2 compute the next state for the simulation
			this.compute();
			// 3 render that new state onto the screen TODO: (if the user wants to)
			this.render();
			// 4 compute the statistics for the current state TODO: (if the user wants to)
			// 5 render the statistics on the graph TODO: (if the user wants to)
		} else {
			console.log('simulation is not intialized');
		}
	}
	run() {
		// console.log('in simulation run');
		// TODO: loop compute and render given a conditional
		this.step();
	}
	stop() {
		console.log('in simulation stop');
		// TODO: set a conditional to a value
		clearInterval(this.interval);
	}
	reset() {
		console.log('in simulation reset');
		// clear the board
		this.ready = false;
		this.clear();
		this.pop = new Population();
	}

	// INTERNAL METHODS - called by the button methods, or each other
	init() {
		console.log('in simulation init');
		// 1 setup the board
		this.board.width = this.xSize*4;
		this.board.height = this.ySize*4;
		this.state = this.board.getContext('2d');
		// 2 generate prey
		let i = 0;
		while(i < this.numPreyStart) {
			let x = Math.floor(Math.random()*this.xSize);
			let y = Math.floor(Math.random()*this.ySize);
			if(this.pop.add(new Prey(x, y, 5))) {
				++i;
			}
		}
		console.log('prey');
		console.log(this.pop.prey);
		// 3 generate pred
		let n = 0;
		while(n < this.numPreyStart) {
			let x = Math.floor(Math.random()*this.xSize);
			let y = Math.floor(Math.random()*this.ySize);
			if(this.pop.add(new Pred(x, y, 5))) {
				++n;
			}
		}
		console.log('pred');
		console.log(this.pop.pred);
		// 4 render cells
		this.render();
		this.ready = true;
	}
	compute() {
		// console.log('in simulation compute');
		for(let i = 0; i < this.pop.pred.length; ++i) {
			// console.log('compute loop pred');
			this.pop.pred[i].act(this.pop.giveSurroundings(this.pop.pred[i]));
		}
		for(let i = 0; i < this.pop.prey.length; ++i) {
			// console.log('compute loop prey');
			this.pop.prey[i].act(this.pop.giveSurroundings(this.pop.prey[i]));
		}
	}
	render() {
		// console.log('in simulation render');
		this.clear(); // clear the board
		// this.pop.updateAll();
		for(let i = 0; i < this.pop.pred.length; ++i) {
			this.state.fillStyle = 'red';
			this.state.fillRect(this.pop.pred[i].x*4, this.pop.pred[i].y*4, 4, 4);
		}
		for(let i = 0; i < this.pop.prey.length; ++i) {
			this.state.fillStyle = 'green';
			this.state.fillRect(this.pop.prey[i].x*4, this.pop.prey[i].y*4, 4, 4);
		}
	}

	clear() {
		this.state.clearRect(0, 0, this.board.width, this.board.height);
	}
}

class Population {
	constructor() {
		console.log('in population constructor');
		this.size = 0;

		this.pred = [];
		this.predPos = [];
		this.predXpos = [];
		this.predYpos = [];

		this.prey = [];
		this.preyPos = [];
		this.preyXpos = [];
		this.preyYpos = [];

		this.all = [];
		this.allPos = [];
		this.allXpos = [];
		this.allYpos = [];
	}

	giveSurroundings(c) {
		// console.log('give surroundings');
		let cells = {
			right : {
				pred : -1,
				prey : -1
			},
			down : {
				pred : -1,
				prey : -1
			},
			left : {
				pred : -1,
				prey : -1
			},
			up : {
				pred : -1,
				prey : -1
			}
		}
		let results = [];
		// console.log('widthDef');
		// console.log(widthDef);
		if(c.x < widthDef) {
			// console.log('check right');
			cells.right = {
				pred : this.predXpos.indexOf(c.x + 1),
				prey : this.preyXpos.indexOf(c.x + 1)
			}
		}
		if(c.y < heightDef) {
			// console.log('check down');
			cells.down = {
				pred : this.predYpos.indexOf(c.y + 1),
				prey : this.preyYpos.indexOf(c.y + 1)
			}
		}
		if(c.x > 0) {
			// console.log('check left');
			cells.left = {
				pred : this.predXpos.indexOf(c.x - 1),
				prey : this.preyXpos.indexOf(c.x - 1)
			}
		}
		if(c.y > 0) {
			// console.log('check up');
			cells.up = {
				pred : this.predYpos.indexOf(c.y - 1),
				prey : this.preyYpos.indexOf(c.y - 1)
			}
		}
		if(cells.right.pred != -1) {
			results[0] = this.pred[cells.right.pred];
			console.log('res0 = this.pred[cells.up.pred]');
		} else if(cells.right.prey != -1) {
			results[0] = this.prey[cells.right.prey];
			console.log('this.prey[cells.up.prey]');
		}
		if(cells.down.pred != -1) {
			results[1] = this.pred[cells.down.pred];
			console.log('res1 = this.pred[cells.up.pred]');
		} else if(cells.down.prey != -1) {
			results[1] = this.prey[cells.down.prey];
			console.log('this.prey[cells.up.prey]');
		}
		if(cells.left.pred != -1) {
			results[2] = this.pred[cells.left.pred];
			console.log('res 2 = this.pred[cells.up.pred]');
		} else if(cells.left.prey != -1) {
			results[2] = this.prey[cells.left.prey];
			console.log('this.prey[cells.up.prey]');
		}
		if(cells.up.pred != -1) {
			results[3] = this.pred[cells.up.pred];
			console.log('res3 = this.pred[cells.up.pred]');
		} else if(cells.up.prey != -1) {
			results[3] = this.prey[cells.up.prey];
			console.log('this.prey[cells.up.prey]');
		}

		return results;
	}

	updateAll() {
		for(let i = 0; i < this.pred.length; ++i) {
			this.all.push(this.pred[i]);
		}
		for(let i = 0; i < this.prey.length; ++i) {
			this.all.push(this.prey[i]);
		}
	}

	updateAllXpos() {
		let xArray = [];
		for(let i = 0; i < this.prey.length; ++i) {
			xArray.push(this.prey[i].x);
		}
		for(let i = 0; i < this.pred.length; ++i) {
			xArray.push(this.pred[i].x);
		}
		this.allXpos = xArray;
		return xArray;
	}
	updateAllYpos() {
		let yArray = [];
		for(let i = 0; i < this.prey.length; ++i) {
			yArray.push(this.prey[i].y);
		}
		for(let i = 0; i < this.pred.length; ++i) {
			yArray.push(this.pred[i].y);
		}
		this.allYpos = yArray;
		return yArray;
	}

	getAllPredXpos() {
		let xArray = [];
		for(let i = 0; i < this.pred.length; ++i) {
			xArray.push(this.pred[i].x);
		}
		this.predXpos = xArray;
		return xArray;
	}
	getAllPredYpos() {
		let yArray = [];
		for(let i = 0; i < this.pred.length; ++i) {
			yArray.push(this.pred[i].y);
		}
		this.predYpos = yArray;
		return yArray;
	}

	getAllPreyXpos() {
		let xArray = [];
		for(let i = 0; i < this.prey.length; ++i) {
			xArray.push(this.prey[i].x);
		}
		this.preyXpos = xArray;
		return xArray;
	}
	getAllPreyYpos() {
		let yArray = [];
		for(let i = 0; i < this.prey.length; ++i) {
			yArray.push(this.prey[i].y);
		}
		this.preyYpos = yArray;
		return yArray;
	}

	checkXPos(x) {

	}
	checkYPos(y) {

	}

	sortPreds() {

	}
	sortPrey() {

	}

	add(c) {
		if(c.type == 0) {
			if((this.getAllPreyXpos().indexOf(c.x) == -1)&&(this.getAllPreyYpos().indexOf(c.y) == -1)) {
				this.prey.push(c);
				return true;
			} else {
				return false
			}
		} else if((this.getAllPredXpos().indexOf(c.x) == -1)&&(this.getAllPredYpos().indexOf(c.y) == -1)) {
			this.pred.push(c);
			return true;
		} else {
			return false;
		}
	}


}

class Cell {
	constructor(type, x, y, hp) {
		// console.log('in cell constructor');
		this.type = type; // 0 = prey, 1 = pred
		this.x = x;
		this.y = y;
		this.hp = hp;
	}
	move(s) {
		console.log('move');
		// console.log(s);
		let moved = false;
		while(!moved) {
			console.log('move loop');
			let dir = Math.floor(Math.random()*4);
			// console.log(dir);
			if(!s[dir]) {
				if(dir == 0) {
					this.x += 1;
					moved = true;
				} else if(dir == 1) {
					this.y += 1;
					moved = true;
				} else if(dir == 2) {
					this.x -= 1;
					moved = true;
				} else if(dir == 3) {
					this.y -= 1;
					moved = true;
				}
			}
		}
	}
}

class Prey extends Cell {
	constructor(x, y, hp, intentions) {
		super(0, x, y, hp);

	}
	calculateIntentions() {
		// check the following conditions and execute them in this order of preference
		// is there an available direction?
		//
	}
	act(s) {
		let canMove = false;
		for(let i = 0; i < s.length; ++i) {
			if(s[i]) {
				canMove = true;
			}
		}
		if(canMove) {
			this.move(s);
		}
	}

}

class Pred extends Cell {
	constructor(x, y, hp) {
		super(1, x, y, hp);
	}
	calculateIntentions() {

	}
	act(s) {
		let canMove = false;
		console.log(s);
		for(let i = 0; i < s.length; ++i) {
			if(s[i]) {
				canMove = true;
			}
		}
		if(!s[0]) {
			this.move();
		}
		if(canMove) {
			this.move(s);
		}
	}
}

// MAIN
let simulation = new Simulation(widthDef, heightDef, numPreyStartDef, numPredStartDef);

// CLICK HANDLERS
$(document).on('click', '#btnSetup', function() {
	console.log('btnSetup clicked');
	simulation.setup();
});

$(document).on('click', '#btnStep', function() {
	console.log('btnStep clicked');
	simulation.step();
});

$(document).on('click', '#btnRun', function() {
	console.log('btnRun clicked');
	simulation.interval = setInterval(function() {
		simulation.run()
		},
	100);
});

$(document).on('click', '#btnStop', function() {
	console.log('btnStop clicked');
	simulation.stop();
});

$(document).on('click', '#btnReset', function() {
	console.log('btnStop clicked');
	simulation.reset();
});
