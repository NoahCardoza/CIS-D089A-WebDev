
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="EN" lang="EN">
<head>
<title>Connect to MySQL</title>
<meta Name="Author" Content="Hann So">
</head>
<body>
<p>
<?php

if (isset($_POST['submit'])) {
		process_form();
	}
	else {
		display_form();// display form for the first time
	}

function display_form() {
	echo <<<HTML
	<h2>Connect to MySQL</h2>
	<form action = "$_SERVER[SCRIPT_NAME]" method="post">
	Username:
	<input type="text" name="username" size="50" value="ncardoza" />
	<br />
	Password:
	<input type="password" name="password" size="50" />
	<br />
	<input type="submit" name="submit" value="Submit" />
	</form>
HTML;
}

function process_form() {

	DEFINE ('DB_USER', "$_POST[username]");
	DEFINE ('DB_PASSWORD', "$_POST[password]");
	DEFINE ('DB_HOST', "localhost");

	echo "<p>Opening the connection to the database server.</p>";
	if ($link = mysql_connect(DB_HOST, DB_USER, DB_PASSWORD)) {
		echo "<p>The connection worked. The link is $link</p>";
		mysql_close($link);
	}
	else {
		echo "<p>Could not connect to MySQL.</p>";
	}
	echo "<p><a href=\"$_SERVER[SCRIPT_NAME]\">Try again?</a></p>\n";

}

?>
</p>
</body>
</html>