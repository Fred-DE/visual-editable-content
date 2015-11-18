/**
	Script g�rant les carousels.
*/

(function($)
{
	// var vecCarousel = MONAPPLICATION || {};
	
	var mobileResolution = 1023;
	
	var durationVecCarouselSlide = 600;
	
	var sliderTouchStartX = 0;
	// var sliderThreshold = 20;
	var sliderThreshold = 50;
	
	window.VecCarousel = function(arguments)
	{
		var self = this;
		
		this.vecCarousel = arguments["vecCarousel"];
		this.nbItems = arguments["nbItems"];
		this.fillWithBlank = arguments["fillWithBlank"] || false;
		this.hasArrows = arguments["hasArrows"] || false;
		this.hasNavigation = arguments["hasNavigation"] || false;
		this.isLooping = arguments["isLooping"] || false;
		this.timerDuration = arguments["timerDuration"] || 0;
		
		this.currentIndex = 0;
		this.isAnimatingVecCarouselSlide = false;
		
		self.setVecCarousel();
		
		self.loadPictures();
		
		// Clic sur une fl�che
		$(self.vecCarousel).off("click", ".vec-carousel-slide-button");
		$(self.vecCarousel).on("click", ".vec-carousel-slide-button", function()
		{
			var newIndex;
			if ($(this).attr("data-vec") == "carousel-left-button")
				newIndex = self.currentIndex - 1;
			else
				newIndex = self.currentIndex + 1;
			
			var loop = false;
			if (newIndex < 0)
			{
				newIndex = $(self.vecCarousel).find("[data-vec-carousel-screen]").length - 1;
				loop = true;
			}
			else if (newIndex > $(self.vecCarousel).find("[data-vec-carousel-screen]").length - 1)
			{
				newIndex = 0;
				loop = true;
			}
			
			self.vecCarouselSlide(newIndex, loop);
		});
		
		// Clic sur la navigation
		$(self.vecCarousel).off("click", ".vec-carousel-nav-button:not(.active)");
		$(self.vecCarousel).on("click", ".vec-carousel-nav-button:not(.active)", function()
		{
			self.vecCarouselSlide($(this).index());
		});
		
		
		// On glisse le doigt sur mobile (si on a plusieurs �crans)
		if ($(self.vecCarousel).find(".data-vec-carousel-screen-content").length > 1)
		{
			$(self.vecCarousel).off("touchstart");
			$(self.vecCarousel).on("touchstart", "[data-vec='carousel-container']", function(event)
			{
				if ($(self.vecCarousel).find(".data-vec-carousel-screen-content").length > 1)
					self.vecCarouselTouchStart(event);
			});
			$(self.vecCarousel).off("touchmove");
			$(self.vecCarousel).on("touchmove", "[data-vec='carousel-container']", function(event)
			{
				if ($(self.vecCarousel).find(".data-vec-carousel-screen-content").length > 1)
					self.vecCarouselTouchMove(event);
			});
		}
		
		// Si on veut faire slider le carousel avec un timer
		if (self.timerDuration != 0)
		{
			setInterval(function()
			{
				var newIndex;
				newIndex = self.currentIndex + 1;
				
				var loop = false;
				if (newIndex > $(self.vecCarousel).find("[data-vec-carousel-screen]").length - 1)
				{
					newIndex = 0;
					loop = true;
				}
				
				self.vecCarouselSlide(newIndex, loop);
			}, self.timerDuration);
		}
	};
	
	// Permet d'attendre que les images du carousel soient charg�e avant de l'afficher
	VecCarousel.prototype.loadPictures = function()
	{
		var self = this;
		
		// $(self.vecCarousel).css({"visibility": "hidden"});
		
		var imagesCarousel = $(self.vecCarousel +" img");
		var loadedImagesCount = 0;

		imagesCarousel.load(function()
		{
			loadedImagesCount++;

			if (loadedImagesCount == imagesCarousel.length)
				$(self.vecCarousel).css({"visibility": "visible"});
			
		}).each(function()
		{
			loadedImagesCount++;

			if (loadedImagesCount == imagesCarousel.length)
				$(self.vecCarousel).css({"visibility": "visible"});
			
		});;
	}
	
	
	// M�thode permettant d'initialiser le carousel
	VecCarousel.prototype.setVecCarousel = function()
	{
		var self = this;
		
		// Si le carousel a d�j� �t� initialis� mais que l'on change de r�solution
		if ($(self.vecCarousel).find(".data-vec-carousel-screen-content").length > 0)
		{
			var nbVecCarouselScreens = $(self.vecCarousel).find(".data-vec-carousel-screen-content").length;
			// On r�initialise les �l�ments du carousel sans les wrappers
			for (var i = nbVecCarouselScreens - 1; i >= 0; i--)
			{
				$(self.vecCarousel).find("[data-vec-carousel-screen='"+ i +"'] [data-vec='carousel-item']:first-child").unwrap();
				$(self.vecCarousel).find("[data-vec-carousel-screen='"+ i +"'] [data-vec='carousel-item']:first-child").unwrap();
				
				$(self.vecCarousel).find("[data-vec-item-blank]").remove();
			}
		}
		
		// On ajoute un attribut sur les items pour savoir sur quel �cran du carousel ils seront (attribut temporaire)
		var currentScreen = -1;
		$(self.vecCarousel).find("[data-vec='carousel-item']").each(function(i)
		{
			if (i % self.nbItems == 0)
				currentScreen++;
			
			$(this).attr("data-vec-carousel-screen-tmp", currentScreen);
		});
		
		// On place les item du carousel dans un container qui servira d'�cran, et on supprime l'aatribut temporaire cr�� juste avant
		for (var i = 0; i <= currentScreen; i++)
		{
			$(self.vecCarousel).find("[data-vec-carousel-screen-tmp='"+ i +"']").wrapAll('<div data-vec-carousel-screen="'+ i +'" /></div>');
			var txtFillBlank = "";
			
			if (!self.fillWithBlank && i == currentScreen && $(self.vecCarousel).find("[data-vec='carousel-item']").length / (currentScreen+1) != self.nbItems || self.nbItems == 1)
				txtFillBlank = 'no-blank';
			
			$(self.vecCarousel).find("[data-vec-carousel-screen-tmp='"+ i +"']").wrapAll('<div class="data-vec-carousel-screen-content '+ txtFillBlank +'"></div>');
			$(self.vecCarousel).find("[data-vec-carousel-screen='"+ i +"'] [data-vec-carousel-screen-tmp='"+ i +"']").removeAttr("data-vec-carousel-screen-tmp");
		}
		
		var maxHeightCarouselScreen = -1;
		$(self.vecCarousel).find("div[data-vec-carousel-screen]").each(function()
		{
			if ($(this).height() > maxHeightCarouselScreen)
				maxHeightCarouselScreen = $(this).height();
		});
		$(self.vecCarousel).find("div[data-vec='carousel-container']").css({"height": maxHeightCarouselScreen +"px"});
		$(self.vecCarousel).find("div[data-vec-carousel-screen]").css({"height": "100%"});
		
		$(self.vecCarousel).find("[data-vec='carousel-item']").after(" "); // Pour ajouter un espace entre les balises pour que le justify fonctionne
		
		// On rajoute des blocs pour combler les �ventuels vides pour garder la mise en page justifi�e
		if (self.fillWithBlank)
		{
			$(self.vecCarousel).find(".data-vec-carousel-screen-content").each(function()
			{
				if ($(this).find("[data-vec='carousel-item']").length < self.nbItems)
				{
					var nbItemsToAdd = self.nbItems - $(this).find("[data-vec='carousel-item']").length;
					// On doit vider les blancs
					for (var i = 0; i < nbItemsToAdd; i++)
					{
						$(this).append('<div data-vec="carousel-item" data-vec-item-blank></div>');
					}
				}
			});
		}
		
		
		// Fl�ches
		if (self.hasArrows && $(self.vecCarousel).find(".data-vec-carousel-screen-content").length > 1)
		{
			$(self.vecCarousel).find(".vec-carousel-slide-button").css({"display": "inline-block"});
		}
		else
		{
			$(self.vecCarousel).find(".vec-carousel-slide-button").css({"display": "none"});
		}
		
		// Navigation
		if (self.hasNavigation)
		{
			$(self.vecCarousel).find("[data-vec='carousel-nav']").css({"display": "block"}).empty();
			// $(self.vecCarousel).find("div[data-vec='carousel-nav']").empty();
			
			if ($(self.vecCarousel).find("div[data-vec-carousel-screen]").length > 1) // Si on a plusieurs �crans
			{
				var vecCarouselNavButton = '<div class="vec-carousel-nav-button"><div class="shape"></div></div>';
				
				// On ajoute autant de boutons que d'�crans
				for (var i = 0; i < $(self.vecCarousel).find("div[data-vec-carousel-screen]").length; i++)
				{
					$(self.vecCarousel).find("div[data-vec='carousel-nav']").append(vecCarouselNavButton);
				}
				
				$(self.vecCarousel).find("div[data-vec='carousel-nav'] .vec-carousel-nav-button:first-child").addClass("active");
			}
		}
		else
		{
			$(self.vecCarousel).find("[data-vec='carousel-nav']").css({"display": "none"});
		}
	};
	
	
	
	VecCarousel.prototype.vecCarouselTouchStart = function(evt)
	{
		var touches = evt.originalEvent.touches;
		
		sliderTouchStartX = touches[0].pageX;
	};
	
	VecCarousel.prototype.vecCarouselTouchMove = function(evt)
	{
		var touches = evt.originalEvent.touches;
		
		var diff = sliderTouchStartX - touches[0].pageX;
		if (Math.abs(diff) > sliderThreshold)
		{
			var newIndex;
			if (diff < 0)
				newIndex = this.currentIndex - 1;
			else
				newIndex = this.currentIndex + 1;
			
			var loop = false;
			if (newIndex < 0)
			{
				newIndex = $(this.vecCarousel).find("[data-vec-carousel-screen]").length - 1;
				loop = true;
			}
			else if (newIndex > $(this.vecCarousel).find("[data-vec-carousel-screen]").length - 1)
			{
				newIndex = 0;
				loop = true;
			}
			
			this.vecCarouselSlide(newIndex, loop);
		}
	};
	
	
	// M�thode permettant de slider jusqu'� l'�cran dont l'indice est pass� en param�tre
	VecCarousel.prototype.vecCarouselSlide = function(index, loop)
	{
		var self = this;
		
		if (typeof(loop) == "undefined")
			loop = false;

		if (!self.isAnimatingVecCarouselSlide)
		{
			self.isAnimatingVecCarouselSlide = true;
			
			// On r�cup�re l'�cran courant
			/*var currentIndex = $(self.vecCarousel).find("div[data-vec='carousel-nav'] .vec-carousel-nav-button.active").index();
			var direction = 1;
			if (index < currentIndex)
				direction = -1;*/
			var direction = 1;
			if (index < self.currentIndex)
				direction = -1;
			
			if (loop)
				direction *= -1;
			
			// On met � jour la navigation
			$(self.vecCarousel).find("div[data-vec='carousel-nav'] .vec-carousel-nav-button").removeClass("active");
			$(self.vecCarousel).find("div[data-vec='carousel-nav'] .vec-carousel-nav-button:eq("+ index +")").addClass("active");
			
			$(self.vecCarousel).find("[data-vec-carousel-screen='"+ index +"']").css({"left": (100 * direction) +"%"}); // On place l'�cran � afficher sur un bord de l'�cran (gauche ou droite, selon la direction du slide)
			
			$(self.vecCarousel).find("[data-vec-carousel-screen='"+ index +"']").animate({"left": "0px"}, {duration: durationVecCarouselSlide, easing: "linear", complete: function()
			{
				self.isAnimatingVecCarouselSlide = false;
				self.currentIndex = index;
			}});
			
			$(self.vecCarousel).find("[data-vec-carousel-screen='"+ self.currentIndex +"']").animate({"left": -(100 * direction) +"%"}, {duration: durationVecCarouselSlide, easing: "linear"});
		}
	};
})(jQuery);