// new edit toolbar used with permission
// by Alex King
// http://www.alexking.org/

var WHedButtons = new Array(), edLinks = new Array(), edOpenTags = new Array(), now = new Date(), datetime;

function WHedButton(id, display, tagStart, tagEnd, access, open) {
	this.id = id;				// used to name the toolbar button
	this.display = display;		// label on button
	this.tagStart = tagStart; 	// open tag
	this.tagEnd = tagEnd;		// close tag
	this.access = access;		// access key
	this.open = open;			// set to -1 if tag does not need to be closed
}

function zeroise(number, threshold) {
	// FIXME: or we could use an implementation of printf in js here
	var str = number.toString();
	if (number < 0) { str = str.substr(1, str.length) }
	while (str.length < threshold) { str = "0" + str }
	if (number < 0) { str = '-' + str }
	return str;
}

datetime = now.getUTCFullYear() + '-' +
zeroise(now.getUTCMonth() + 1, 2) + '-' +
zeroise(now.getUTCDate(), 2) + 'T' +
zeroise(now.getUTCHours(), 2) + ':' +
zeroise(now.getUTCMinutes(), 2) + ':' +
zeroise(now.getUTCSeconds() ,2) +
'+00:00';

WHedButtons[WHedButtons.length] =
new WHedButton('ed_strong'
,'b'
,'<strong>'
,'</strong>'
,'b'
);

WHedButtons[WHedButtons.length] =
new WHedButton('ed_em'
,'i'
,'<em>'
,'</em>'
,'i'
);

WHedButtons[WHedButtons.length] =
new WHedButton('ed_link'
,'link'
,''
,'</a>'
,'a'
); // special case

WHedButtons[WHedButtons.length] =
new WHedButton('ed_block'
,'b-quote'
,'\n\n<blockquote>'
,'</blockquote>\n\n'
,'q'
);


WHedButtons[WHedButtons.length] =
new WHedButton('ed_del'
,'del'
,'<del datetime="' + datetime + '">'
,'</del>'
,'d'
);

WHedButtons[WHedButtons.length] =
new WHedButton('ed_ins'
,'ins'
,'<ins datetime="' + datetime + '">'
,'</ins>'
,'s'
);

WHedButtons[WHedButtons.length] =
new WHedButton('ed_img'
,'img'
,''
,''
,'m'
,-1
); // special case

WHedButtons[WHedButtons.length] =
new WHedButton('ed_ul'
,'ul'
,'<ul>\n'
,'</ul>\n\n'
,'u'
);

WHedButtons[WHedButtons.length] =
new WHedButton('ed_ol'
,'ol'
,'<ol>\n'
,'</ol>\n\n'
,'o'
);

WHedButtons[WHedButtons.length] =
new WHedButton('ed_li'
,'li'
,'\t<li>'
,'</li>\n'
,'l'
);

WHedButtons[WHedButtons.length] =
new WHedButton('ed_code'
,'code'
,'<code>'
,'</code>'
,'c'
);

WHedButtons[WHedButtons.length] =
new WHedButton('ed_more'
,'more'
,'<!--more-->'
,''
,'t'
,-1
);
/*
WHedButtons[WHedButtons.length] =
new WHedButton('ed_next'
,'page'
,'<!--nextpage-->'
,''
,'p'
,-1
);
*/


// Allow multiple instances.
// Name = unique value, id = textarea id, container = container div.
// Can disable some buttons by passing comma delimited string as 4th param.
var WHQTags = function(name, id, container, disabled) {
	var t = this, cont = document.getElementById(container), i, tag, tb, html, sel;

	t.Buttons = [];
	t.Links = [];
	t.OpenTags = [];
	t.Canvas = document.getElementById(id);

	if ( ! t.Canvas || ! cont ) {                		
                return;
        }

	disabled = ( typeof disabled != 'undefined' ) ? ','+disabled+',' : '';

	t.WHedShowButton = function(button, i) {
		if ( disabled && (disabled.indexOf(','+button.display+',') != -1) )
			return '';
		else if ( button.id == name+'_img' )
			return '<input type="button" id="' + button.id + '" accesskey="' + button.access + '" class="ed_button" onclick="'+name+'.edInsertImage('+name+'.Canvas);" value="' + button.display + '" />';
		else if (button.id == name+'_link')
			return '<input type="button" id="' + button.id + '" accesskey="' + button.access + '" class="ed_button" onclick="'+name+'.edInsertLink('+i+');" value="'+button.display+'" />';
		else
			return '<input type="button" id="' + button.id + '" accesskey="'+button.access+'" class="ed_button" onclick="'+name+'.edInsertTag('+i+');" value="'+button.display+'" />';
	};

	t.edAddTag = function(button) {
		if ( t.Buttons[button].tagEnd != '' ) {
			t.OpenTags[t.OpenTags.length] = button;
			document.getElementById(t.Buttons[button].id).value = '/' + document.getElementById(t.Buttons[button].id).value;
		}
	};

	t.edRemoveTag = function(button) {
		for ( i = 0; i < t.OpenTags.length; i++ ) {
			if ( t.OpenTags[i] == button ) {
				t.OpenTags.splice(i, 1);
				document.getElementById(t.Buttons[button].id).value = document.getElementById(t.Buttons[button].id).value.replace('/', '');
			}
		}
	};

	t.edCheckOpenTags = function(button) {
		tag = 0;
		for ( var i = 0; i < t.OpenTags.length; i++ ) {
			if ( t.OpenTags[i] == button )
				tag++;
		}
		if ( tag > 0 ) return true; // tag found
		else return false; // tag not found
	};

	this.edCloseAllTags = function() {
		var count = t.OpenTags.length;
		for ( var o = 0; o < count; o++ )
			t.edInsertTag(t.OpenTags[t.OpenTags.length - 1]);
	};

	this.edQuickLink = function(i, thisSelect) {
		if ( i > -1 ) {
			var newWin = '', tempStr;
			if ( Links[i].newWin == 1 ) {
				newWin = ' target="_blank"';
			}
			tempStr = '<a href="' + Links[i].URL + '"' + newWin + '>'
			            + Links[i].display
			            + '</a>';
			thisSelect.selectedIndex = 0;
			edInsertContent(t.Canvas, tempStr);
		} else {
			thisSelect.selectedIndex = 0;
		}
	};

	// insertion code
	t.edInsertTag = function(i) {
		//IE support
		if ( document.selection ) {
			t.Canvas.focus();
		    sel = document.selection.createRange();
			if ( sel.text.length > 0 ) {
				sel.text = t.Buttons[i].tagStart + sel.text + t.Buttons[i].tagEnd;
			} else {
				if ( ! t.edCheckOpenTags(i) || t.Buttons[i].tagEnd == '' ) {
					sel.text = t.Buttons[i].tagStart;
					t.edAddTag(i);
				} else {
					sel.text = t.Buttons[i].tagEnd;
					t.edRemoveTag(i);
				}
			}
			t.Canvas.focus();
		} else if ( t.Canvas.selectionStart || t.Canvas.selectionStart == '0' ) { //MOZILLA/NETSCAPE support
			var startPos = t.Canvas.selectionStart, endPos = t.Canvas.selectionEnd, cursorPos = endPos, scrollTop = t.Canvas.scrollTop;

			if ( startPos != endPos ) {
				t.Canvas.value = t.Canvas.value.substring(0, startPos)
				              + t.Buttons[i].tagStart
				              + t.Canvas.value.substring(startPos, endPos)
				              + t.Buttons[i].tagEnd
				              + t.Canvas.value.substring(endPos, t.Canvas.value.length);
				cursorPos += t.Buttons[i].tagStart.length + t.Buttons[i].tagEnd.length;
			} else {
				if ( !t.edCheckOpenTags(i) || t.Buttons[i].tagEnd == '' ) {
					t.Canvas.value = t.Canvas.value.substring(0, startPos)
					              + t.Buttons[i].tagStart
					              + t.Canvas.value.substring(endPos, t.Canvas.value.length);
					t.edAddTag(i);
					cursorPos = startPos + t.Buttons[i].tagStart.length;
				} else {
					t.Canvas.value = t.Canvas.value.substring(0, startPos)
					              + t.Buttons[i].tagEnd
					              + t.Canvas.value.substring(endPos, t.Canvas.value.length);
					t.edRemoveTag(i);
					cursorPos = startPos + t.Buttons[i].tagEnd.length;
				}
			}
			t.Canvas.focus();
			t.Canvas.selectionStart = cursorPos;
			t.Canvas.selectionEnd = cursorPos;
			t.Canvas.scrollTop = scrollTop;
		} else {
			if ( ! t.edCheckOpenTags(i) || t.Buttons[i].tagEnd == '' ) {
				t.Canvas.value += Buttons[i].tagStart;
				t.edAddTag(i);
			} else {
				t.Canvas.value += Buttons[i].tagEnd;
				t.edRemoveTag(i);
			}
			t.Canvas.focus();
		}
	};

	this.edInsertLink = function(i, defaultValue) {
		if ( ! defaultValue )
			defaultValue = 'http://';

		if ( ! t.edCheckOpenTags(i) ) {
			var URL = prompt(quicktagsL10n.enterURL, defaultValue);
			if ( URL ) {
				t.Buttons[i].tagStart = '<a href="' + URL + '">';
				t.edInsertTag(i);
			}
		} else {
			t.edInsertTag(i);
		}
	};

	this.edInsertImage = function() {
		var myValue = prompt(quicktagsL10n.enterImageURL, 'http://');
		if ( myValue ) {
			myValue = '<img src="'
					+ myValue
					+ '" alt="' + prompt(quicktagsL10n.enterImageDescription, '')
					+ '" />';
			edInsertContent(t.Canvas, myValue);
		}
	};

	t.Buttons[t.Buttons.length] = new WHedButton(name+'_strong','b','<strong>','</strong>','b');
	t.Buttons[t.Buttons.length] = new WHedButton(name+'_em','i','<em>','</em>','i');
	t.Buttons[t.Buttons.length] = new WHedButton(name+'_link','link','','</a>','a'); // special case
	t.Buttons[t.Buttons.length] = new WHedButton(name+'_block','b-quote','\n\n<blockquote>','</blockquote>\n\n','q');
	t.Buttons[t.Buttons.length] = new WHedButton(name+'_del','del','<del datetime="' + datetime + '">','</del>','d');
	t.Buttons[t.Buttons.length] = new WHedButton(name+'_ins','ins','<ins datetime="' + datetime + '">','</ins>','s');
	t.Buttons[t.Buttons.length] = new WHedButton(name+'_img','img','','','m',-1); // special case
	t.Buttons[t.Buttons.length] = new WHedButton(name+'_ul','ul','<ul>\n','</ul>\n\n','u');
	t.Buttons[t.Buttons.length] = new WHedButton(name+'_ol','ol','<ol>\n','</ol>\n\n','o');
	t.Buttons[t.Buttons.length] = new WHedButton(name+'_li','li','\t<li>','</li>\n','l');
	t.Buttons[t.Buttons.length] = new WHedButton(name+'_code','code','<code>','</code>','c');
	t.Buttons[t.Buttons.length] = new WHedButton(name+'_more','more','<!--more-->','','t',-1);
//	t.Buttons[t.Buttons.length] = new WHedButton(name+'_next','page','<!--nextpage-->','','p',-1);

	tb = document.createElement('div');
	tb.id = name+'-quicktags';

	html = '<div id="'+name+'_toolbar" class="ed_toolbar quicktags">';
	for (i = 0; i < t.Buttons.length; i++)
		html += t.WHedShowButton(t.Buttons[i], i);

	html += '<input type="button" id="'+name+'_ed_spell" class="ed_button" onclick="edSpell('+name+'.Canvas);" title="' + quicktagsL10n.dictionaryLookup + '" value="' + quicktagsL10n.lookup + '" />';
	html += '<input type="button" id="'+name+'_ed_close" class="ed_button" onclick="'+name+'.edCloseAllTags();" title="' + quicktagsL10n.closeAllOpenTags + '" value="' + quicktagsL10n.closeTags + '" /></div>';

	tb.innerHTML = html;
	cont.parentNode.insertBefore(tb, cont);
        return t;
};
