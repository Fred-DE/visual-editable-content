var pluginDirUrl;

(function($)
{
	$(document).ready(function()
	{
		initVisualEditableContent();
	});
	

	function initVisualEditableContent()
	{
		pluginDirUrl = $("input[name='plugin-dir-url']").val();
		
		// On clique sur le bouton permettant de lancer le plugin
		$("#visual-editable-content-block").on("click", "#visual-editable-content-show", function()
		{
			openVisualEditableContent();
		});
	}
	
	function openVisualEditableContent()
	{
		$("#visual-editable-content-show").css({"display": "none"});
		
		$("#visual-editable-content-editor").css({"display": "block"});
		$("#visual-editable-content-editor").attr("src", $("input[name='current-page-guid']").val() +"?vec="+ Math.floor((Math.random() * 100) + 1));
		
		// Chargement de l'iframe
		$("#visual-editable-content-editor").on("load", function()
		{
			console.log("loaded");

			if (!this.contentWindow)
				return;
			
			// On charge le js à l'intérieur de l'iframe
			var scriptVecEditor = document.createElement("script");
			scriptVecEditor.type = "text/javascript";
			scriptVecEditor.src = pluginDirUrl +"js/visual-editable-content-editor.js";

			this.contentWindow.document.getElementsByTagName("head")[0].appendChild(scriptVecEditor);
			
			
			// On charge le css à l'intérieur de l'iframe
			var cssVecEditor = document.createElement("link");
			cssVecEditor.type = "text/css";
			cssVecEditor.media = "screen";
			cssVecEditor.rel = "stylesheet";
			cssVecEditor.href = pluginDirUrl +"css/visual-editable-content-editor.css";

			this.contentWindow.document.getElementsByTagName("head")[0].appendChild(cssVecEditor);
		});
	}
})(jQuery);

// On récupère les modifications, on les traite et on valide (insert dans le textarea WordPress)
function saveVisualEditableContent(data)
{
	var dataHtml = jQuery.parseHTML(data); // On transforme la chaîne de caractères en objet HTML
	
	// On veut seulement remplacer ce qu'il y a dans la balise avec l'attribut vec="content"
	var mainTextareaContent = jQuery("textarea#content").val(); // On récupère tout le contenu du textarea WordPress
	
	mainTextareaContent = '<div id="visual-editable-content-container">'+ mainTextareaContent +'</div>'; // On entoure ce contenu d'une 'div' (string)
	
	
	
	
	
	// On récupère les balises 'script' en string
	var scriptsArray = new Array();
	var indexStart = 0;
	var arrayIndexClass = new Array();
	while (indexStart != -1)
	{
		var indexScriptStart = mainTextareaContent.indexOf("<script", indexStart);
		if (indexScriptStart == -1) // Pas de balise 'script'
			indexStart = -1;
		else
		{
			var indexScriptEnd = mainTextareaContent.indexOf("</script>", indexStart) + 9;
			indexStart = indexScriptEnd;
			
			var scriptTagString = mainTextareaContent.substring(indexScriptStart, indexScriptEnd);
			
			scriptsArray[scriptsArray.length] = new Array();
			scriptsArray[scriptsArray.length-1]["script"] = scriptTagString;
			
			// On cherche à savoir où est placée la balise 'script'
			var indexStartClass = 0;
			while (indexStartClass != -1)
			{
				arrayIndexClass[arrayIndexClass.length] = new Array();
				arrayIndexClass[arrayIndexClass.length-1][0] = mainTextareaContent.indexOf('class="', indexStartClass);
				arrayIndexClass[arrayIndexClass.length-1][1] = indexScriptStart - arrayIndexClass[arrayIndexClass.length-1][0];
				
				if (arrayIndexClass[arrayIndexClass.length-1][0] == -1)
					indexStartClass = -1;
				else
					indexStartClass = arrayIndexClass[arrayIndexClass.length-1][0] + 7;
			}
			
			var minDiffBetweenClassAndScript = 99999999999999999999;
			var indexMinDiffBetweenClassAndScript;
			for (var i = 0; i < arrayIndexClass.length; i++)
			{
				if (arrayIndexClass[i][1] < minDiffBetweenClassAndScript && arrayIndexClass[i][1] > 0)
				{
					minDiffBetweenClassAndScript = arrayIndexClass[i][1];
					indexMinDiffBetweenClassAndScript = i;
				}
			}
			
			// On récupère le nom de la classe la plus proche et au dessus de la balise 'script'
			var indexEndClass = mainTextareaContent.indexOf('"', arrayIndexClass[indexMinDiffBetweenClassAndScript][0] + 7);
			var classScript = mainTextareaContent.substring(arrayIndexClass[indexMinDiffBetweenClassAndScript][0]+7, indexEndClass);
			scriptsArray[scriptsArray.length-1]["class"] = classScript;
		}
	}
	
	
	
	
	mainTextareaContent = jQuery.parseHTML(mainTextareaContent); // On transforme la chaîne de caractères en objet HTML
	
	jQuery(mainTextareaContent).find("[data-vec='content']").wrap('<div id="visual-editable-content-container-vec-content"></div>'); // On entoure la balise avec l'attribut vec="content" d'une div
	
	
	// Gestion des ajouts des 'ul'
	jQuery(dataHtml).find("[data-vec-tmp='txt-ul']").each(function(index)
	{
		// console.log("text-ul");
		// var dataVecPrev = jQuery(this).prevAll("[data-vec='txt']").index();
		// var dataVecPrev = jQuery(this).prevAll("[data-vec~='txt']").first(); // On récupère le data-vec="txt" le plus proche positionné avant le ul courant
		var allDataVecTxt = jQuery(dataHtml).find("[data-vec~='txt']");
		var dataVecPrev = allDataVecTxt.eq(allDataVecTxt.index(this) - 1); // On récupère le data-vec="txt" le plus proche positionné avant le ul courant
		
		// console.log(dataVecPrev);
		// var indexVecTxt = jQuery(dataHtml).index(dataVecPrev);
		var indexVecTxt = jQuery(dataHtml).find("[data-vec~='txt']").index(dataVecPrev); // On récupère l'index du data-vec="txt" récupéré juste avant
		// console.log(indexVecTxt);
		indexVecTxt += 1; // On ajoute 1 à l'index, pour avoir l'index du data-vec="txt" à modifier
		
		var dataVecToReplace = jQuery(mainTextareaContent).find("#visual-editable-content-container-vec-content [data-vec~='txt']:eq("+ indexVecTxt +")"); // Noeud côté résultat
		dataVecToReplace.html(jQuery(this).html()); // On insère le contenu du 1er 'p' (dont celui avant le 1er 'ul') dans le data-vec="txt"
		
		
		var elementToAdd; // Noeud côté éditable
		elementToAdd = jQuery(this).next(); // On se positionne sur le 'ul'
		var currentPositionHtml; // Noeud côté HTML résultat
		currentPositionHtml = dataVecToReplace;
		
		// On rajoute les 'ul' et 'p' que l'on a dû rajouter
		do
		{
			// console.log("do");
			
			jQuery(elementToAdd).wrap('<div></div>');
			
			currentPositionHtml.after("\n"+ jQuery(elementToAdd).parent().html()); // On ajoute le 'ul' après
			currentPositionHtml = currentPositionHtml.next(); // On se positionne sur le 'ul' (côté résultat)
			
			jQuery(elementToAdd).unwrap();
			elementToAdd = elementToAdd.next(); // On se positionne sur l'élément après le 'ul' (côté éditable)
			
			// Si après le 'ul' (côté éditable) on a dû rajouter une balise 'p'
			if (jQuery(elementToAdd).attr("data-vec-tmp") == "txt-ul-split")
			{
				// console.log("if");
				jQuery(elementToAdd).wrap('<div></div>');
				currentPositionHtml.after("\n"+ jQuery(elementToAdd).parent().html()); // On rajoute après le 'ul' cette balise 'p'
				
				jQuery(elementToAdd).unwrap();
				
				elementToAdd = elementToAdd.next(); // On se positionne sur l'élément après le 'p' (côté éditable)
				
				currentPositionHtml = currentPositionHtml.next(); // On se positionne sur le 'p' que l'on vient d'ajouter (côté résultat)
			}
		} while(elementToAdd.length != 0 && jQuery(elementToAdd).get(0).tagName.toLowerCase() == "ul" && jQuery(elementToAdd).attr("data-vec-tmp") == "ul-tmp"); // Tant qu'il y a un 'ul' à ajouter
	});
	
	// On enlève des noeuds vides
	jQuery(mainTextareaContent).find("#visual-editable-content-container-vec-content [data-vec-tmp='txt-ul-split']:empty").remove();
	
	// On remplace les textes
	jQuery(mainTextareaContent).find("#visual-editable-content-container-vec-content [data-vec~='txt']").each(function(index)
	{
		// On remplace les contenus des noeuds textes éditables par ceux susceptibles d'avoir été édités
		jQuery(this).html(jQuery(dataHtml).find("[data-vec~='txt']:eq("+ index +")").html());
		var nodeWithGoodAttr = getHtmlWithGoodAttr(this);
		jQuery(this).html(jQuery(nodeWithGoodAttr).html());
	});
	
	// On remplace les images
	jQuery(mainTextareaContent).find("#visual-editable-content-container-vec-content [data-vec~='pic']").each(function(index)
	{
		var tmpImg = jQuery(dataHtml).find("[data-vec~='pic']:eq("+ index +")").wrap("<div></div>").parent().html();
		
		// On remplace les contenus des noeuds images éditables par ceux susceptibles d'avoir été édités
		jQuery(this).wrap("<p></p>");
		var tmpThisImg = jQuery(this).parent();
		jQuery(tmpThisImg).html(tmpImg);
		var nodeWithGoodAttr = getHtmlWithGoodAttr(tmpThisImg);
		jQuery(this).html(jQuery(nodeWithGoodAttr).html());
		
		jQuery(tmpThisImg).children().unwrap();
		
		jQuery(dataHtml).find("[data-vec~='pic']:eq("+ index +")").unwrap();
	});
	
	// On remplace les éléments des carousels
	jQuery(mainTextareaContent).find("#visual-editable-content-container-vec-content [data-vec~='carousel-container']").each(function(index)
	{
		var carouselContent = "\n";
		
		// On parcourt tous les éléments du carousel
		jQuery(dataHtml).find("[data-vec~='carousel-container']:eq("+ index +") [data-vec='carousel-item']").each(function()
		{
			var nodeWithGoodAttr = getHtmlWithGoodAttr(this);
			
			jQuery(nodeWithGoodAttr).wrap('<div></div>');
			
			carouselContent += jQuery(nodeWithGoodAttr).parent().html() +"\n";
		});
		
		jQuery(this).html(carouselContent);
	});
	
	jQuery(mainTextareaContent).find("[data-vec='content']").unwrap(); // On enlève la 'div' que l'on a ajoutée autour du vec="content"
	
	
	
	
	
	// On rajoute les balises 'script' (au cas où il y en ait)
	for (var i = 0; i < scriptsArray.length; i++)
	{
		var script = document.createElement("script");
		
		// Type
		var quote = '"';
		var indexTypeStart = scriptsArray[i]["script"].indexOf("type="+ quote);
		
		if (indexTypeStart == -1)
		{
			quote = "'";
			indexTypeStart = scriptsArray[i]["script"].indexOf("type="+ quote);
		}
		
		if (indexTypeStart != -1)
		{
			var indexTypeEnd = scriptsArray[i]["script"].indexOf(quote, indexTypeStart + 6);
			var type = scriptsArray[i]["script"].substring(indexTypeStart + 6, indexTypeEnd);
			
			script.type = type;
		}
		
		// Src
		var quote = '"';
		var indexSrcStart = scriptsArray[i]["script"].indexOf("src="+ quote);
		
		if (indexSrcStart == -1)
		{
			quote = "'";
			indexSrcStart = scriptsArray[i]["script"].indexOf("type="+ quote);
		}
		
		if (indexSrcStart != -1)
		{
			var indexSrcEnd = scriptsArray[i]["script"].indexOf(quote, indexSrcStart + 5);
			var src = scriptsArray[i]["script"].substring(indexSrcStart + 5, indexSrcEnd);
			
			script.src = src;
		}
		
		// Contenu
		var indexContentStart = scriptsArray[i]["script"].indexOf(">");
		var indexContentEnd = scriptsArray[i]["script"].indexOf("</", indexContentStart + 1);
		
		if ((indexContentEnd - indexContentStart) > 1)
		{
			var contentScript = scriptsArray[i]["script"].substring(indexContentStart + 1, indexContentEnd);
			script.text = contentScript;
		}
		
		jQuery(mainTextareaContent).find("."+ scriptsArray[i]["class"]).append(script); // On ajoute les scripts à la fin de la page
	}
	
	
	mainTextareaContent = cleanupContent(mainTextareaContent);
	
	
	jQuery("textarea#content").val(jQuery(mainTextareaContent).html()); // On insère le contenu dans le textarea WordPress
}


function getHtmlWithGoodAttr(vecNode)
{
	jQuery(vecNode).find("[data-vec-attr-remove]").each(function()
	{
		var stringAttr = jQuery(this).attr("data-vec-attr-remove");
		stringAttr = stringAttr.trim();
		var arrayAttr = stringAttr.split(" "); // On récupère tous les attributs modifiés, dans un tableau
		for (var i = 0; i < arrayAttr.length; i++)
		{
			if (typeof(jQuery(this).attr("data-vec-tmp-"+ arrayAttr[i])) != "undefined")
			{
				jQuery(this).attr(arrayAttr[i], jQuery(this).attr("data-vec-tmp-"+ arrayAttr[i]));
				jQuery(this).removeAttr("data-vec-tmp-"+ arrayAttr[i]);
			}
			else
				jQuery(this).removeAttr(arrayAttr[i]);
		}
	});
	
	jQuery(vecNode).find("*").removeAttr("data-vec-attr-remove");
	
	return vecNode;
}

// Fonction appelée depuis l'iframe. Permet d'ouvrir la popin WordPress d'insertion de lien.
function openLinksPopin()
{
	wpActiveEditor = true;
	
	wpLinkL10n =
	{
		"title": "Insérer un lien",
		"update": "Mettre à jour",
		"save": "Ajouter un lien",
		"noTitle": "(pas de titre)",
		"noMatchesFound": "Aucun résultat."
	};
	
	
	wpLink.open("content");
	
	jQuery("#wp-link-submit").off("click");
	jQuery("#wpwrap").off("click", "#wp-link-submit");
	jQuery("#wpwrap").on("click", "#wp-link-submit", function(event)
	{
		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation();
		
		var linkAtts = wpLink.getAttrs(); // the links attributes (href, target) are stored in an object, which can be access via  wpLink.getAttrs()
		
		wpLink.textarea = jQuery("#visual-editable-content-editor"); // to close the link dialogue, it is again expecting an wp_editor instance, so you need to give it something to set focus back to. In this case, I'm using body, but the textfield with the URL would be fine
		wpLink.close(); //close the dialogue
		
		jQuery("#visual-editable-content-editor")[0].contentWindow.setVecLink(linkAtts.href, linkAtts.target);
		
		return false;
	});
	
	jQuery("#wp-link-close").off("click");
	jQuery("#wp-link-cancel, #wp-link-cancel *").off("click");
	jQuery("#wp-link-backdrop").off("click");
	jQuery("#wpwrap").on("click", "#wp-link-close, #wp-link-cancel, #wp-link-backdrop", function(event)
	{
		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation();
		
		wpLink.textarea = jQuery("#visual-editable-content-editor"); // to close the link dialogue, it is again expecting an wp_editor instance, so you need to give it something to set focus back to. In this case, I'm using body, but the textfield with the URL would be fine
		wpLink.close(); //close the dialogue
		
		return false;
	});
}


// Fonction permettant de 'nettoyer' certains éléments du contenu final.
function cleanupContent(contentToCleanup)
{
	// Nettoyage des 'ul' rajoutés
	jQuery(contentToCleanup).find("[data-vec-tmp='ul-tmp']").each(function()
	{
		// On fait en sorte que les 'li' soient éditables
		jQuery(this).find("li").each(function()
		{
			jQuery(this).attr("data-vec", "txt").after("\n");
		});
		
		jQuery(this).removeAttr("data-vec-tmp"); // On enlève l'attribut temporaire
	});
	
	// Nettoyage des 'p' rajoutés lors de l'ajout des 'ul'
	jQuery(contentToCleanup).find("[data-vec-tmp='txt-ul-split']").each(function()
	{
		jQuery(this).removeAttr("data-vec-tmp").attr("data-vec", "txt"); // On enlève l'attribut temporaire et on fait en sorte que 'p' soit éditable
	});
	
	// On enlève les noeuds vides
	jQuery(contentToCleanup).find("[data-vec~='txt']:empty").remove();
	// On supprime les élément qui n'ont qu'un 'br' à l'intérieur
	jQuery(contentToCleanup).find("[data-vec~='txt']").each(function()
	{
		if (jQuery(this).html() == "<br>" || jQuery(this).html() == "<br />")
			jQuery(this).remove();
	});
	jQuery(contentToCleanup).find("ul:empty").remove();
	
	// On enlève les span vides
	jQuery(contentToCleanup).find("[data-vec~='txt'] span").each(function()
	{
		if (jQuery(this).html() == "<br>" || jQuery(this).html() == "<br />" || jQuery.trim(jQuery(this).html()) == "")
			jQuery(this).remove();
	});
	
	return contentToCleanup;
}


// On ferme le module (pas utilisé finalement)
function closeVisualEditableContent()
{
	jQuery("#visual-editable-content-editor").attr("src", "");
	jQuery("#visual-editable-content-show").css({"display": "inline-block"});
}