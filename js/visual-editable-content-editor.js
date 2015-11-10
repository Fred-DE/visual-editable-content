var setVecLink;

(function($)
{
	var fontSizeMin = 5;
	var fontSizeMax = 50;
	
	var savedSelection;
	
	var tagsAssociation = new Array();
	
	var newLinkTarget = "";
	
	
	// var mutationObserver;
	
	
	$(document).ready(function()
	{
		initVisualEditableContentEditor();
	});
	
	

	function initVisualEditableContentEditor()
	{
		$.ajax(
		{
			url: visualEditableContentPath +"layout.html",
			type: "POST",
			success: function(data)
			{
				$("body").append(data);
				startVisualEditableContentEditor(); // Tout est chargé
			},
			error: function(qXHR, textStatus, errorThrown)
			{
				alert("Une erreur est survenue.").
				console.log(qXHR +" || "+ textStatus +" || "+ errorThrown);
			}
		});
		
		checkExecCommand();
		
		// Observateur de mutations
		/*mutationObserver = new MutationObserver(function(mutations)
		{
			mutations.forEach(function(mutation)
			{
				console.log(mutation.type);
			});
		});
		
		var config =
		{
			attributes: true,
			childList: true,
			characterData: true
			};
		
		observer.observe(target, config);*/
	}
	
	// On regarde ce que crée les 'execCommand' sur le navigateur courant et on stocke les résultats dans un tableau
	function checkExecCommand()
	{
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
		});
		
		setVecLink = function(href, target)
		{
			newLinkTarget = target;
			
			restoreSelection(savedSelection);
			
			document.execCommand("CreateLink", false, href);
		}
		
		// On clique sur le bouton de suppression d'un lien
		$("#visual-editable-content-txt-menu").on("mousedown", ".visual-editable-content-txt-button-unlink", function()
		{
			document.execCommand("unlink", false, false);
		});
		
		// On clique sur le bouton de création d'une liste
		$("#visual-editable-content-txt-menu").on("mousedown", ".visual-editable-content-txt-button-list", function()
		{
			document.execCommand("insertUnorderedList");
		});
		
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
							else if (mutation.addedNodes[0].tagName.toLowerCase() == "ul") // Si c'est une balise 'ul'
							{
								// console.log("list");
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
		$("[data-vec='content'] [data-vec~='txt'], [data-vec='content'] [data-vec~='txt'] *, [data-vec='content'] [data-vec~='pic'], [data-vec='content'] [data-vec~='pic'] *").on("DOMAttrModified", function(event)
		{
			if (!((event.originalEvent.attrName == "src" || event.originalEvent.attrName == "alt") && $(this).attr("data-vec").indexOf("pic") != -1)) // Si ce n'est pas la source d'une image que l'on modifie
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
							$(this).attr("data-vec-tmp-"+ event.originalEvent.attrName, event.originalEvent.prevValue);
						}
					}
					
					addEventDomAttrModified();
				}
			}
		});
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
			
			// On enlève les balises 'a' vides ou sans href
			$(element).find("a:not([href])").contents().unwrap();
			$(element).find("a:empty").remove();
			
			// Gestion de l'ajout de 'ul'
			if ($(element).find("ul").length > 0 && $(element).get(0).tagName.toLowerCase() == "p")
			{
				// On stocke dans un tableau toutes les listes nouvellement créées
				var listArray = new Array();
				$(element).find("ul").each(function()
				{
					listArray.push(this);
					$(this).replaceWith(function()
					{
						return '<div class="vec-list-tmp"></div>'; // On remplace les listes par une 'div' temporaire
					});
				});
				
				var vecTxtContainer = '<p';
				$.each(element.attributes, function()
				{
					// this.attributes is not a plain object, but an array
					// of attribute nodes, which contain both the name and value
					if (this.specified)
					{
						if (this.name != "data-vec-attr-remove")
						{
							vecTxtContainer += ' '+ this.name +'="'+ this.value +'"';
						}
					}
				});

				
				// On stocke le html dans une chaîne de caractères que l'on entoure
				vecTxtContainer += ' data-vec-tmp="txt-ul">'+ $(element).html() +'</p>';
				
				// On remplace les 'div' temporaires par les listes que l'on avait stockées et on ferme et on ouvre des 'p' autour pour spliter la balise 'p' vec-txt container
				var indexStart = 0;
				var index = 0;
				while (indexStart != -1)
				{
					indexStart = vecTxtContainer.indexOf('<div class="vec-list-tmp"></div>', indexStart);
					if (indexStart != -1)
					{
						vecTxtContainer = vecTxtContainer.replace('<div class="vec-list-tmp"></div>', '</p><ul data-vec-tmp="ul-tmp">'+ $(listArray[index]).html() +'</ul><p data-vec-tmp="txt-ul-split">');
					}
					
					index++;
				}
				
				var newElement = jQuery.parseHTML(vecTxtContainer); // On transforme la chaîne de caractères en objet HTML
				
				$(element).after(newElement);
				$(element).remove();
			}
		});
		
		// $("#visual-editable-content-txt-editor .editor").off("paste");
		$("#visual-editable-content-txt-editor .editor").one("paste", function(event)
		{
			event.preventDefault();
			
			var textPaste = (event.originalEvent.clipboardData || window.clipboardData).getData("text");
			
			document.execCommand("insertText", false, textPaste);
		});
	}
	
	// Fonction permettant de gérer la popin d'édition d'une image
	function openVisualEditableContentPicEditor(element)
	{
		var visualEditableContentPopinTop = $(element).offset().top;
		$("#visual-editable-content-overlay, #visual-editable-content-pic-editor").css({"display": "block"});
		$("#visual-editable-content-pic-editor").css({"top": visualEditableContentPopinTop +"px"});
		
		$("#visual-editable-content-pic-editor input[name='visual-editable-content-pic-editor-src']").val($(element).attr("src"));
		$("#visual-editable-content-pic-editor input[name='visual-editable-content-pic-editor-alt']").val($(element).attr("alt"));
		
		
		// On veut sélectionner une image de la librairie
		$("#visual-editable-content-pic-editor").off("click", "#visual-editable-content-pic-selector");
		$("#visual-editable-content-pic-editor").on("click", "#visual-editable-content-pic-selector", function()
		{
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
			$(element).attr("alt", $("#visual-editable-content-pic-editor input[name='visual-editable-content-pic-editor-alt']").val());
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
		document.execCommand(newClass, false, null);
	}
})(jQuery);