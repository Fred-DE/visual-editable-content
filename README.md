# Visual Editable Content

https://github.com/Fred-DE/visual-editable-content

Module WordPress permettant une �dition visuelle de ses pages.


Si vous �tes tomb�s ici par hasard, sachez que ce module a �t� cr�� pour un besoin personnel. Il n�cessite certaines connaissances pour le faire fonctionner correctement.
Cependant libre � vous de l'utiliser si vous le voulez.



## Instructions

Le contenu HTML qui doit �tre �ditable a besoin d'�tre entour� par une div contenant l'attribut data-vec="content".

Les �l�ments de texte devant �tre �ditable doivent contenir l'attribut data-vec="txt".

Les images data-vec="pic".

Un Carrousel doit �tre construit avec cette forme :

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

La div avec data-vec="carousel-container" est le carrousel en lui-m�me. C'est lui qui contient les �l�ments qui le composent. Chaque �l�ment doit avoir l'attribut data-vec="carousel-item".
Si l'on souhaite ajouter des fl�ches pour faire tourner le carrousel, il faut ajouter des �l�ments avec les attributs data-vec="carousel-left-button" et data-vec="carousel-right-button".
Si l'on souhaite ajouter une navigation (boutons correspondant chacun � un �cran du carrousel), il faut ajouter un �l�ment avec l'attribut data-vec="carousel-nav".
Tous les �l�ments constituant le carrousel doivent �tre entour�s par une div avec un id.

L'initialisation du carrousel se fait en instanciant une classe VecCarousel. Exemple :
```javascript
new VecCarousel(
{
	vecCarousel: "#id-carrousel", // id de la div contenant les �l�ments du carousel
	nbItems: 3, // Nombre d'�l�ments par �cran
	fillWithBlank: false, // Remplir les blancs du dernier �cran (s'il y en a) par des items vides (utile notamment lorsque les �l�ments d'un �cran sont justifi�s)
	hasArrows: false, // Si on active les fl�ches
	hasNavigation: true, // Si on active les boutons de navigation
	isLooping: true, // Si on souhaite que le carrousel puisse boucler (mettre � true seulement si on ne met pas de timer)
	timerDuration: 8000, // Dur�e du slide automatique, en millisecondes (mettre 0 ou ne pas renseigner pour qu'il n'y ait pas de slide automatique)
	threshold: 100 // Distance en pixels que l'on doit parcourir au touch sur surface tactile pour d�clencher un slide (50 par d�faut)
});
```

## � savoir

Il est d�conseill� d'utiliser des balises ```<script>``` dans les pages WordPress. S'il doit y en avoir, il faut les mettre dans la div avec l'attribut data-vec="content" et les entourer d'une div avec une classe unique.
Pas de probl�me avec les balises ```<style>``` (m�me si c'est toujours mieux d'�viter d'en mettre dans le HTML).

Pour l'utilisation de l'�diteur dans l'admin :
Lancer l'�diteur visuel en cliquant sur le bouton 'Afficher' dans la zone du module 'Visual Editable Content';
Il ne faut faire de modifications dans la zone d'�dition de WordPress ni avant, ni pendant que l'on utilise l'�diteur visuel pour ne pas cr�er de conflits.
Lorsque l'on enregistre les modifications faites dans l'�diteur visuel, ce dernier se ferme pour emp�cher que l'on fasse de nouvelles modifications � l'int�rieur
(possibilit� d'erreurs dues � la cr�ation d'attributs temporaires).
Enregister ses modifications depuis l'�diteur visuel ne fait que mettre � jour le code dans la zone d'�dition (le textarea) de d'admin de WordPress. Penser � mettre � jour la page
avec le bouton 'Mettre � jour' de WordPress, pour enregistrer les modifications.


## Transitions

Il s'agit d'animer un bloc HTML lorsque l'on scroll � son niveau.
Ajouter l'attribut data-vec="transition" sur l'�l�ment � animer.
L'attribut data-vec-transition contient le type d'animation � jouer. Les valeurs possibles sont :

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

L'attribut data-vec-transition-delay="500" permet de lancer l'animation avec un d�calage de la valeur renseign�e (en millisecondes).
Les attributs data-vec-transition-desktop="true" et data-vec-transition-mobile="true" permettent de sp�cifier si l'animation doit �tre jou�e pour desktop et mobile
(le seuil entre desktop et mobile est une r�solution de 1023px de large).

Ajouter l'attribut data-vec-transition-reset="true" pour rejouer l'animation si l'on scroll � nouveau au niveau du bloc (vers le bas).
