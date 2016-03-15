<?php
use App\Userscore;

$userScores = Userscore::orderBy('score', 'DESC')->get();

?>

@extends('layouts.app')
@section('content')
<div class="scores_table_container">
	<p class="scores_title">Top Scorers</p>
	<table class="scores_table">
		<tr>
			<th>Name</th>
			<th>Score</th>
		</tr>
	<?php $i = 0;?>
	<?php foreach($userScores as $userScore): ?>
		<?php $i++;
			$class = (($i%2) == 0) ? "even" : "odd";
			if($i > 10) {
				break;
			}
 		?>
		<tr class="<?= $class ?>">
		    <td><?= $userScore->name ?></td>
		    <td><?= $userScore->score ?></td>
		  </tr>
	<?php endforeach; ?>
	</table>
</div>
@endsection