<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

class UserScoreController extends Controller
{
    /**
     * Store the user score
     *
     * @param  string 	name
     * @param  int  	$difficulty
     * @param  int  	$moves
     * @return Response
     */
    public function store($name, $difficulty, $moves)
    {
        //
        //
        print_r($name);
        print_r($difficulty);
        print_r($moves);
    }
}
