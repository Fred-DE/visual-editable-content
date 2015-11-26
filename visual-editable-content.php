<?php
	/*
		Plugin name: Visual Editable Content
		Plugin URI: https://github.com/Fred-DE/visual-editable-content
		Description: Permet d'éditer visuellement les éléments d'une page Wordpress.
		Version: 1.1.4
		Author: Digital Effervescence - Frédéric Le Crom
		Author URI: http://digital-effervescence.com
		License: GPL2
		License URI: https://www.gnu.org/licenses/gpl-2.0.html
		Text Domain: visual-editable-content
		GitHub Plugin URI: https://github.com/Fred-DE/visual-editable-content
		GitHub Branch: master
	*/
	
	
	// exit if accessed directly
	if (!defined('ABSPATH'))
		exit;
	
	/*require_once("BFIGitHubPluginUploader.php");
	if (is_admin())
	{
		new BFIGitHubPluginUpdater(__FILE__, "Fred-DE", "visual-editable-content");
	}*/
	
	/*require_once("updater.php");
	if (is_admin())
	{
		$config = array
		(
			'slug' => plugin_basename(__FILE__), // this is the slug of your plugin 
			'proper_folder_name' => 'visual-editable-content', // this is the name of the folder your plugin lives in 
			'api_url' => 'https://api.github.com/repos/Fred-DE/visual-editable-content', // the github API url of your github repo 
			'raw_url' => 'https://raw.github.com/Fred-DE/visual-editable-content/master', // the github raw url of your github repo 
			'github_url' => 'https://github.com/Fred-DE/visual-editable-content', // the github url of your github repo 
			'zip_url' => 'https://github.com/Fred-DE/visual-editable-content/zipball/master', // the zip url of the github repo 
			'sslverify' => true, // wether WP should check the validity of the SSL cert when getting an update, see https://github.com/jkudish/WordPress-GitHub-Plugin-Updater/issues/2 and https://github.com/jkudish/WordPress-GitHub-Plugin-Updater/issues/4 for details 
			'requires' => '3.0', // which version of WordPress does your plugin require? 
			'tested' => '3.3', // which version of WordPress is your plugin tested up to? 
			'readme' => 'README.MD' // which file to use as the readme for the version number 

		);
		new WPGitHubUpdater($config);
	}*/

	
	/*class Visual_Editable_Content_Plugin()
	{
		public function __construct()
		{
			add_meta_box("visual-editable-content-block", "Visual Editable Content", $this->visualEditableContentCallback, "page", "normal", "default", null);
		}
		
		private function visualEditableContentCallback()
		{
			echo "Visual_Editable_Content_Plugin test";
		}
	}
	
	new Visual_Editable_Content_Plugin();*/
	
	/*function visualeditablecontent_activation()
	{
		//add_meta_box("visual-editable-content-block", "Visual Editable Content", visualEditableContentCallback, "page", "normal", "default", null);
		
		//add_action('admin_menu', 'test_plugin_setup_menu');
	}
	register_activation_hook(__FILE__, 'visualeditablecontent_activation');
	
	function visualeditablecontent_deactivation()
	{
		//add_meta_box("visual-editable-content-block", "Visual Editable Content", visualEditableContentCallback, "page", "normal", "default", null);
		
		return true;
	}
	register_deactivation_hook(__FILE__, 'visualeditablecontent_deactivation');*/
	
	
	/*function visualeditablecontent_callback()
	{
		echo "Visual_Editable_Content_Plugin test";
	}
	add_meta_box("visual-editable-content-block", "Visual Editable Content", "visualeditablecontent_callback", "page", "normal", "default", null);*/
	
	
	
	/*function test_plugin_setup_menu()
	{
		add_menu_page('Test Plugin Page', 'Test Plugin', 'manage_options', 'test-plugin', 'test_init');
	}
	
	function test_init()
	{
		echo "<h1>Super test</h1>";
	}
	add_action('admin_menu', 'test_plugin_setup_menu');*/
	
	
	
	
	// Scripts globaux
	function visualeditablecontent_scripts()
	{
		// wp_register_script("wp_link_js", "/". WPINC .'/js/wplink.min.js', "jquery", "1.0");
		// wp_enqueue_script("wp_link_js");
		
		wp_register_script("vec_carousel", plugin_dir_url( __FILE__ ) .'js/front/vec_carousel.js', "jquery", "1.0");
		wp_enqueue_script("vec_carousel");
		
		wp_register_script("vec_transitions", plugin_dir_url( __FILE__ ) .'js/front/vec_transitions.js', "jquery", "1.0");
		wp_enqueue_script("vec_transitions");
		
		// wp_enqueue_style("visual_editable_content_front_css", plugin_dir_url( __FILE__ ) ."css/visual-editable-content-front.css", array(), false, "screen");
		wp_enqueue_style("vec_css", plugin_dir_url( __FILE__ ) ."css/front/vec.css", array(), false, "screen");
	}
	add_action("wp_enqueue_scripts", "visualeditablecontent_scripts");
	
	
	// On ajoute le bloc dans la page d'édition de pages de l'admin
	function my_create_post_meta_box()
	{
		//add_meta_box('my-meta-box', 'Second Excerpt', 'my_post_meta_box', 'page', 'normal', 'high');
		add_meta_box("visual-editable-content-block", "Visual Editable Content", "visualeditablecontent_block", "page", "normal", "high", null);
	}
	add_action('admin_menu', 'my_create_post_meta_box');
	
	
	// Désactivation de l'éditeur visuel sur l'administration des pages
	function disableVisualEditorPage($c)
	{
		global $post_type;

		if ("page" == $post_type)
			return false;
		
		return $c;
	}
	add_filter("user_can_richedit", "disableVisualEditorPage");

	
	// Le bloc de notre plugin
	function visualeditablecontent_block($object, $box)
	{
		// Css
		wp_enqueue_style("visual_editable_content_css", plugin_dir_url( __FILE__ ) ."css/visual-editable-content.css", array(), false, "screen");
		
		// Javascript
		wp_register_script("visual_editable_content_js", plugin_dir_url( __FILE__ ) ."js/visual-editable-content.js", "jquery", "1.0");
		wp_enqueue_script("visual_editable_content_js");
		
		//wp_localize_script("visual_editable_content_js", "visualEditableContentVariables", array("path" => plugin_dir_url( __FILE__ ), "ajaxurl" => admin_url("admin-ajax.php")));
		
		/*echo "<pre>";
		print_r($object);
		echo "</pre>";*/
		
		//echo "<br /><br />Url : ". $object->guid;
	?>
		<!--<iframe id="visual-editable-content-editor" src="<?php //echo $object->guid; ?>"></iframe>-->
		<input type="hidden" name="current-page-guid" value="<?php echo $object->guid; ?>" />
		<input type="hidden" name="plugin-dir-url" value="<?php echo plugin_dir_url( __FILE__ ); ?>" />
		
		<div id="visual-editable-content-show" class="visual-editable-content-button"><span>Afficher</span></div>
		
		<iframe id="visual-editable-content-editor" src=""></iframe>
		
		<!--<h2>Super test</h2>-->
		<!--<p>
			<label for="second-excerpt">Second Excerpt</label>
			<br />
			<textarea name="second-excerpt" id="second-excerpt" cols="60" rows="4" tabindex="30" style="width: 97%;"><?php //echo wp_specialchars( get_post_meta( $object->ID, 'Second Excerpt', true ), 1 ); ?></textarea>
			<input type="hidden" name="my_meta_box_nonce" value="<?php //echo wp_create_nonce( plugin_basename( __FILE__ ) ); ?>" />
		</p>-->
		
		
<?php
	}
	
	// Variables globales
	function visualeditablecontent_js_variables()
	{
?>
		<script type="text/javascript">
			var visualEditableContentPath = "<?php echo plugin_dir_url( __FILE__ ); ?>";
		</script>
<?php
	}
	add_action ("wp_head", "visualeditablecontent_js_variables");
	
	
	// Désactivation bar admin WordPress
	/*function needRemoveAdminBar()
	{
		echo $_SERVER['REQUEST_URI'] ." - ". $_GET["vec"] ."<br />";
		if (isset($_GET["vec"]))
		{
			echo "if";
			return false;
		}
		else
		{
			echo "else";
			return true;
		}
	}
	add_filter('show_admin_bar', 'needRemoveAdminBar');*/
