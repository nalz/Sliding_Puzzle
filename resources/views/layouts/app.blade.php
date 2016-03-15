<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Sliding Puzzle</title>
        <link href='https://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>
        <link rel="stylesheet" href="https://necolas.github.io/normalize.css/3.0.3/normalize.css" type="text/css">
        <link rel="stylesheet" href="{{ asset('css/main.css') }}" type="text/css">
    </head>
    <body>
        @yield('content')
        <script src="http://code.jquery.com/jquery-1.12.0.min.js"></script>
        <script type="text/javascript" src="{{ asset('js/heap.js') }}"></script>
        <script type="text/javascript" src="{{ asset('js/node.js') }}"></script>
        <script type="text/javascript" src="{{ asset('js/puzzle.js') }}"></script>
        <script type="text/javascript" src="{{ asset('js/astar.js') }}"></script>
    </body>
</html>