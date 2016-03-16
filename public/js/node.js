/**
 *
 * This class is representation of a node. The key of the node is defined by its order and blankIndex. It will be
 * unique for every node. We maintain the blankIndex of the node only for convenience purposes. Instead of traversing 
 * through the array every time, its more optimal to store its index
 *
 * We never set the fCost of the node directly. Always the gCost and hCost. 
 *
 * @author  Nalin Ahuja
 */

;(function() {

	var Node = function(blankIndex, order) {
		this.order = order,
		this.blankIndex = blankIndex,
		this.gCost = 0,
		this.hCost = 0,
		this.parent = {};
	};

	Node.fn = Node.prototype = {

		getFCost: function() {
			return this.gCost + this.hCost;
		},

		/*
		 * Stringify an object that contains the order and blankIndex
		 */
		getKey: function() {
			return JSON.stringify({
					order : this.order,
					blankIndex : this.blankIndex
			});
		},


		/**
		 * fCost is used to compare 2 nodes. The lower the fCost, the higher will be the node
		 * in the heap tree
		 *
		 * If two nodes have the same fCost, we use their hCost to determine which node gets priority
		 * @param  {node} node1 
		 * @param  {node} node2 
		 * @return {int}  -1 if left side has higher priority. 1 if right side has priority
		 */
		compareTo: function(node1, node2) {
			if(node1.getFCost() > node2.getFCost()) {
				return 1;
			}
			else if(node1.getFCost() < node2.getFCost()) {
				return -1;
			}

			if(node1.hCost > node2.hCost) {
				return 1;
			}

			return -1;
		}

	};

	window.Node = Node;

})();