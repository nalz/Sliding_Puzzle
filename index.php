<html>
	<head>
		<title>Sliding Puzzle</title>
		<link href='https://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>
		<link rel="stylesheet" href="https://necolas.github.io/normalize.css/3.0.3/normalize.css" type="text/css">
		<link rel="stylesheet" href="css/main.css" type="text/css">
	</head>
	<body>
		<div id="puzzle_container">
			<div class="loading">
			  <div class="loading_inner">
			    <label>&#8226;</label>
			    <label>&#8226;</label>
			    <label>&#8226;</label>
			    <label>&#8226;</label>
			    <label>&#8226;</label>
			    <label>&#8226;</label>
			  </div>
			</div>
			<div id="grid">
				<div id="row_0">
					<div id="grid_1" class="grid_item text pos_0"><span>1</span></div><!--
					--><div id="grid_2" class="grid_item text pos_1"><span>2</span></div><!--
					--><div id="grid_3" class="grid_item text pos_2"><span>3</span></div><!--
					--><div id="grid_4" class="grid_item text pos_3"><span>4</span></div>
				</div>
				<div id="row_1">
					<div id="grid_5" class="grid_item text pos_4"><span>5</span></div><!--
					--><div id="grid_6" class="grid_item text pos_5"><span>6</span></div><!--
					--><div id="grid_7" class="grid_item text pos_6"><span>7</span></div><!--
					--><div id="grid_8" class="grid_item text pos_7"><span>8</span></div>
				</div>
				<div id="row_2">
					<div id="grid_9" class="grid_item text pos_8"><span>9</span></div><!--
					--><div id="grid_10" class="grid_item text pos_9"><span>10</span></div><!--
					--><div id="grid_11" class="grid_item text pos_10"><span>11</span></div><!--
					--><div id="grid_12" class="grid_item text pos_11"><span>12</span></div>
				</div>
				<div id="row_3">
					<div id="grid_13" class="grid_item text pos_12"><span>13</span></div><!--
					--><div id="grid_14" class="grid_item text pos_13"><span>14</span></div><!--
					--><div id="grid_15" class="grid_item text pos_14"><span>15</span></div><!--
					--><div id="grid_0" class="grid_item text blank pos_15"><span></span></div>
				</div>
			</div>
			<div id="actions">
				<div class="btn_primary" id="reset">Reset</div>
				<div class="btn_primary" id="shuffle">Shuffle</div>
				<div class="btn_primary" id="hint">Hint</div>
				<div class="btn_primary" id="giveup">Give up</div>
				<div class="btn_primary" id="change">Change</div>
			</div>
		</div>
		<script src="http://code.jquery.com/jquery-1.12.0.min.js"></script>
		<script type="text/javascript" src="js/vkThread.js"></script>
		<script type="text/javascript" src="js/heap.js"></script>
		<script type="text/javascript" src="js/node.js"></script>
		<script type="text/javascript" src="js/puzzle.js"></script>
		<script type="text/javascript" src="js/astar.js"></script>
		
	</body>
</html>