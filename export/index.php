<?php require_once("../inc/header.php"); ?>
<link href="/export/css/style.css?v=<?=filemtime(__DIR__ . "/css/style.css")?>" rel="stylesheet" type="text/css">
<div class='container-fluid'>
	<div class='row'>
		<div class='col-8 offset-2'>
			<h1>WoW.export</h1>
			<p class="lead">A complete rewrite of <a href='https://marlam.in/obj/'>WoW Export Tools</a> now available</p>
		</div>
	</div>
	<div class='row'>
		<div class='col-8 offset-2'>
			<h4>About</h4>
			<p>The old exporter was hard to maintain and rather unstable when doing certain things (e.g, baking terrain textures). After being repeatedly frustrated by modifying things in that exporter, <a href='https://twitter.com/kruithne' target='_BLANK'>Kruithne</a> set out to build a modern, more maintainable/future-proof and generally better alternative to the currently available version of WoW Export Tools.</p>
		</div>
	</div>
	<div class='row'>
		<div class='col-8 offset-2'>
			<h4>Tutorial</h4>
			<p><a href='CountessBelvane' target='_BLANK'>Belvane</a> made an excellent tutorial on how to install/use WoW.export!<br><a class='btn btn-warning' href='https://www.youtube.com/watch?v=ybcq2C93i2k' target='_BLANK'><i class="fa fa-film"></i> Watch Tutorial</a></p>
		</div>
	</div>
	<div class='row'>
		<div class='col-8 offset-2'>
			<h4>Features</h4>
			<p>All the features you know and love from the old exporter are present, new features include:</p>
			<ul>
				<li>New look based on WoW.tools</li>
				<li>Built-in updater</li>
				<li>Modelviewer with better controls</li>
				<li>Better sound/music player</li>
			</ul>
		</div>
	</div>
	<div class='row'>
		<div class='col-8 offset-2'>
			<p>We feel that this version is now stable enough to stop supporting the old exporter. If you do find any issues, please report them on the <a href='https://github.com/Kruithne/wow.export/issues' target='_BLANK'>issue tracker</a> and/or <a href='https://discord.gg/52mHpxC'>Discord</a>.
			</p>
			<div class='alert alert-danger'>
				<b>Important</b><br>- When setting up, please use a <b>NEW</b> export folder rather than one you used for WoW Export Tools (or other tools) so that in the case of bugs, we're not getting mixed up data.<br>
				- Reinstall the Blender plugin if you have the previous version installed
			</div>
		</div>
	</div>
	<div class='row'>
		<div class='col-8 offset-2'>
			<h4>Download</h4>
			<p>First time installs only, the application has a built-in updater that notifies you when a new version is available.</p>
			<p><a href='https://wow.tools/export/download/win-x64/wow.export-0.1.9.zip' class='btn btn-primary'><i class='fa fa-download'></i> Download v0.1.9</a></p>
			<p>
			<b>Changelog</b></i>
			<?php $changelog = htmlentities(file_get_contents("https://raw.githubusercontent.com/Kruithne/wow.export/master/CHANGELOG.md")); ?>
			<pre><?=$changelog?></pre>
			</p>
		</div>
	</div>
</div>
<?php require_once("../inc/footer.php"); ?>