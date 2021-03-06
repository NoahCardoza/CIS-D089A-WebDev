<!DOCTYPE html>
<html lang="en">
<head>
	<title>CIS 89A: BOT.NET Theme</title>
	<meta charset="utf-8">
	<meta property="og:title" content="BOT.net"/>
	<meta property="og:url" content="http://battleofthe.net/" />
	<meta property="og:image" content="http://battleofthe.net/logo.png"/>
	<meta property="og:description" content="Come win fame and fortune in the hackers arena, the BOT.net!" />
	<meta name="viewport" content="width=device-width,height=device-height,initial-scale=1.0"/>
	<link rel="icon" href="logo.png" type="image/png">
	<link rel="stylesheet" type="text/css" href="fonts/roboto-mono-v5-latin/roboto-mono.css">
	<link rel="stylesheet" type="text/css" href="css/index.css">
	<script src="fonts/webfont.js"></script>
	<script src="js/utils.js"></script>
	<script src="js/api.js"></script>
</head>
<body style="margin-top: 100px;">
	<div class="block-notify">
		<span class="block-x">&times;</span>
		<div class="col-center">
			<div class="block-msg">
				It seems you are not using Chrome... That's unfortunate, due to other browsers' single threaded approach canvas animations are extremely limited and poorly rendered.<br><br><b>The animation has been disabled!</b><br><br>We would encourage you to use <a href="https://www.google.com/chrome/browser/desktop/index.html">Google Chrome</a> instead. As of now it is most supported and used browser world wide. Read <a href="https://en.wikipedia.org/wiki/Usage_share_of_web_browsers">this</a> Wiki article to learn more.
			</div>
		</div>
	</div>
	<header class="nav-bar">
		<div class="nav-inner">
			<a class="nav-link" href="#register">Register</a>
			<a class="nav-link" href="#about">About</a>
			<a class="nav-link" href="#updates">Updates</a>
			<a class="nav-link" href="#contact">Contact</a>
			<a class="nav-link" href="ranking.html">Other</a>
			<!-- <a class="nav-link disabled" href="#disabled">Login</a> -->
			<!-- <a class="nav-link" href="plan.html">CIS Plan</a> -->
		</div>
	</header>
	<section class="col-center">
		<div class="block-msg-md block-center">
			<h1>CIS 89A: BOT.NET Theme</h1>
		</div>
		<div class="block-msg-md block-center" id="register-block">
			<span class="anchor" id="register"></span>
			<h2>Register</h2>
			<p>I guess this is where you will be able to signup to our spam?</p>
			<div class="inner">
				<span class="anchor" id="register"></span>
				<img src="logo.png" alt="Logo" id="logo" class="hidden">
				<div style="width: 100%;">
					<input class="hidden" type="text" name="username" placeholder="Username:">
					<input class="hidden" type="email" name="email" placeholder="Email:">
					<input class="hidden" type="password" name="password" placeholder="Password:">
					<button id="btn-register">Register</button>
					<!-- <button id="btn-login">Login</button> -->
				</div>
			</div>
		</div>
		<div class="block-msg-md">
			<h1 class="block-center">Join us on <a href="https://discord.gg/eHySDKq">Discord</a></h1>
			<iframe style="width: 100%; height: 40vh" src="https://discordapp.com/widget?id=360140003180806145&theme=dark" allowtransparency="true" frameborder="0"></iframe>
		</div>	
		<div class="block-msg-md">
			<span class="anchor" id="about"></span>
			<h2 class="block-center">About</h2>
			<p><b>Battle of the Net</b> is a game I and a friend came up with. The goal of the game is to <i>hack</i> other players, gain money, to  reputation in the hacker underworld.<br>When all is done we plan to feature an in-game <b>Terminal</b> where most of the game will be played. While quite unrealistic, we aim to bring the most practical experience yet. We hope that this game will educate its players teaching them the basics of the <b>UNIX OS</b> and dangers of malicious users.</p>
		</div>
		<div class="block-msg-md">
			<span class="anchor" id="updates"></span>
			<h2 class="block-center">Updates</h2>
			<article class="block-update">
				<div class="block-title"><span class="lable-success float-right">10-21-17</span><h3>Server Back Online</h3></div>
				<p>We fixed our oopsy!</p>
			</article>
			<article class="block-update">
				<div class="block-title"><span class="lable-error float-right">10-21-17</span><h3>Server Failure</h3></div>
				<p>We did an oopsy!</p>
			</article>
			<article class="block-update">
				<div class="block-title"><span class="lable-warning float-right">10-21-17</span><h3>Server Failure</h3></div>
				<p>Warning! We are about to make an oopsy daisy!</p>
			</article>
			<article class="block-update">
				<div class="block-title"><span class="lable-info float-right">10-20-17</span><h3>This Is The Title</h3></div>
				<p>So, basically, this is where the body of our update will go.
				it looked better on paper...</p>
			</article>
		</div>
		<div class="block-msg-md">
			<span class="anchor" id="contact"></span>
			<h2 class="block-center">Contact</h2>
			<p>If you have any concerns, comments, or death threats, those go here.</p>
			<form id="userinput" style="width: 100%;" method="POST" action="http://battleofthe.net">
				<input type="email" name="email" placeholder="Email (optional)">
				<textarea name="msg" class="msg-input" placeholder="Type your heart out!"></textarea>
				<input type="submit" value="Submit">
			</form>
		</div>
		<footer>
			<div class="block-msg-md block-center">&copy; Galc-tech, 2016. All rights reserved.</div>
		</footer>

	</section>
	<canvas></canvas>
	<script src="js/notificationcenter.js"></script>
	<script src="js/landingpage.js"></script>
	<script src="js/canvas.js" type="text/javascript"></script>
</body>
</html>
