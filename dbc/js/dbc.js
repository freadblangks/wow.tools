function makeBuild(text){
	if(text == null){
		return "";
	}

	let rawdesc = text.replace("WOW-", "");
	const build  = rawdesc.substring(0, 5);

	rawdesc = rawdesc.replace(build, "").replace("patch", "");
	const descexpl = rawdesc.split("_");

	return descexpl[0] + "." + build;
}

function getFKCols(headers, fks){
	let fkCols = [];
	headers.forEach(function(header, index){
		Object.keys(fks).forEach(function(key) {
			if(key == header){
				fkCols[index] = fks[key];
			}
		});
	});
	return fkCols;
}

function openFKModal(value, location, build){
	const wowDBMap = new Map();
	wowDBMap.set("spell", "https://www.wowdb.com/spells/");
	wowDBMap.set("item", "https://www.wowdb.com/items/");
	wowDBMap.set("itemsparse", "https://www.wowdb.com/items/");
	wowDBMap.set("questv2", "https://www.wowdb.com/quests/");
	wowDBMap.set("creature", "https://www.wowdb.com/npcs/");

	const wowheadMap = new Map();
	wowheadMap.set("spell", "https://www.wowhead.com/spell=");
	wowheadMap.set("item", "https://www.wowhead.com/item=");
	wowheadMap.set("itemsparse", "https://www.wowhead.com/item=");
	wowheadMap.set("questv2", "https://www.wowhead.com/quest=");
	wowheadMap.set("creature", "https://www.wowhead.com/npc=");

	const splitLocation = location.split("::");
	const db = splitLocation[0].toLowerCase();
	const col = splitLocation[1];

	$("#fkModalContent").html("<b>Lookup into table " + db + " on col '" + col + "' value '" + value + "'</b><br>");

	if(wowDBMap.has(db)){
		$("#fkModalContent").append(" <a target='_BLANK' href='" + wowDBMap.get(db) + value + "' class='btn btn-warning btn-sm'>View on WoWDB</a>");
	}

	if(wowheadMap.has(db)){
		$("#fkModalContent").append(" <a target='_BLANK' href='" + wowheadMap.get(db) + value + "' class='btn btn-warning btn-sm'>View on Wowhead</a>");
	}

	$("#fkModalContent").append("<table id='fktable' class='table table-condensed table-striped'>");

	if(db == "spell" && col == "ID"){
		$.ajax({
			"url": "/dbc/api/peek/spellname?build=" + build + "&col=ID&val=" + value,
			"success": function(json) {
				$("#fktable").append("<tr><td>Name <small>(from SpellName)</small></td><td>" + json.values["Name_lang"] + "</td></tr>");
			}
		});
	}

	$.ajax({
		"url": "/dbc/api/header/" + db + "?build=" + build,
		"success": function(headerjson) {
			$.ajax({
				"url": "/dbc/api/peek/" + db + "?build=" + build + "&col=" + col + "&val=" + value,
				"success": function(json) {
					if(!json || Object.keys(json.values).length == 0){
						$("#fkModalContent").append("No row returned, this entry is not available in clients and/or is supplied by the server upon request.");
					}else{
						Object.keys(json.values).forEach(function (key) {
							const val = json.values[key];
							if(key in headerjson.fks){
								if(headerjson.fks[key] == "FileData::ID"){
									$("#fktable").append("<tr><td>" + key + "</td><td><a style='padding-top: 0px; padding-bottom: 0px; cursor: pointer; border-bottom: 1px dotted;' data-toggle='modal' data-target='#moreInfoModal' onclick='fillModal(" + val + ")'>" + val + "</a></td></tr>");
								}else if(headerjson.fks[key] == "SoundEntries::ID" && parseInt(build[0]) > 6){
									$("#fktable").append("<tr><td>" + key + "</td><td><a style='padding-top: 0px; padding-bottom: 0px; cursor: pointer; border-bottom: 1px dotted;' onclick='openFKModal(" + val + ", \"SoundKit::ID\", \"" + build + "\")'>" + val + "</a></td></tr>");
								}else{
									$("#fktable").append("<tr><td>" + key + "</td><td><a style='padding-top: 0px; padding-bottom: 0px; cursor: pointer; border-bottom: 1px dotted;' onclick='openFKModal(" + val + ", \"" + headerjson.fks[key] + "\", \"" + build + "\")'>" + val + "</a></td></tr>");
								}

								var cleanDBname = headerjson.fks[key].split('::')[0].toLowerCase();

								if(wowDBMap.has(cleanDBname)){
									$("#fktable:first tr:last-child td:last-child").append(" <a target='_BLANK' href='" + wowDBMap.get(cleanDBname) + val + "' class='btn btn-warning btn-sm'>View on WoWDB</a></td></tr>");
								}

								if(wowheadMap.has(cleanDBname)){
									$("#fktable:first tr:last-child td:last-child").append(" <a target='_BLANK' href='" + wowheadMap.get(cleanDBname) + val + "' class='btn btn-warning btn-sm'>View on Wowhead</a></td></tr>");
								}
							}else{
								$("#fktable").append("<tr><td>" + key + "</td><td>" + val + "</td></tr>");
							}
						});

						const numRecordsIntoPage = json.offset - Math.floor((json.offset - 1) / 25) * 25;
						const page = Math.floor(((json.offset - 1) / 25) + 1);
						$("#fkModalContent").append(" <a target=\"_BLANK\" href=\"/dbc/?dbc=" + db.replace(".db2", "") + "&build=" + build + "#page=" + page + "&row=" + numRecordsIntoPage + "\" class=\"btn btn-primary\">Jump to record</a>");
					}
				}
			}).fail(function() {
				$("#fkModalContent").append("Lookup failed. This table is not available in clients and/or an error occurred.");
			});;
		}
	}).fail(function() {
		$("#fkModalContent").append("Lookup failed. This table is not available in clients and/or an error occurred.");
	});
}

function dec2hex(str){
	return (parseInt(str) >>> 0).toString(16);
}

function getFlagDescriptions(db, field, value, targetFlags = 0){
	let usedFlags = Array();
	if(targetFlags == 0){
		targetFlags = flagMap.get(db + '.' + field);
	}

	if(value == "-1")
		return ["All"];

	for(let i = 0; i < 32; i++){
		let toCheck = 1 << i;
		if(value & toCheck){
			if(targetFlags !== undefined && targetFlags[toCheck]){
				usedFlags.push(['0x' + "" + dec2hex(toCheck), targetFlags[toCheck]]);
			}else{
				usedFlags.push(['0x' + "" + dec2hex(toCheck), ""]);
			}
		}
	}

	return usedFlags;
}

function fancyFlagTable(flagArrs){
	if(flagArrs.length == 0){
		return "";
	}

	let tableHtml = "<table class=\"table table-sm table-striped\">";
	flagArrs.forEach((flagArr) => {
		tableHtml += "<tr><td>" + flagArr[0] + "</td><td>" + flagArr[1] + "</td></tr>";
	});
	tableHtml += "</table>";

	return tableHtml;
}

function getEnum(db, field, value){
	const targetEnum = enumMap.get(db + '.' + field);
	return getEnumVal(targetEnum, value);
}

function getEnumVal(targetEnum, value){
	if(targetEnum[value] !== undefined){
		return targetEnum[value];
	}else{
		return "Unk";
	}
}