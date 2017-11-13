<html>
	<link href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,700" rel="stylesheet">
	<body style="margin:0;height:100%;color:#C8C8C8;font-family:'Roboto Mono','Courier New',Courier,monospace;" bgcolor="#1E1E1E">
		<table border="0" align="center" cellpadding="46" cellspacing="0" style="width:100%;height:100%px">
			<tbody>
				<tr>
					<td colspan="1" cellpadding="5">
						<center>
							<img src="http://battleofthe.net/logo.png" width="200px;">
						</center>
						<p><span style="font-size:16pt;"><strong>Dear <?echo($_GET['username'])?>,</strong></span></p>
						<p><span style="font-size:11pt;">Thank you for joining us at <a style="text-decoration:underline;color: #aaa" href="http://battleofthe.net"><strong>http://battleofthe.net</strong></a>.</span></p>
						<p><span style="font-size:11pt;">In order to complete your registration, we require you to                             activate your account via the button below:</span></p>
						<br>
						<center>
							<div>
								<!--[if mso]>
									<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="http://battleofthe.net/activation.php?code='.$newActivation.'" style="height:36px;v-text-anchor:middle;width:200px;" arcsize="50%" stroke="f" fillcolor="#666666">
									<w:anchorlock/>
									<center>
								<![endif]-->
								<a href="http://battleofthe.net/activation.php?code='.$newActivation.'"
					 style="background-color:#AAA;border-radius:18px;color:#282828;display:inline-block; font-size:13px;font-weight:bold;line-height:36px;text-align:center;text-decoration:none;width:200px;-webkit-text-size-adjust:none;">Activate my account</a>
								<!--[if mso]>
									</center>
									</v:roundrect>
								<![endif]-->
							</div>
						</center>
						<br>
						<p><span style="font-size:11pt;">If you require any assisstiance or have any questions please do not hesitate to ask us at <strong>support@battleofthe.net</strong>.</span></p>
						<br>
						<center>
							<p><span style="font-size:16pt;"><strong>Kind regards,</strong></span></p>
							<p><span style="font-size:16pt;"><strong>Mac &amp; Paul.</strong></span></p>
						</center>
					</td>        
				</tr>
			</tbody>
		</table>
	</body>
</html>