/**
	Script gérant les animations de transition.
*/

(function($)
{
	$(window).load(function()
	{
		initVecTransitions();
		$(window).resize(function()
		{
			if ($(window).width() > mobileVecResolution && (currentResolutionTransition == "" || currentResolutionTransition != "desktop"))
			{
				currentResolutionTransition = "desktop";
				initVecTransitions();
			}
			else if ($(window).width() <= mobileVecResolution && (currentResolutionTransition == "" || currentResolutionTransition != "mobile"))
			{
				currentResolutionTransition = "mobile";
				initVecTransitions();
			}
		});
	});
	
	
	var attrVecTransition = "[data-vec~='transition']";
	
	var mobileVecResolution = 1023;
	var currentResolutionTransition = "";
	
	function initVecTransitions()
	{
		var transitionPlatform = vecCheckResolution();
		/*$("[data-vec-transition-direct='true']"+ transitionPlatform).each(function()
		{
			delay = $(this).attr("data-vec-transition-delay");
			if (typeof(delay) == "undefined")
				delay = 0;
			
			$(this).css({"transition-delay": delay +"ms"});
		});*/
		vecDelayManager(transitionPlatform);
		
		$("[data-vec-transition-direct='true']"+ transitionPlatform).addClass("transition"); // On joue l'animation directement pour ceux-là
		
		
		// Événement sur le scroll
		checkVecTransition();
		// $(window).off("scroll");
		$(window).on("scroll", function()
		{
			checkVecTransition();
			
			checkVecReset();
		});
	}
	
	// Fonction permettant de vérifier la position des éléments qui doivent jouer une animation
	function checkVecTransition()
	{
		/*if ($(window).width() > mobileVecResolution)
			transitionPlatform = "[data-vec-transition-desktop='true']";
		else
			transitionPlatform = "[data-vec-transition-mobile='true']";*/
		
		var transitionPlatform = vecCheckResolution();
		
		// $(attrVecTransition + transitionPlatform +":not(.transition):not([data-vec-transition-direct='true'])").each(function()
		$(attrVecTransition + transitionPlatform +":not(.transition):not([data-vec-transition-direct='true']):not([data-vec-transition-rel])").each(function()
		{
			// var offsetForTopComingTop = $(window).height() / 2.3;
			// var offsetForTopComingBottom = $(window).height() / 2.3;
			var offsetForTopComingTop = 100;
			var offsetForTopComingBottom = 100;
			/*if ($(this).attr("data-vec-transition") == "top" || $(this).attr("data-vec-transition") == "top-small")
			{
				
				// offsetForTopComingTop -= $(this).css("translateY");
				// offsetForTopComingTop = $(window).height() / 2;
				// offsetForTopComingBottom = $(window).height() / 9;
			}
			if ($(this).attr("data-vec-transition") == "bottom" || $(this).attr("data-vec-transition") == "bottom-small")
			{
				// var matrix = new WebKitCSSMatrix($(this).css("transform"));
				
				// offsetForTopComingTop = 100;
				// offsetForTopComingBottom = 100;
			}*/
			
			var matrix = $(this).css("transform");
			if (typeof(matrix) != "undefined" && matrix != "none")
			{
				var translateY = parseInt(matrix.split(',')[5]) *1;
				
				offsetForTopComingTop += translateY;
				offsetForTopComingBottom -= translateY;
			}
			
			var paddingTop = $(this).css("padding-top").substring(0, $(this).css("padding-top").length-2) * 1;
			
			// console.log(offsetForTopComingBottom);
			
			// if (($(this).offset().top + $(this).height()) > ($(window).scrollTop() + offsetForTopComingTop) && $(this).offset().top < ($(window).scrollTop() + $(window).height() - offsetForTopComingBottom))
			if (($(this).offset().top + $(this).height()) > ($(window).scrollTop() + offsetForTopComingTop) && ($(this).offset().top + paddingTop) < ($(window).scrollTop() + $(window).height() - offsetForTopComingBottom))
			{
				$(this).addClass("transition");
				
				// Si on a un élément qui doit s'animer en même temps que l'élément courant
				if (typeof ($(this).attr("data-vec-transition-rel-trigger")) != "undefined")
					$("[data-vec-transition-rel='"+ $(this).attr("data-vec-transition-rel-trigger") +"']").addClass("transition");
			}
		});
	}
	
	function vecCheckResolution()
	{
		var transitionPlatformTxt;
		if ($(window).width() > mobileVecResolution)
			transitionPlatformTxt = "[data-vec-transition-desktop='true']";
		else
			transitionPlatformTxt = "[data-vec-transition-mobile='true']";
		
		return transitionPlatformTxt;
	}
	
	// Fonction permettant de gérer un délai avant l'animation (s'il y en a un)
	function vecDelayManager(transitionPlatform)
	{
		$(attrVecTransition + transitionPlatform).each(function()
		{
			var delay = $(this).attr("data-vec-transition-delay");
			if (typeof(delay) == "undefined")
				delay = 0;
			else
				$(this).css({"transition-delay": delay +"ms"});
		});
	}
	
	
	// Fonction permettant de réinitialiser les animations que l'on autorise à se rejouer si elles se retrouvent à nouveau sous le scroll
	function checkVecReset()
	{
		$(attrVecTransition +".transition[data-vec-transition-reset='true']:not([data-vec-transition-direct='true'])").each(function()
		{
			if (($(this).offset().top > $(window).scrollTop() + $(window).height() + 50))
			{
				$(this).removeClass("transition");
			}
		});
	}
})(jQuery);
