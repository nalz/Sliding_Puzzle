@extends('layouts.app')
@section('content')
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
	<div class="popup_container">
		<p>Player Name</p>
		<input class="input_text" id="name" type="text" name="Name" alt="Name" placeholder="Nalin" tabindex="1">
		<p>Enter a difficulty level</p>
		<input class="input_text" id="difficulty" type="text" name="Difficulty" alt="Difficulty" placeholder="1-3" tabindex="1">
		<div class="btn_primary" id="start">Start Puzzle</div>
		<p class="error">Some of the fields above were not entered correctly</p>
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
		<div class="btn_primary" id="hint">Hint</div>
		<div class="btn_primary" id="giveup">Give up</div>
	</div>
</div>
@endsection