/**
	Script g�rant les animations de transition.
*/

(function($)
{
	$(window).load(function()
	{
		initVecTransitions();
		$(window).resize(function()
		{
			if ($(window).width() > mobileResolution && (currentResolutionTransition == "" || currentResolutionTransition != "desktop"))
			{
				currentResolutionTransition = "desktop";
				initVecTransitions();
			}
			else if ($(window).width() <= mobileResolution && (currentResolutionTransition == "" || currentResolutionTransition != "mobile"))
			{
				currentResolutionTransition = "mobile";
				initVecTransitions();
			}
		});
	});
	
	
	var attrVecTransition = "[data-vec~='transition']";
	
	var mobileDEResolution = 1023;
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
		
		$("[data-vec-transition-direct='true']"+ transitionPlatform).addClass("transition"); // On joue l'animation directement pour ceux-l�
		
		
		// �v�nement sur le scroll
		checkVecTransition();
		$(window).off("scroll");
		$(window).on("scroll", function()
		{
			checkVecTransition();
			
			checkVecReset();
		});
	}
	
	// Fonction permettant de v�rifier la position des �l�ments qui doivent jouer une animation
	function checkVecTransition()
	{
		/*if ($(window).width() > mobileDEResolution)
			transitionPlatform = "[data-vec-transition-desktop='true']";
		else
			transitionPlatform = "[data-vec-transition-mobile='true']";*/
		
		var transitionPlatform = vecCheckResolution();
		
		// $(attrVecTransition + transitionPlatform +":not(.transition):not([data-vec-transition-direct='true'])").each(function()
		$(attrVecTransition + transitionPlatform +":not(.transition):not([data-vec-transition-direct='true'])").each(function()
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
			
			if (($(this).offset().top + $(this).height()) > ($(window).scrollTop() + offsetForTopComingTop) && $(this).offset().top < ($(window).scrollTop() + $(window).height() - offsetForTopComingBottom))
			{
				$(this).addClass("transition");
			}
		});
	}
	
	function vecCheckResolution()
	{
		var transitionPlatformTxt;
		if ($(window).width() > mobileDEResolution)
			transitionPlatformTxt = "[data-vec-transition-desktop='true']";
		else
			transitionPlatformTxt = "[data-vec-transition-mobile='true']";
		
		return transitionPlatformTxt;
	}
	
	// Fonction permettant de g�rer un d�lai avant l'animation (s'il y en a un)
	function vecDelayManager(transitionPlatform)
	{
		$(attrVecTransition + transitionPlatform).each(function()
		{
			var delay = $(this).attr("data-vec-transition-delay");
			if (typeof(delay) == "undefined")
				delay = 0;
			
			$(this).css({"transition-delay": delay +"ms"});
		});
	}
	
	
	// Fonction permettant de r�initialiser les animations que l'on autorise � se rejouer si elles se retrouvent � nouveau sous le scroll
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