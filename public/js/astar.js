/*
	The A* algorithm is a heuristic based algorithm which is used to calculate the shortest distance
	between 2 nodes in a graph. Instead of doing a bfs, it uses a smarter approach to find the best possible path

	The way it works is - It calculates the fCost of every node that is in the open list(list of nodes that we have not
	traversed yet). fCost is the sum of gCost(distance of the node from the starting node) and hCost(estimated distance
	of the node from the target node). The hCost is the manhattan distance which means number of moves left or right for
	an element from where its supposed to be in the target node. 

	We also use a heap data structure for the open nodes list since that can be a huge list of nodes if the combination 
	is far away from the targeg. Instead of implementing it myself, i used 3rd party class for binary heap and customized it 
	to my own needs. The keys that the heap data structure uses is the fCost of the node. 

	@author: Nalin Ahuja
 */

;(function() {

	var AStar = function() {

	};

	AStar.fn = AStar.prototype = {

		solve: function() {

			this.openNodes = new BinaryHeap(Node.prototype.compareTo),
			this.closedNodes = {},
			this.current = {};

			//Start with the current node
			this.openNodes.push(puzzle.currentNode);

			while(!$.isEmptyObject(this.openNodes)) {
				
				//Remove the lowest fcost node from the heap
				this.current = this.openNodes.pop();

				//Add it to the closed list
				this.closedNodes[this.current.getKey()] = 1;


				//Check if we have found the path
				if(puzzle.finished(this.current)) {
					return this._getPath(puzzle.currentNode, this.current);
				}
				//Get all neighboring nodes
				var neighbors = puzzle.getCandidateNodes(this.current);

				for(var i =0;i<neighbors.length; i++) {

					//Gcost of the neighbor would be 1 added to that of the current(parent of the neighbor)
					var neighbor = neighbors[i];
						neighbor.gCost = (this.current.gCost || 0) + 1;

					if (this.closedNodes.hasOwnProperty(neighbor.getKey())) {
					 	continue;
					}

					var neighborInOpen = this.openNodes.contains(neighbor);


					if(!neighborInOpen) {
						//Calculate the hCost and set the parent which will help us later in path traversal
						neighbor.hCost = this._mDistance(neighbor, puzzle.targetNode);
						neighbor.parent = this.current;

						//Push to the heap and let it bubble up according to the fCost of the new element
						this.openNodes.push(neighbor);
					}	
				}

			}

		},
		/**
		 * Loops through the parent of node2 and parent of parent of node2 and so on until it 
		 * reaches node1
		 * 
		 * @param  {[node]} node1 destination
		 * @param  {[node]} node2 starting
		 * @return {[array of nodes]}    Reversed array starting from first move needed to be made from initial node
		 */
		_getPath: function(node1, node2) {
			var path = [],
			currentNode = node2;

			while(currentNode.getKey() != node1.getKey()) {
				path.push(currentNode);
				currentNode = currentNode.parent;
			}

			return path.reverse();

		},
		/*
		 * Estimated distance between node1 and node2. Example
		 * 			1	2	3	4
		 *    		5	0	8  12
		 *      	9   6   7  15
		 *      	13  10  14 11
		 *    1-0
		 *    2-0
		 *    3-0
		 *    4-0
		 *    5-0
		 *    0-4
		 *    8-1
		 *    12-1
		 *    9-0
		 *    6-1
		 *    7-1
		 *    15-1
		 *    13-1
		 *    10-1
		 *    14-1
		 *    11-2
		 *    Manhattan distance = 14
		 */
		
		_mDistance: function(node1, node2) {

			var sum = 0;

			for(var i =0; i<node1.order.length; i++) {
				
				var itemNode1 = node1.order[i];

				if(itemNode1 !== 0) {

					for(var j=0; j<node2.order.length; j++) {

						var itemNode2 = node2.order[j];

						if(itemNode1 == itemNode2) {
							var i2D = puzzle.convertIndexto2D(i),
								j2D = puzzle.convertIndexto2D(j);

							sum += Math.abs(i2D[0] - j2D[0]) + Math.abs(i2D[1] - j2D[1]);

						}
					}
				}

			}
			return sum;

		}
	};

	window.AStar = AStar;

})();