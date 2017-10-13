/**
	Script gérant l'ouverture d'images dans une popin.
*/

(function ($)
{
	VecPictures = function (arguments)
	{
		var self = this;
		
		// Arguments
		self.selector = arguments["selector"];
		self.sourceAttribute = arguments["sourceAttribute"];
		self.textAttribute = arguments["textAttribute"] || false;
		self.touchThreshold = arguments["touchThreshold"] || 50;
		
		
		self.dataPictures = $("[data-vec-pictures='"+ self.selector +"']");
		self.currentPictureIndex;
		
		self.htmlOverflow = $("html").css("overflow");
		
		// Initialisation de la popin
		self.dataPictures.on("click", function () {
			self.initPopin();
			self.initEvents();
			
			self.currentPictureIndex = self.dataPictures.index(this);
			self.loadPicture(self.currentPictureIndex);
			
			$("html").css({"overflow": "hidden"});
		});
	};
	
	
	var vecPicturesTouchStartX = 0;
	var vecPicturesCanSlide = true;
	
	// Initialisation de la popin
	VecPictures.prototype.initPopin = function ()
	{
		var self = this;
		
		if (self.dataPictures.length == 1) {
			self.canChangePicture = false;
			
			$("#pictures-popin-container .arrow").addClass("display-none");
		} else {
			self.canChangePicture = true;
			
			$("#pictures-popin-container .arrow").removeClass("display-none");
		}
	};
	
	// Gestion des événements
	VecPictures.prototype.initEvents = function ()
	{
		var self = this;
		
		// Clic sur les flèches
		$("#pictures-popin-container").off("click", ".arrow");
		$("#pictures-popin-container").on("click", ".arrow", function () {
			if ($(this).hasClass("arrow-left")) {
				self.changePicture(-1);
			} else {
				self.changePicture(1);
			}
		});
		
		// Si on presse une touche du clavier
		$("body").off("keydown");
		$("body").on("keydown", function (event) {
			// Si une image est déjà affichée dans la popin
			if ($("#pictures-popin-container #pictures-popin").hasClass("open")) {
				// On bloque les événements par défaut des flèches du clavier
				if (event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 || event.keyCode == 40) {
					event.preventDefault();
				}
				
				// Flèche de gauche
				if (event.keyCode == 37) {
					self.changePicture(-1);
				}
				
				// Flèche de droite
				if (event.keyCode == 39) {
					self.changePicture(1);
				}
				
				// Échap
				if (event.keyCode == 27) {
					self.closePopin();
				}
			}
		});
		
		// On glisse le doigt
		$("#pictures-popin-container").off("touchstart", ".big-picture");
		$("#pictures-popin-container").on("touchstart", ".big-picture", function (event) {
			var touches = event.originalEvent.touches;
			
			vecPicturesTouchStartX = touches[0].pageX;
		});
		$("#pictures-popin-container").off("touchmove", ".big-picture");
		$("#pictures-popin-container").on("touchmove", ".big-picture", function (event) {
			var touches = event.originalEvent.touches;
			
			var diff = vecPicturesTouchStartX - touches[0].pageX;
			if (Math.abs(diff) > self.touchThreshold && vecPicturesCanSlide) {
				vecPicturesCanSlide = false;
				
				if (diff < 0) {
					self.changePicture(-1);
				} else {
					self.changePicture(1);
				}
			}
		});
		$("#pictures-popin-container").off("touchend", ".big-picture");
		$("#pictures-popin-container").on("touchend", ".big-picture", function (event) {
			vecPicturesCanSlide = true;
		});
		
		// Clic sur le bouton de fermeture de la popin
		$("#pictures-popin-container").off("click", ".close");
		$("#pictures-popin-container").on("click", ".close", function () {
			self.closePopin();
		});
	};
	
	// Chargement de l'image dont l'index est passé en paramètre
	VecPictures.prototype.loadPicture = function (pictureIndex)
	{
		var self = this;
		
		var picture = new Image();
		picture.src = $("[data-vec-pictures='"+ self.selector +"']:eq("+ pictureIndex +")").attr(self.sourceAttribute);
		
		var pictureDescription = "";
		if (self.textAttribute) {
			pictureDescription = $("[data-vec-pictures='"+ self.selector +"']:eq("+ pictureIndex +")").attr(self.textAttribute);
		}
		
		$("#pictures-popin-container .big-picture").addClass("loading");
		
		self.showLoader();
		
		// Dès que la photo est chargée
		picture.onload = function (event) {
			self.hideLoader();
			$("#pictures-popin-container .big-picture").removeClass("loading");
			
			// $("#pictures-popin-container .big-picture").css({"width": this.width, "height": this.height});
			$("#pictures-popin-container .big-picture").attr("src", this.src);
			
			$("#pictures-popin-container .text").html(pictureDescription);
			
			self.openPicture();
		};
	};
	
	// Affichage du loader
	VecPictures.prototype.showLoader = function ()
	{
		// Loader de la popin
		if (!$("#pictures-popin-container").hasClass("open")) {
			$("#pictures-popin-container, #pictures-popin-container .loader-popin").addClass("open");
		}
		
		// Loader de l'image
		if ($("#pictures-popin-container").hasClass("open")) {
			$("#pictures-popin-container .loader-picture").addClass("open");
		}
	};
	
	// Disparition du loader
	VecPictures.prototype.hideLoader = function ()
	{
		$("#pictures-popin-container .loader-popin, #pictures-popin-container .loader-picture").removeClass("open");
	}
	
	
	// Ouverture de l'image dans la popin
	VecPictures.prototype.openPicture = function ()
	{
		if (!$("#pictures-popin-container #pictures-popin").hasClass("open")) {
			$("#pictures-popin-container #pictures-popin").addClass("open");
		}
	};
	
	// Fermeture de la popin
	VecPictures.prototype.closePopin = function ()
	{
		var self = this;
		
		$("#pictures-popin-container, #pictures-popin-container #pictures-popin").removeClass("open");
		
		$("html").css({"overflow": self.htmlOverflow});
	};
	
	// Changement de l'image à afficher
	VecPictures.prototype.changePicture = function (direction)
	{
		var self = this;
		
		if (self.canChangePicture) {
			self.currentPictureIndex += direction;
			
			if (self.currentPictureIndex < 0) {
				self.currentPictureIndex = self.dataPictures.length - 1;
			}
			if (self.currentPictureIndex >= self.dataPictures.length) {
				self.currentPictureIndex = 0;
			}
			
			self.loadPicture(self.currentPictureIndex);
		}
	};
})(jQuery);
