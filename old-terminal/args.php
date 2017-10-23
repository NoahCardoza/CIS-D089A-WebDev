<?

error_reporting(E_ALL);
ini_set('display_errors', 1);


function parse_commands($stdin){
	if (!$stdin) return [];
	$stdin = preg_replace('/\s{2,}/', ' ', trim($stdin)); // input (removes unnecessary whitespace)
	$stdin_len = strlen($stdin);	// input len
	$i = ((int)($stdin[0] == '$'));	// current index (ask, I'll explain)
	$li = $i; 						// last index
	$commands = [];					// commands found
	$args = [];						// args found
	$group = 0;						// group type
	if ($i) {						// (ask, I'll explain)
		array_push($args, '$');
	}
	while ($i < $stdin_len){
		if (($stdin[$i] == ' ' && !$group) || ((substr($stdin, $i-1, 1) == ' '.$group) && $stdin[$i-2] != "\\")){
			array_push($args, substr($stdin, $li, $i++-$li-(bool)$group)); 	// pushes arg ( {-(bool)$group} keeps the quotes out of the args )
			if ($stdin[$i] == '"' || $stdin[$i] == "'"){ 		// if this is a quoted group
				$group = $stdin[$i];							// sets the type of quoted => " || '
				$i++;											// bumps $i to keep the quote out of the arg
			} else {
				$group = 0;										// sets group to false to make sure there are no mix-ups
			}
			$li = $i;											// sets the last index to the current index
		}

		if ($stdin[$i] == ';'){ 								// if we hit a command delimiter
			array_push($args, substr($stdin, $li, $i++-$li-(bool)$group)); 	// push the last arg
			array_push($commands, array(						// push the command
				"cmd"		=> array_shift($args),
				"args"		=> $args,
				"original" 	=> substr($stdin, 0, $i) // me might need this later (the plain text of the original command)
			)); 	
			$commands = array_merge($commands, parse_commands(substr($stdin, $i)));		// passes $stdin (starting at the index after the ;) to it's self to parse again
			return $commands;
			
		}
		$i++;
	}
	
	array_push($args, substr($stdin, $li, $i++-$li-(bool)$group)); 	// handles the last arg
	array_push($commands, array(									// push the command
		"cmd"		=> array_shift($args), 
		"args" 		=> $args, 
		"original"	=> substr($stdin, 0, $i) // me might need this later (the plain text of the original command)
	)); 	
	return $commands;
}


echo(json_encode(parse_commands('$PID = pulse 1.1.1.1; complete $PID; login 1.1.1.1; logs rm last; touch "gotcha bitch.txt"')));

?>