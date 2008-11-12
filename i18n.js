$(document).ready(function() {
	if (langpack == undefined) {
		return;
	}

	$('.t').each(function() {
		var text = $(this).text();
		var translation = langpack[text];
		if (translation != undefined) {
			$(this).text(translation);
		}
	});
});
