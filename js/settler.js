// settler.js
// Last modified: 2011-03-29 20:24:16
//
// Basically, it's what makes the page work

// Some utility functions
function rand(min, max) {
	// Input cleanup
	if (!max) {
		max = min;
		min = 0;
	}
	min = parseInt(min, 10);
	max = parseInt(max, 10);

	// Sanity check
	if (isNaN(min)) {
		throw new Error('rand: Invalid input');
	}

	return Math.floor(Math.random() * (max + 1)) + min;
} // rand

// DOM Ready check
document.addEventListener('DOMContentLoaded', function(){
	var buttons = document.getElementById('buttons'),
		stats = document.getElementById('stats'),
		rolls = document.getElementById('rolls'),
		graph = document.getElementById('graph'),
		graphNodes = [],
		scoreCount = [],
		scores = [],
		node, i;

	// === Helpers!
	// updateVisual: Simply just update DOM nodes as appropriate
	function updateVisual() {
		// Update the graph
		graphNodes.forEach(function(node, i) {
			var curScore, count, avg;

			// Determine what curScore this maps to
			curScore = i + 2;

			// See how often that occurs in scores
			count = scores.filter(function(score) { return score == curScore; }).length;
			avg = count / scores.length;

			// Set a new height
			node.style.height = (avg * 150) + 'px';
		});

		// Update the stats
		rolls.innerHTML = scores.length > 5 ? scores.slice(scores.length - 5): scores;
	} // function updateVisual

	// === Events
	// Listen for button clicks
	buttons.addEventListener('click', function(e) {
		var target = e.target, value;

		// Dump out if it's not a button
		if (target.nodeName.toUpperCase() != 'BUTTON') return;

		// Confident that we're a button now, pull some stuff out
		value = parseInt(target.innerHTML, 10);

		// Track our scoring
		scores.push(value);
		scoreCount[value-2]++;

		// Update the graph
		updateVisual();
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
