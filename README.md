# Visual Editable Content

https://github.com/Fred-DE/visual-editable-content

Module WordPress permettant une édition visuelle de ses pages.


Si vous êtes tombés ici par hasard, sachez que ce module a été créé pour un besoin personnel. Il nécessite certaines connaissances pour le faire fonctionner correctement.
Cependant libre à vous de l'utiliser si vous le voulez.



## Instructions

Le contenu HTML qui doit être éditable a besoin d'être entouré par une div contenant l'attribut data-vec="content".

Les éléments de texte devant être éditable doivent contenir l'attribut data-vec="txt".

Les images data-vec="pic".

Un Carrousel doit être construit avec cette forme :

```
<div id="id-carrousel">
	<div data-vec="carousel-left-button" class="vec-carousel-slide-button"></div>
	
	<div data-vec="carousel-container">
		<div data-vec="carousel-item">Carousel 1</div>
		<div data-vec="carousel-item">Carousel 2</div>
		<div data-vec="carousel-item">Carousel 3</div>
		<div data-vec="carousel-item">Carousel 4</div>
		<div data-vec="carousel-item">Carousel 5</div>
	</div>
	
	<div data-vec="carousel-right-button" class="vec-carousel-slide-button"></div>

	<div data-vec="carousel-nav" class="grey"></div>
</div>
```

La div avec data-vec="carousel-container" est le carrousel en lui-même. C'est lui qui contient les éléments qui le composent. Chaque élément doit avoir l'attribut data-vec="carousel-item".
Si l'on souhaite ajouter des flèches pour faire tourner le carrousel, il faut ajouter des éléments avec les attributs data-vec="carousel-left-button" et data-vec="carousel-right-button".
Si l'on souhaite ajouter une navigation (boutons correspondant chacun à un écran du carrousel), il faut ajouter un élément avec l'attribut data-vec="carousel-nav".
Tous les éléments constituant le carrousel doivent être entourés par une div avec un id.

L'initialisation du carrousel se fait en instanciant une classe VecCarousel. Exemple :
```javascript
new VecCarousel(
{
	vecCarousel: "#id-carrousel", // id de la div contenant les éléments du carousel
	nbItems: 3, // Nombre d'éléments par écran
	fillWithBlank: false, // Remplir les blancs du dernier écran (s'il y en a) par des items vides (utile notamment lorsque les éléments d'un écran sont justifiés)
	hasArrows: false, // Si on active les flèches
	hasNavigation: true, // Si on active les boutons de navigation
	isLooping: true, // Si on souhaite que le carrousel puisse boucler (mettre à true seulement si on ne met pas de timer)
	timerDuration: 8000, // Durée du slide automatique, en millisecondes (mettre 0 ou ne pas renseigner pour qu'il n'y ait pas de slide automatique)
	threshold: 100 // Distance en pixels que l'on doit parcourir au touch sur surface tactile pour déclencher un slide (50 par défaut)
});
```

## À savoir

Il est déconseillé d'utiliser des balises <script> dans les pages WordPress. S'il doit y en avoir, il faut les mettre dans la div avec l'attribut data-vec="content" et les entourer d'une div avec une classe unique.
Pas de problème avec les balises <style> (même si c'est toujours mieux d'éviter d'en mettre dans le HTML).

Pour l'utilisation de l'éditeur dans l'admin :
Lancer l'éditeur visuel en cliquant sur le bouton 'Afficher' dans la zone du module 'Visual Editable Content';
Il ne faut faire de modifications dans la zone d'édition de WordPress ni avant, ni pendant que l'on utilise l'éditeur visuel pour ne pas créer de conflits.
Lorsque l'on enregistre les modifications faites dans l'éditeur visuel, ce dernier se ferme pour empêcher que l'on fasse de nouvelles modifications à l'intérieur
(possibilité d'erreurs dues à la création d'attributs temporaires).
Enregister ses modifications depuis l'éditeur visuel ne fait que mettre à jour le code dans la zone d'édition (le textarea) de d'admin de WordPress. Penser à mettre à jour la page
avec le bouton 'Mettre à jour' de WordPress, pour enregistrer les modifications.


## Transitions

Il s'agit d'animer un bloc HTML lorsque l'on scroll à son niveau.
Ajouter l'attribut data-vec="transition" sur l'élément à animer.
L'attribut data-vec-transition contient le type d'animation à jouer. Les valeurs possibles sont :

* top
* bottom
* left
* right
* top-small
* bottom-small
* left-small
* right-small
* slide-top
* opacity

L'attribut data-vec-transition-delay="500" permet de lancer l'animation avec un décalage de la valeur renseignée (en millisecondes).
Les attributs data-vec-transition-desktop="true" et data-vec-transition-mobile="true" permettent de spécifier si l'animation doit être jouée pour desktop et mobile
(le seuil entre desktop et mobile est une résolution de 1023px de large).

Ajouter l'attribut data-vec-transition-reset="true" pour rejouer l'animation si l'on scroll à nouveau au niveau du bloc (vers le bas).
