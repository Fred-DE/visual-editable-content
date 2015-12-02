/**
	Script gérant les carousels.
*/

(function($)
{
	// var vecCarousel = MONAPPLICATION || {};
	// var VecCarousel = {};
	
	
	
	/*window.*/VecCarousel = function(arguments)
	{
		var self = this;
		
		this.vecCarousel = arguments["vecCarousel"];
		this.nbItems = arguments["nbItems"];
		this.fillWithBlank = arguments["fillWithBlank"] || false;
		this.hasArrows = arguments["hasArrows"] || false;
		this.hasNavigation = arguments["hasNavigation"] || false;
		if (typeof(arguments["isLooping"]) == "undefined")
			this.isLooping = true
		else
			this.isLooping = arguments["isLooping"];
		this.timerDuration = arguments["timerDuration"] || 0;
		this.sliderThreshold = arguments["threshold"] || 50;
		
		VecCarousel.allInstances.push(this);
		
		this.currentIndex = 0;
		this.isAnimatingVecCarouselSlide = false;
		
		self.setVecCarousel();
		
		self.loadPictures();
		
		// Clic sur une flèche
		$(self.vecCarousel).off("click", ".vec-carousel-slide-button");
		$(self.vecCarousel).on("click", ".vec-carousel-slide-button", function()
		{
			if ($(this).attr("data-vec") == "carousel-left-button")
				self.vecCarouselBeforeSlide("left");
			else
				self.vecCarouselBeforeSlide("right");
			
			/*var newIndex;
			if ($(this).attr("data-vec") == "carousel-left-button")
				newIndex = self.currentIndex - 1;
			else
				newIndex = self.currentIndex + 1;
			
			var loop = false;
			if (self.isLooping)
			{
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
			}
			
			self.vecCarouselSlide(newIndex, loop);*/
		});
		
		// Clic sur la navigation
		$(self.vecCarousel).off("click", ".vec-carousel-nav-button:not(.active)");
		$(self.vecCarousel).on("click", ".vec-carousel-nav-button:not(.active)", function()
		{
			self.vecCarouselSlide($(this).index());
		});
		
		
		// On glisse le doigt sur mobile (si on a plusieurs écrans)
		if ($(self.vecCarousel).find(".data-vec-carousel-screen-content").length > 1)
		{
			$(self.vecCarousel).off("touchstart");
			$(self.vecCarousel).on("touchstart", "[data-vec~='carousel-container']", function(event)
			{
				if ($(self.vecCarousel).find(".data-vec-carousel-screen-content").length > 1)
					self.vecCarouselTouchStart(event);
			});
			$(self.vecCarousel).off("touchmove");
			$(self.vecCarousel).on("touchmove", "[data-vec~='carousel-container']", function(event)
			{
				if ($(self.vecCarousel).find(".data-vec-carousel-screen-content").length > 1)
					self.vecCarouselTouchMove(event);
			});
		}
		
		// Si on veut faire slider le carousel avec un timer
		if (self.timerDuration != 0)
		{
			this.timerInterval;
			
			self.timerManager();
		}
	};
	
	
	
	VecCarousel.allInstances = new Array();
	
	// var mobileResolution = 1023;
	
	var durationVecCarouselSlide = 600;
	
	var sliderTouchStartX = 0;
	// var sliderThreshold = 50;
	
	
	// Permet d'attendre que les images du carousel soient chargée avant de l'afficher
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
			
		});
	}
	
	
	// Méthode permettant d'initialiser le carousel
	VecCarousel.prototype.setVecCarousel = function()
	{
		var self = this;
		
		// Si le carousel a déjà été initialisé mais que l'on change de résolution
		if ($(self.vecCarousel).find(".data-vec-carousel-screen-content").length > 0)
		{
			var nbVecCarouselScreens = $(self.vecCarousel).find(".data-vec-carousel-screen-content").length;
			// On réinitialise les éléments du carousel sans les wrappers
			for (var i = nbVecCarouselScreens - 1; i >= 0; i--)
			{
				$(self.vecCarousel).find("[data-vec-carousel-screen='"+ i +"'] [data-vec='carousel-item']:first-child").unwrap();
				$(self.vecCarousel).find("[data-vec-carousel-screen='"+ i +"'] [data-vec='carousel-item']:first-child").unwrap();
				
				$(self.vecCarousel).find("[data-vec-item-blank]").remove();
			}
		}
		
		// On ajoute un attribut sur les items pour savoir sur quel écran du carousel ils seront (attribut temporaire)
		var currentScreen = -1;
		$(self.vecCarousel).find("[data-vec='carousel-item']").each(function(i)
		{
			if (i % self.nbItems == 0)
				currentScreen++;
			
			$(this).attr("data-vec-carousel-screen-tmp", currentScreen);
		});
		
		// On place les item du carousel dans un container qui servira d'écran, et on supprime l'aatribut temporaire créé juste avant
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
		$(self.vecCarousel).find("div[data-vec~='carousel-container']").css({"height": maxHeightCarouselScreen +"px"});
		$(self.vecCarousel).find("div[data-vec-carousel-screen]").css({"height": "100%"});
		
		$(self.vecCarousel).find("[data-vec='carousel-item']").after(" "); // Pour ajouter un espace entre les balises pour que le justify fonctionne
		
		// On rajoute des blocs pour combler les éventuels vides pour garder la mise en page justifiée
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
		
		
		// Flèches
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
			
			if ($(self.vecCarousel).find("div[data-vec-carousel-screen]").length > 1) // Si on a plusieurs écrans
			{
				var vecCarouselNavButton = '<div class="vec-carousel-nav-button"><div class="shape"></div></div>';
				
				// On ajoute autant de boutons que d'écrans
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
		
		self.vecCarouselAfterSlide();
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
		if (Math.abs(diff) > this.sliderThreshold)
		{
			if (diff < 0)
				this.vecCarouselBeforeSlide("left");
			else
				this.vecCarouselBeforeSlide("right");
			
			/*var newIndex;
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
			
			this.vecCarouselSlide(newIndex, loop);*/
		}
	};
	
	
	VecCarousel.prototype.vecCarouselBeforeSlide = function(direction)
	{
		var newIndex;
		// if (diff < 0)
		if (direction == "left")
			newIndex = this.currentIndex - 1;
		else
			newIndex = this.currentIndex + 1;
		
		var loop = false;
		if (newIndex < 0)
		{
			newIndex = $(this.vecCarousel).find("[data-vec-carousel-screen]").length - 1;
			loop = true;
			
			if (!this.isLooping)
			{
				// $(this.vecCarousel).find("[data-vec='carousel-left-button']").addClass("hidden");
				return false;
			}
		}
		else if (newIndex > $(this.vecCarousel).find("[data-vec-carousel-screen]").length - 1)
		{
			newIndex = 0;
			loop = true;
			
			if (!this.isLooping)
			{
				// $(this.vecCarousel).find("[data-vec='carousel-right-button']").addClass("hidden");
				return false;
			}
		}
		
		this.vecCarouselSlide(newIndex, loop);
	};
	
	
	// Méthode permettant de slider jusqu'à l'écran dont l'indice est passé en paramètre
	VecCarousel.prototype.vecCarouselSlide = function(index, loop)
	{
		var self = this;
		
		if (typeof(loop) == "undefined")
			loop = false;

		if (!self.isAnimatingVecCarouselSlide)
		{
			self.isAnimatingVecCarouselSlide = true;
			
			// On récupère l'écran courant
			/*var currentIndex = $(self.vecCarousel).find("div[data-vec='carousel-nav'] .vec-carousel-nav-button.active").index();
			var direction = 1;
			if (index < currentIndex)
				direction = -1;*/
			
			var direction = 1;
			if (index < self.currentIndex)
				direction = -1;
			
			if (loop)
				direction *= -1;
			
			// On met à jour la navigation
			$(self.vecCarousel).find("div[data-vec='carousel-nav'] .vec-carousel-nav-button").removeClass("active");
			$(self.vecCarousel).find("div[data-vec='carousel-nav'] .vec-carousel-nav-button:eq("+ index +")").addClass("active");
			
			$(self.vecCarousel).find("[data-vec-carousel-screen='"+ index +"']").css({"left": (100 * direction) +"%"}); // On place l'écran à afficher sur un bord de l'écran (gauche ou droite, selon la direction du slide)
			
			$(self.vecCarousel).find("[data-vec-carousel-screen='"+ index +"']").animate({"left": "0px"}, {duration: durationVecCarouselSlide, easing: "linear", complete: function()
			{
				self.isAnimatingVecCarouselSlide = false;
				self.currentIndex = index;
				
				self.vecCarouselAfterSlide();
				
				if (self.timerDuration != 0) // Si on a un timer, on le reset
				{
					clearInterval(self.timerInterval);
					self.timerManager();
				}
			}});
			
			$(self.vecCarousel).find("[data-vec-carousel-screen='"+ self.currentIndex +"']").animate({"left": -(100 * direction) +"%"}, {duration: durationVecCarouselSlide, easing: "linear"});
		}
	};
	
	VecCarousel.prototype.vecCarouselAfterSlide = function()
	{
		if (this.hasArrows && !this.isLooping)
		{
			if (this.currentIndex == 0)
			{
				$(this.vecCarousel).find("[data-vec='carousel-left-button']").addClass("hidden");
			}
			else
			{
				$(this.vecCarousel).find("[data-vec='carousel-left-button']").removeClass("hidden");
			}
			
			if (this.currentIndex == $(this.vecCarousel).find("[data-vec-carousel-screen]").length - 1)
			{
				$(this.vecCarousel).find("[data-vec='carousel-right-button']").addClass("hidden");
			}
			else
			{
				$(this.vecCarousel).find("[data-vec='carousel-right-button']").removeClass("hidden");
			}
		}
	};
	
	
	VecCarousel.prototype.timerManager = function()
	{
		var self = this;
		
		self.timerInterval = setInterval(function()
		{
			if (!$(self.vecCarousel +":hover").length > 0) // Si le curseur est sur le carousel, on ne lance pas le slide
			{
				self.vecCarouselBeforeSlide("right");
				
				/*var newIndex;
				newIndex = self.currentIndex + 1;
				
				var loop = false;
				if (newIndex > $(self.vecCarousel).find("[data-vec-carousel-screen]").length - 1)
				{
					newIndex = 0;
					loop = true;
				}
				
				self.vecCarouselSlide(newIndex, loop);*/
			}
		}, self.timerDuration);
	};
	
	
	// Méthode statique permettant de retourner l'instance du VecCarousel qui appartient au carousel dont l'ID est passé en paramètre.
	VecCarousel.getInstanceById = function(idElement)
	{
		var idElementToCompare = "#"+ idElement;
		
		for (var i = 0; i < VecCarousel.allInstances.length; i++)
		{
			if (idElementToCompare == VecCarousel.allInstances[i].vecCarousel)
			{
				return VecCarousel.allInstances[i];
				break;
			}
		}
	}
})(jQuery);