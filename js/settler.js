// settler.js
// Last modified: 2011-03-29 19:21:09
//
// Basically, it's what makes the page work

// Some utility functions
function rand(min, max) {
	// Input cleanup
	if (!max) {
		max = min;
		min = 0;
	}
	console.log('min,max',min,max);
	min = parseInt(min, 10);
	max = parseInt(max, 10);
	console.log('min,max',min,max);

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
		graph = document.getElementById('graph'),
		graphNodes = [],
		li, i;

	for (i = 2; i <= 12; ++i) {
		li = document.createElement('li');
		li.innerHTML = i;
		graphNodes.push(li);
		graph.appendChild(li);
	}

	setInterval(function(){
		graphNodes.forEach(function(node) {
			node.style.height = (rand(0,10) * 10) + '%';
		});
	}, 1000);
}, false);
