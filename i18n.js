
function _(str) {
	if (langpack == undefined) {
		return str;
	}

	var t = langpack[str];
	if (t == undefined) {
		return str;
	}
	else {
		return t;
	}
}

$(document).ready(function() {
	$('.t').each(function() {
		var text = $(this).html();
		$(this).html(_(text));
	});
});
