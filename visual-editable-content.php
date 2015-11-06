<?php
	/*
		Plugin name: Visual Editable Content
		Description: Permet d'éditer visuellement les éléments d'une page Wordpress.
		Author: Frédéric Le Crom
		Version: 1.0
	*/
	
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
		
		/*wp_register_script("wp_dialogs", "/". WPINC .'/js/wpdialog.min.js', "jquery", "1.0");
		wp_enqueue_script("wp_dialogs");*/
		
		wp_enqueue_style("visual_editable_content_front_css", plugin_dir_url( __FILE__ ) ."css/visual-editable-content-front.css", array(), false, "screen");
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
