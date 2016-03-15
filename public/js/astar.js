;(function() {

	var AStar = function() {

	};

	AStar.fn = AStar.prototype = {

		solve: function() {

			this.openNodes = new BinaryHeap(Node.prototype.compareTo),
			this.closedNodes = {},
			this.current = {};

			this.openNodes.push(puzzle.currentNode);

			while(!$.isEmptyObject(this.openNodes)) {
				
				this.current = this.openNodes.pop();

				this.closedNodes[this.current.getKey()] = 1;

				if(this.current.getKey() == puzzle.targetNode.getKey()) {
					return this._getPath(puzzle.currentNode, this.current);
				}

				var neighbors = puzzle.getCandidateNodes(this.current);

				for(var i =0;i<neighbors.length; i++) {

					var neighbor = neighbors[i];

					if (this.closedNodes.hasOwnProperty(neighbor.getKey())) {
					 	continue;
					}

					var neighborInOpen = this.openNodes.contains(neighbor);


					if(!neighborInOpen) {
						neighbor.hCost = this._mDistance(neighbor, puzzle.targetNode);
						neighbor.parent = this.current;
						this.openNodes.push(neighbor);
					}	
				}

			}

		},

		_getPath: function(node1, node2) {
			var path = [],
			currentNode = node2;

			while(currentNode.getKey() != node1.getKey()) {
				path.push(currentNode);
				currentNode = currentNode.parent;
			}

			return path.reverse();

		},

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