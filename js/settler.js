// settler.js
// Last modified: 2011-03-29 21:05:43
//
// Basically, it's what makes the page work

// === Helpers that don't *need* to be in the DOM ready
// rand: Simply return a random value in a range
function rand(min, max) {
	// Input cleanup
	if (!max) {
		max = min;
		min = 0;
	}
	min = parseInt(min, 10);
	max = parseInt(max, 10);

	// Sanity checks
	if (isNaN(min)) { throw new Error('rand: Invalid input'); }

	// Calculate and return a random number in our range
	return Math.floor(Math.random() * (max - min)) + min;
} // function rand

// roll: Roll a number of dice with sides as specified
function roll(num, sides) {
	var total = 0, i;

	// Input cleanup
	num = parseInt(num, 10);
	sides = parseInt(sides, 10);

	// Sanity checks
	if (isNaN(num)) { throw new Error('Invalid number of die specified'); }
	if (isNaN(sides)) { throw new Error('Invalid number of sides specified'); }
	if (num < 1) { throw new Error('Need positive number of die'); }
	if (sides < 2) { throw new Error('Need to specify at least two sides'); }

	// Roll the 'die', sum it up, hand it back
	for (i = 0; i < num; ++i) {
		total += rand(1,sides);
	}
	return total;
} // function roll

// DOM Ready check
document.addEventListener('DOMContentLoaded', function(){
	var buttons = document.getElementById('buttons'),
		sim = document.getElementById('sim'),
		simInterval = document.getElementById('simInterval'),
		stats = document.getElementById('stats'),
		average = document.getElementById('average'),
		common = document.getElementById('common'),
		rolls = document.getElementById('rolls'),
		graph = document.getElementById('graph'),
		graphNodes = [],
		scoreCount = [],
		scores = [],
		simInt, node, i;

	// === Helpers!
	// updateVisual: Simply just update DOM nodes as appropriate
	function updateVisual() {
		var averages = [],
			max = 0,
			commonVal, commonCount,
			avg, count, i;

		// Determine our average scores
		for (i = 2; i <= 12; ++i) {
			// See how often that occurs in scores
			count = scores.filter(function(score) { return score == i; }).length;
			avg = count / scores.length;
			if (avg > max) {
				max = avg;
				commonVal = i;
				commonCount = scoreCount[i-2];
			}
			averages.push(avg);
		}

		// Scale our averages by the max,
		// including our scaling up and conversion to pixel string
		averages = averages.map(function(val) {
			return ((val / max) * 150) + 'px';
		});

		// Update the graph
		graphNodes.forEach(function(node, i) {
			// Set a new height
			node.style.height = averages[i];
		});

		// Update the stats
		average.innerHTML = scores.reduce(function(prev, cur) { return prev + cur; }) / scores.length;
		common.innerHTML = commonVal + ' @ ' + commonCount + (commonCount == 1 ? ' roll' : ' rolls');
		rolls.innerHTML = scores.length > 5 ? scores.slice(scores.length - 5): scores;
	} // function updateVisual

	function processScore(value) {
		// Track our scoring
		scores.push(value);
		scoreCount[value-2]++;

		// Update the graph
		updateVisual();
	} // function processScore

	// === Events
	// Simulate rolls
	sim.addEventListener('click', function(e) {
		if (simInt) {
			// Interval is going, disable
			clearInterval(simInt);
			simInt = null;
			sim.innerHTML = 'Simulate Rolls';
		} else {
			// See if we can get an interval value
			var intval = parseInt(simInterval.value, 10);
			if (isNaN(intval)) { throw new Error('Invalid interval specified'); }
			if (intval <= 0) { throw new Error('Interval must be greater than zero'); }

			// Start simulating!
			simInt = setInterval(function(){
				processScore(roll(2,6));
			}, intval);
			sim.innerHTML = 'Stop Simulating';
		}
	}, false);

	// Listen for Score Button clicks
	buttons.addEventListener('click', function(e) {
		var target = e.target, value;

		// Dump out if it's not a button
		if (target.nodeName.toUpperCase() != 'BUTTON') return;

		// Confident that we're a button now,
		// pull the value and process it
		value = parseInt(target.innerHTML, 10);
		processScore(value);
	}, false);

	// === Final Setup
	for (i = 2; i <= 12; ++i) {
		// Set a baseline score
		scoreCount.push(0);

		// Create our graph node
		node = document.createElement('li');
		node.id = 'graph_' + i;
		node.innerHTML = '<span class="text">' + i + '</span>';
		// Position it absolutely:
		// width is 40, so 45 for scalar shifts it over with a 5px buffer
		// The +10 acts like a left margin
		// Then we have to make sure it's in pixels
		node.style.left = ((i - 2) * 45 + 10) + 'px';

		// Add it to our node array, as well as the graph DOM element
		graphNodes.push(node);
		graph.appendChild(node);

		// Create a button
		node = document.createElement('button');
		node.innerHTML = i;
		// Set a class
		// * If 6-8: 'larger'
		// * Else: 'smaller'
		if (i >= 6 && i <= 8) {
			node.className = 'larger';
		} else {
			node.className = 'smaller';
		}

		// Stash it in the buttons container
		buttons.appendChild(node);
	}

	// TESTING AIEEE
	window.scoreCount = scoreCount;
	window.scores = scores;
}, false);
