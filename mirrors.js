
$(document).ready(function() {
	$('#overlay').show();

	init();
});

function init() {
	loadData();
}

var data = null;
var mirrors = null;

var mcountry = null;
var mprovider = null;

var default_mirror = null;


function loadData() {
	$.getJSON("data/data.json", function(d) {
		data = d;
		loadReleases();
		loadComponents();
		loadExtra();
		loadMirrorsData(data.mirrors_data);
	});
}

function loadReleases() {
	$('#release').empty();
	$.each(data.releases, function(k, val) {
		var code = val.code;
		var label = data.dist + ' ' + val.ver + ' ' + val.name;
		var selected = "";
		if (val.latest == 1) {
			selected = ' selected="selected"';
		}

		$('#release').append('<option value="'+code+'"'+selected+'">'+label+'</option>');
	});
}

function loadComponents() {
	$('#component').empty();
	for (var code in data.components) {
		var label = data.components[code].label;
		var selected = data.components[code].selected;

		var checked;
		if (selected == 1) {
			 checked = ' checked="checked"';
		}

		$('#component').append('<li><input type="checkbox" value="'+code+'"'+checked+'/><span class="t">'+label+'</span></li>');

	}
}

function loadExtra() {
	$('#extra').empty();
	for (var code in data.extra) {
		var label = data.extra[code].label;
		var selected = data.extra[code].selected;

		var checked;
		if (selected == 1) {
			 checked = ' checked="checked"';
		}

		$('#extra').append('<li><input type="checkbox" value="'+code+'"'+checked+'/><span class="t">'+label+'</span></li>');

	}
}

function loadMirrorsData(data_file) {
	$.getJSON(data_file, function(d) {
		mirrors = d;
		loadMirrors();
	});
}

function loadMirrors() {
	$('#country').empty();
	$('#country').append("<option value='+main'>main repository</option>");
	$('#country').append("<option value='+other'>other..</option>");

	$('#country').append('<optgroup label="Countries"></optgroup>');
	var cc = $('#country').find('optgroup');

	$.each(mirrors.mirrors, function(key, val) {
		cc.append("<option value='"+key+"'>"+key+"</option>");
	});
	updateProviders();

	$('#overlay').hide();

	$('#country').change(function() {
		updateProviders();
	});

	$('#provider').change(function() {
		updateProtocols();
	});

	for (var key in data.main_mirrors) {
		default_mirror = data.main_mirrors[key];
		break;
	}

	$('#othermirror').val(default_mirror);
	$('span.othermirror strong').text(default_mirror);
	$('span.othermirror strong').click(function() {
		$('#othermirror').val(default_mirror);
		$('#othermirror').select();
	});
}

function updateProviders() {
	var country = $('#country').val();

	$('p.othermirror').hide();
	$('p.protocol').show();
	$('p.provider').show();

	if (country == "+main") {
		$('p.provider').hide();
		updateProtocols(data.main_mirrors);
		return;
	}
	else if (country == "+other") {
		$('p.provider').hide();
		$('p.protocol').hide();
		$('p.othermirror').show();
		$('#othermirror').focus();
		$('#othermirror').select();
	}

	mcountry = mirrors.mirrors[country];

	$('#provider').empty();
	$.each(mcountry.mirrors, function(key, val) {
		var url = val.mirrors.http;
		if (url == undefined) {
			url = val.mirrors.ftp;
		}
		$('#provider').append("<option value='"+key+"'>"+key+"</option>");
	});

	updateProtocols();

}

function updateProtocols(data) {
	
	if (data == undefined) {
		var name = $('#provider').val();
		mprovider = mcountry.mirrors[name];
		data = mprovider.mirrors;
	}

	$('#protocol').empty();
	$.each(data, function(protocol, url) {
		$('#protocol').append('<option value="'+url+'">'+protocol+'</option>');
	});

}

function generate() {

	var release = $('#release').val();
	
	var base = $('#protocol').val();
	if ($('#country').val() == "+other") {
		base = $('#othermirror').val();
	}

	var ca = [];
	$('#component input[type="checkbox"]:checked').each(function() {
		ca.push($(this).val());
	});
	var components = ca.join(" ");
	
	var repos = [''];
	$('#extra input[type="checkbox"]:checked').each(function() {
		repos.push("-" + $(this).val());
	});

	var source = $('#source')[0].checked;

	var txt = "";
	var i, len = repos.length;
	for (i=0; i<len; i++) {
		
		txt += "deb " + base + " " + release + repos[i] + " " + components;
		if (source) {
			txt += "\ndeb-src " + base + " " + release + repos[i] + " " + components;
		}

		if (i<len-1) {
			txt += "\n\n";
		}
	}

	$('#sourceslist pre code').text(txt);
	$('#sourceslist').show();
}





