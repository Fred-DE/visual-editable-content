/*var wpLinkL10n;
var inputs;
var h;*/

var setVecLink;

(function($)
{
	var fontSizeMin = 5;
	var fontSizeMax = 50;
	
	var savedSelection;
	
	var tagsAssociation = new Array();
	
	var newLinkTarget = "";
	
	//var selectionStart;
	
	
	$(document).ready(function()
	{
		initVisualEditableContentEditor();
	});
	
	

	function initVisualEditableContentEditor()
	{
		//$("body").append('<div id="visual-editable-content-overlay"></div>');
		//$("body").append('<div id="visual-editable-content-txt-editor" class="visual-editable-content-popin"><p class="visual-editable-content-popin-title">Édition du texte</p> <textarea name="visual-editable-content-txt-editor-textarea"></textarea> <div class="visual-editable-content-buttons"><div id="visual-editable-content-txt-validate" class="visual-editable-content-button"><span>Valider</span></div><div id="visual-editable-content-txt-cancel" class="visual-editable-content-button visual-editable-content-button-cancel"><span>Annuler</span></div></div>');
		
		//console.log(visualEditableContentVariables.path);
		//console.log(visualEditableContentPath);
		
		$.ajax(
		{
			url: visualEditableContentPath +"layout.html",
			type: "POST",
			success: function(data)
			{
				//console.log(data);
				$("body").append(data);
				startVisualEditableContentEditor(); // Tout est chargé
			},
			error: function(qXHR, textStatus, errorThrown)
			{
				alert("Une erreur est survenue.").
				console.log(qXHR +" || "+ textStatus +" || "+ errorThrown);
			}
		});
		
		// On regarde ce que crée les 'execCommand' sur le navigateur courant et on stocke les résultats dans un tableau
		$("body").append('<div id="vec-tmp" contenteditable="true">testvec</div>');
		selectText("vec-tmp");
		document.execCommand("bold", false, null);
		tagsAssociation[0] = new Array();
		tagsAssociation[0][0] = "bold";
		tagsAssociation[0][1] = $("#vec-tmp > *").get(0).tagName.toLowerCase();

		$("#vec-tmp").html($("#vec-tmp > "+ tagsAssociation[0][1]).text());
		selectText("vec-tmp");
		document.execCommand("italic", false, null);
		tagsAssociation[1] = new Array();
		tagsAssociation[1][0] = "italic";
		tagsAssociation[1][1] = $("#vec-tmp > *").get(0).tagName.toLowerCase();
		
		$("#vec-tmp").html($("#vec-tmp > "+ tagsAssociation[1][1]).text());
		selectText("vec-tmp");
		document.execCommand("underline", false, null);
		tagsAssociation[2] = new Array();
		tagsAssociation[2][0] = "underline";
		tagsAssociation[2][1] = $("#vec-tmp > *").get(0).tagName.toLowerCase();
		
		$("#vec-tmp").remove();
	}
	
	function selectText(element)
	{
		var text = document.getElementById(element);
		if ($.browser.msie)
		{
			var range = document.body.createTextRange();
			range.moveToElementText(text);
			range.select();
		}
		else if ($.browser.mozilla || $.browser.opera)
		{
			var selection = window.getSelection();
			var range = document.createRange();
			range.selectNodeContents(text);
			selection.removeAllRanges();
			selection.addRange(range);
		}
		else if ($.browser.safari)
		{
			var selection = window.getSelection();
			selection.setBaseAndExtent(text, 0, text, 1);
		}
	}
	
	
	function startVisualEditableContentEditor()
	{
		// On clique sur un texte éditable
		$("[data-vec='content']").on("click", "[data-vec~='txt']", function(event)
		{
			event.stopPropagation();
			
			openVisualEditableContentTxtEditor(this); // On ouvre la popin d'édition du texte
		});
		
		// On clique sur un bouton de mise en forme de texte
		$("#visual-editable-content-txt-menu").on("mousedown", ".visual-editable-content-txt-button-style", function()
		{
			var newClass;
			if ($(this).hasClass("visual-editable-content-txt-button-bold"))
				newClass = "bold";
			else if ($(this).hasClass("visual-editable-content-txt-button-italic"))
				newClass = "italic";
			else if ($(this).hasClass("visual-editable-content-txt-button-underline"))
				newClass = "underline";
			
			visualEditableContentAddStyle(this, newClass);
		});
		
		// On clique sur le bouton d'ajout d'un lien
		$("#visual-editable-content-txt-menu").on("mousedown", ".visual-editable-content-txt-button-link", function()
		{
			savedSelection = saveSelection();
			
			parent.openLinksPopin();
			
			// console.log(linkInfos);
			
			
			
			// document.execCommand("CreateLink", false, "http://stackoverflow.com/");
		});
		
		setVecLink = function(href, target)
		{
			newLinkTarget = target;
			// console.log(href);
			
			restoreSelection(savedSelection);
			
			document.execCommand("CreateLink", false, href);
		}
		
		// On clique sur le bouton de suppression d'un lien
		$("#visual-editable-content-txt-menu").on("mousedown", ".visual-editable-content-txt-button-unlink", function()
		{
			document.execCommand("unlink", false, false);
		});
		
		
		
		/*$("#wp-link-submit").on("click", function(event)
		{
			console.log("yo");
			
			// var linkAtts = window.parent.wpLink.getAttrs();
			// var targetID = window.parent.wpLink.newattr.replace('add_link_button_', '');
		});*/
		
		/*$("#visual-editable-content-txt-editor").on("mouseup", "textarea", function()
		{
			console.log($(this));
			console.log($(this)[0].selectionStart);
		});*/
		
		// On clique sur une image éditable
		$("[data-vec='content']").on("click", "[data-vec~='pic']", function(event)
		{
			event.stopPropagation();
			
			openVisualEditableContentPicEditor(this); // On ouvre la popin d'édition d'une image
		});
		
		// On clique sur l'overlay ou sur un bouton annuler
		$("body").on("click", "#visual-editable-content-overlay, .visual-editable-content-button-cancel", function()
		{
			closePopinVisualEditableContent(); // On ferme la popin
		});
		
		
		// On veut enregistrer les modifications
		$("body").on("click", "#visual-editable-content-global-save", function()
		{
			$("[data-vec='content']").wrap('<div id="visual-editable-content-container"></div>');
			var contentToSave = $("#visual-editable-content-container").html();
			parent.saveVisualEditableContent(contentToSave);
			$("[data-vec='content']").unwrap();
		});
		
		
		// On veut fermer le module (pas utilisé finalement)
		/*$("body").on("click", "#visual-editable-content-global-close", function()
		{
			parent.closeVisualEditableContent($("[data-vec='content']").html());
		});*/
		
		addEventDomAttrModified(); // On enlève la possibilité d'ajouter des attributs style aux balises
		
		
		// On détecte la création d'une balise
		var targetObserver = document.querySelector("#editor");
		var observer = new MutationObserver(function(mutations)
		{
			mutations.forEach(function(mutation)
			{
				if (mutation.type === "childList")
				{
					if (typeof(mutation.addedNodes[0]) !== "undefined")
					{
						if (typeof(mutation.addedNodes[0].tagName) !== "undefined")
						{
							if (mutation.addedNodes[0].tagName.toLowerCase() == "a") // Si c'est une balise 'a'
							{
								if (newLinkTarget != "")
									$(mutation.addedNodes[0]).attr("target", newLinkTarget);
							}
						}
					}
				}
			});    
		});
		var config =
		{
			attributes: false,
			childList: true,
			characterData: false
		};
		observer.observe(targetObserver, config);
		
		// Désactivation des liens
		$("a").click(function(event)
		{
			event.preventDefault();
		});
	}
	
	function saveSelection()
	{
		if (window.getSelection)
		{
			sel = window.getSelection();
			if (sel.getRangeAt && sel.rangeCount)
			{
				var ranges = [];
				for (var i = 0, len = sel.rangeCount; i < len; ++i)
				{
					ranges.push(sel.getRangeAt(i));
				}
				return ranges;
			}
		}
		else if (document.selection && document.selection.createRange)
		{
			return document.selection.createRange();
		}
		return null;
	}

	function restoreSelection(savedSel)
	{
		if (savedSel)
		{
			if (window.getSelection)
			{
				sel = window.getSelection();
				sel.removeAllRanges();
				for (var i = 0, len = savedSel.length; i < len; ++i)
				{
					sel.addRange(savedSel[i]);
				}
			}
			else if (document.selection && savedSel.select)
			{
				savedSel.select();
			}
		}
	}
	
	function addEventDomAttrModified()
	{
		// On détecte le changement de DOM -> on veut empêcher l'ajout d'attributs style
		/*$("[data-vec='content'] *").on("DOMAttrModified", function(event)
		{
			if (event.originalEvent.attrName == "style")
			{
				if ($(event.currentTarget).attr("style") !== undefined)
				{
					removeEventDomAttrModified(); // On désactive l'écouteur sur l'évènement le temps de faire notre manipulation
					
					//console.log(event);
					
					var currentStyle = event.originalEvent.prevValue;
					//console.log(currentStyle);
					$(event.currentTarget).removeAttr("style");
					if (currentStyle != "")
						$(event.currentTarget).attr("style", currentStyle);
					
					addEventDomAttrModified();
				}
			}
		});*/
		
		// $("[data-vec='content'] *").on("DOMAttrModified", function(event)
		$("[data-vec='content'] [data-vec~='txt'], [data-vec='content'] [data-vec~='txt'] *, [data-vec='content'] [data-vec~='pic'], [data-vec='content'] [data-vec~='pic'] *").on("DOMAttrModified", function(event)
		{
			/*if (event.originalEvent.attrName == "style")
			{
				if ($(event.currentTarget).attr("style") !== undefined)
				{
					$(this).attr("data-vec-attr-remove", "style");
				}
			}*/
			
			if (!(event.originalEvent.attrName == "src" && $(this).attr("data-vec").indexOf("pic") != -1)) // Si ce n'est pas la source d'une image que l'on modifie
			{
				if ($(event.currentTarget).attr(event.originalEvent.attrName) !== undefined)
				{
					removeEventDomAttrModified(); // On désactive l'écouteur sur l'événement le temps de faire notre manipulation
					
					var attrRemove = "";
					if (typeof($(this).attr("data-vec-attr-remove")) != "undefined")
					{
						attrRemove = $(this).attr("data-vec-attr-remove");
					}
					
					// Si 'data-vec-attr-remove' n'existe pas encore ou si on n'a pas déjà rempli 'data-vec-attr-remove' avec cet attribut
					if (typeof($(this).attr("data-vec-attr-remove")) == "undefined" || attrRemove.indexOf(event.originalEvent.attrName) == -1)
					{
						$(this).attr("data-vec-attr-remove", attrRemove +" "+ event.originalEvent.attrName); // On ajoute cet attribut
						
						if (event.originalEvent.prevValue != "") // Si l'attribut existait déjà et avait une valeur
						{
							// console.log(event.originalEvent.attrName);
							$(this).attr("data-vec-tmp-"+ event.originalEvent.attrName, event.originalEvent.prevValue);
						}
					}
					
					// console.log($(this).attr(event.originalEvent.attrName));
					// console.log(event);
					
					addEventDomAttrModified();
				}
			}
		});
		
		// $("body *").on("DOMAttrModified", function(event)
		// {
			// console.log("a");
			// console.log(event.originalEvent);
		// });
		
		// $("#visual-editable-content-txt-editor").on("DOMAttrModified", "#editor *", function(event)
		// {
			// console.log(event.originalEvent);
		// });
	}
	
	function removeEventDomAttrModified()
	{
		$("[data-vec='content'] *").off("DOMAttrModified");
	}
	
	// Fonction permettant de gérer la popin d'édition d'un texte
	function openVisualEditableContentTxtEditor(element)
	{
		var visualEditableContentPopinTop = $(element).offset().top;
		$("#visual-editable-content-overlay, #visual-editable-content-txt-editor").css({"display": "block"});
		$("#visual-editable-content-txt-editor").css({"top": visualEditableContentPopinTop +"px"});
		
		//$("#visual-editable-content-txt-editor textarea").val($(element).html());
		$("#visual-editable-content-txt-editor .editor").html($(element).html());
		
		// On remplace les span par les balises de styles du navigateur
		for (var i = 0; i < tagsAssociation.length; i++)
		{
			$("#visual-editable-content-txt-editor .editor").find("span."+ tagsAssociation[i][0]).replaceWith(function()
			{
				return '<'+ tagsAssociation[i][1] +'>'+ $(this).html() +'</'+ tagsAssociation[i][1] +'>';
			});
		}
		
		// On valide le changement d'un texte
		$("#visual-editable-content-txt-editor").one("click", "#visual-editable-content-txt-validate", function()
		{
			//$(element).html($("#visual-editable-content-txt-editor textarea").val());
			$(element).html($("#visual-editable-content-txt-editor .editor").html());
			closePopinVisualEditableContent(); // On ferme la popin
			
			// On remplace les balises de style (i, u, b, ...) par des span
			for (var i = 0; i < tagsAssociation.length; i++)
			{
				$(element).find(tagsAssociation[i][1]).filter(function()
				{
					return (this.attributes.length === 0); // On le fait seulement si la balise de style ne contient aucun attribut
				}).replaceWith(function()
				{
					return '<span class="'+ tagsAssociation[i][0] +'">'+ $(this).html() +'</span>';
				});
			}
			
			// On enlève les balises a vide ou sans href
			$(element).find("a:not([href])").contents().unwrap();
			$(element).find("a:empty").remove();
		});
		
		$("#visual-editable-content-txt-editor .editor").on("paste", function(event)
		{
			// console.log(event);
			event.preventDefault();
			
			// console.log(window.clipboardData.getData("text"));
			var textPaste = (event.originalEvent.clipboardData || window.clipboardData).getData("text");
			// (event.originalEvent.clipboardData || window.clipboardData).setData("text", textPaste);
			// event.target.value = textPaste;
			document.execCommand('insertText', false, textPaste);


			// console.log(textPaste);
			// var paste = event;
			
			// var timerPaste = setTimeout(function()
			// {
				// console.log(paste.originalEvent.clipboardData.getData("text"));
			// }, 1000);
			
			// var text = (event.originalEvent || event).clipboardData.getData("text/html");
			// console.log(text);
		});
		
		/*$("#visual-editable-content-txt-editor").on("select", "textarea", function()
		{
			if (window.getSelection)
			{
				txt = window.getSelection();
			}
			else if (document.getSelection)
			{
				txt = document.getSelection();
			}
			else if (document.selection)
			{
				txt = document.selection.createRange().text;
			}
			
			//console.log(txt);
		});*/
		
		/*$("#visual-editable-content-txt-editor").on("mouseup", "textarea", function()
		{
			console.log(window.getSelection().toString());
		});*/
	}
	
	// Fonction permettant de gérer la popin d'édition d'une image
	function openVisualEditableContentPicEditor(element)
	{
		var visualEditableContentPopinTop = $(element).offset().top;
		$("#visual-editable-content-overlay, #visual-editable-content-pic-editor").css({"display": "block"});
		$("#visual-editable-content-pic-editor").css({"top": visualEditableContentPopinTop +"px"});
		
		$("#visual-editable-content-pic-editor input[name='visual-editable-content-pic-editor-src']").val($(element).attr("src"));
		
		
		// On veut sélectionner une image de la librairie
		$("#visual-editable-content-pic-editor").off("click", "#visual-editable-content-pic-selector");
		$("#visual-editable-content-pic-editor").on("click", "#visual-editable-content-pic-selector", function()
		{
			// window.parent.wp.media.editor.open($(this));
			
			
			
			var frame = window.parent.wp.media(
			{
				title: 'Sélectionner une image',
				button:
				{
					text: 'Utiliser cette image'
				},
				library:
				{
					type : 'image'
				},
				multiple: false  // Set to true to allow multiple files to be selected
			});
			
			frame.open($(this));
			
			// original_send = window.parent.wp.media.editor.send.attachment; // Je ne sais pas à quoi ça sert, mais je le laisse, on sait jamais
			
			// On valide la sélection de l'image
			/*window.parent.wp.media.editor.send.attachment = function(a, dataPic)
			{
				console.log(a);
				console.log(dataPic);
				$("#visual-editable-content-pic-editor input[name='visual-editable-content-pic-editor-src']").val(dataPic.sizes.full.url);
			};*/
			frame.on("select", function(a, dataPic)
			{
				var attachment = frame.state().get('selection').first().toJSON();
				
				$("#visual-editable-content-pic-editor input[name='visual-editable-content-pic-editor-src']").val(attachment.url);
			});
		});
		
		// On valide le changement d'une image
		$("#visual-editable-content-pic-editor").one("click", "#visual-editable-content-pic-validate", function()
		{
			$(element).attr("src", $("#visual-editable-content-pic-editor input[name='visual-editable-content-pic-editor-src']").val());
			closePopinVisualEditableContent(); // On ferme la popin
		});
	}
	
	
	// Fonction permettant de fermer la popin affichée
	function closePopinVisualEditableContent()
	{
		$("#visual-editable-content-overlay, .visual-editable-content-popin").css({"display": "none"});
	}
	
	
	// Fonction permettant d'entourer le texte sélectionné par une balise avec le style passé en paramètre
	function visualEditableContentAddStyle(element, newClass)
	{
		/*var range = window.getSelection().getRangeAt(0);
		
		if (range.toString().length > 0) // S'il y a une sélection
		{
			var selectionStart = range.startOffset;
			var selectionEnd = range.endOffset;
			
			var parentRange = range.commonAncestorContainer.parentElement;
			
			if (selectionStart == 0 && ($(parentRange).text().length == range.toString().length || selectionEnd == 0)) // Si l'utilisateur a sélectionné un texte juste entouré par une balise
			{
				if ($(parentRange).prop("tagName").toLowerCase() == "span")
				{
					if ($(parentRange).hasClass(newClass)) // Si le span parent a déjà la classe -> on la supprime
						$(parentRange).removeClass(newClass);
					else // Si le span parent n'a pas la classe -> on l'ajoute
						$(parentRange).addClass(newClass);
					
					return false; // On s'arrête
				}
			}
			
			var selectedText = range.extractContents();
			var preSelectionRange = range.cloneRange();
			preSelectionRange.selectNodeContents(document.getElementById("editor"));
			preSelectionRange.setEnd(range.startContainer, range.startOffset);
			var start = preSelectionRange.toString().length;
			var end = start + range.toString().length;
			
			var newNode = document.createElement("span");
			$(newNode).addClass(newClass);
			$(newNode).html(selectedText);
			range.insertNode(newNode); // On insert la balise autour de la sélection
		}*/
		
		// document.execCommand("insertHTML", false, '<span class="italic">test</span>');
		document.execCommand(newClass, false, null);
		// var listId = window.getSelection().focusNode.parentNode;
		// var listId = getSelectionText().focusNode.parentNode;
        // $(listId).addClass("vec-"+ newClass);
		
		
		// Si on a une sélection dans le textarea
		/*if (selectionStart > 0)
		{
			var selectionTmp;
			if (selectionStart > selectionEnd)
			{
				selectionTmp = selectionEnd;
				selectionEnd = selectionStart;
				selectionStart = selectionTmp;
			}
			
			// var textareaPart1 = $("#visual-editable-content-txt-editor textarea").val().substring(0, selectionStart);
			// var textareaPart2 = $("#visual-editable-content-txt-editor textarea").val().substring(selectionStart, selectionEnd);
			// var textareaPart3 = $("#visual-editable-content-txt-editor textarea").val().substring(selectionEnd, $("#visual-editable-content-txt-editor textarea").val().length);
			
			//console.log($("#visual-editable-content-txt-editor .editor").text());
			var textareaPart1 = $("#visual-editable-content-txt-editor .editor").text().substring(0, selectionStart);
			var textareaPart2 = $("#visual-editable-content-txt-editor .editor").text().substring(selectionStart, selectionEnd);
			var textareaPart3 = $("#visual-editable-content-txt-editor .editor").text().substring(selectionEnd, $("#visual-editable-content-txt-editor .editor").text().length);
			
			// console.log(textareaPart1 +" || "+ textareaPart2)
			
			// var newTextareaVal = textareaPart1 +'<span class="'+ newClass +'">'+ textareaPart2 +'</span>'+ textareaPart3;
			//$("#visual-editable-content-txt-editor textarea").val(newTextareaVal);
			//console.log(newTextareaVal);
			//$("#visual-editable-content-txt-editor .editor").html(newTextareaVal);
		}*/
	}
	
	function getSelectionText()
	{
		/*var valueSelected;
		
		if (window.getSelection)
		{
			try
			{
				var ta = $('textarea').get(0);
				//return ta.value.substring(ta.selectionStart, ta.selectionEnd);
				valueSelected = ta.value.substring(ta.selectionStart, ta.selectionEnd);
			}
			catch (e)
			{
				console.log('Cant get selection text')
			}
		}
		// For IE
		if (document.selection && document.selection.type != "Control")
		{
			//return document.selection.createRange().text;
			valueSelected = document.selection.createRange().text;
		}*/
		
		if (window.getSelection)
		{
			txt = window.getSelection();
		}
		else if (document.getSelection)
		{
			txt = document.getSelection();
		}
		else if (document.selection)
		{
			txt = document.selection.createRange().text;
		}
		
		// console.log(valueSelected);
		return txt;
	}
})(jQuery);

/*function setVecLink(href)
{
	console.log(href);
	
	document.execCommand("CreateLink", false, href);
}*/