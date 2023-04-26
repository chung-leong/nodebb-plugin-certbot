<form role="form" class="certbot-settings">
	<div class="row mb-4">
		<div class="col-sm-2 col-12 settings-header">Certificate</div>
		<div class="col-sm-10 col-12">
			<div class="mb-3">
				<label class="form-label" for="names">Domain names</label>
				<input type="text" id="names" name="names" title="Domain names" class="form-control" placeholder="example.net">
			</div>
			<div class="mb-3">
				<label class="form-label" for="email">E-mail address</label>
				<input type="text" id="email" name="email" title="E-mail address" class="form-control" placeholder="contact@example.net">
			</div>
		</div>
	</div>
	<div class="row mb-4">
		<div class="col-sm-2 col-12 settings-header">Redirection</div>
		<div class="col-sm-10 col-12">
			<div class="form-check">
				<input type="checkbox" class="form-check-input" id="redirectHTTP" name="redirectHTTP">
				<label for="redirectHTTP" class="form-check-label">Redirect HTTP to HTTPS</label>
			</div>
			<div class="form-check">
				<input type="checkbox" class="form-check-input" id="redirectOthers" name="redirectOthers">
				<label for="redirectOthers" class="form-check-label">Redirect to first domain name</label>
			</div>
		</div>
	</div>
	<div class="row mb-4">
		<div class="col-sm-2 col-12 settings-header">Output</div>
		<div class="col-sm-10 col-12">
			<pre id="output"></pre>
		</div>
	</div>

</form>

<!-- IMPORT admin/partials/save_button.tpl -->