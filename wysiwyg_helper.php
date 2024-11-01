<?php
/**
 * @package WYSIWYG_Helper
 * @version 0.0.9
 */
/*
  Plugin Name: WYSIWYG Helper
  Plugin URI: http://wordpress.org/#
  Description: This plugin allows developers to use the Wordpress WYSIWYG editor for their own fields during plugin/theme development, for example - for Custom Post Types. Code is based on Wordpress the_editor code.
  Author: Dmitry Velichko
  Version: 0.0.9
  Author URI: http://veldv.info/
 */

/*  Copyright 2010-2011  Dmitry Velichko  (email : dmitry.velichko@gmail.com)

  This program is free software; you can redistribute it and/or modify
  it under the terms of the GNU General Public License, version 2, as
  published by the Free Software Foundation.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program; if not, write to the Free Software
  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */

$_wysiwyg_helper_init = FALSE;

function initWysiwygHelper() {
  global $_wysiwyg_helper_init;
  if (!$_wysiwyg_helper_init) {
    loadTinyMCE();
    $_wysiwyg_helper_init = TRUE;
  }
}

function wysiwyg_helper_tinyeditor($content, $id = 'content',$media_buttons = TRUE) {
  if (!current_user_can('upload_files'))
    $media_buttons = false;

  $richedit = user_can_richedit();


  $the_editor_content = apply_filters('the_editor_content', $content);

  if ($media_buttons) {
 ?>
      <div id="<?php echo $id ?>-media-buttons" class="media-buttons hide-if-no-js">
    <?php do_action('media_buttons'); ?>
    </div>
    <script type="text/javascript">
      jQuery(document).ready(function(){
        //Adding current textarea ID to media upload links
        jQuery('#<?php echo $id ?>-media-buttons a.thickbox').each(function(){
          var href = jQuery(this).attr('href');
          var queryString = href.replace(/^[^\?]+\??/,'');
          var queryPart = href.split(queryString).join('');
          queryString = 'active_editor_id='+'<?php echo $id ?>' + '&' + queryString;
          href = queryPart + queryString;
          jQuery(this).attr('href',href);
        });
      });
    </script>
  <?php } 


  $script = <<<EOT
<script type="text/javascript">
jQuery(document).ready(function($) {
    $("#{$id}").addClass("mceEditor");
    if ( typeof( tinyMCE ) == "object" &&
         typeof( tinyMCE.execCommand ) == "function" ) {
      tinyMCE.settings = {
        theme : "advanced",
        mode : "specific_textareas",
        selector : "WHEditor",
        language : "en",
        height:"200",
        width:"100%",
        theme_advanced_layout_manager : "SimpleLayout",
        theme_advanced_toolbar_location : "top",
        theme_advanced_toolbar_align : "left",
        theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,link,unlink,media,image,wp_adv",
        theme_advanced_buttons2 : "",
        theme_advanced_buttons3 : ""
      };
      tinyMCE.execCommand("mceAddControl", true, "{$id}");
    }
});
</script>
<textarea id="{$id}" class="WHEditor" name="{$id}">{$the_editor_content}</textarea>
<a href="#" id="{$id}_toggle_link">Toggle WYSIWYG editor</a>
<script type="text/javascript">
jQuery(document).ready(function($){
  $("#{$id}_toggle_link").click(function(){
    WISYWYG_helper_switchEditors.go('{$id}');
    return false;
  });
});
</script>
EOT;
  print $script;
}

/**
 * Adding CSS code for editor styling
 */
function wysiwyg_helper_css() {
  wp_enqueue_style('wysiwyg_helper.css', '/' . PLUGINDIR . '/wysiwyg_helper/wysiwyg_helper.css');
}

/**
 * Adding Javascript files for editor handling
 */
function wysiwyg_helper_js() {
  wp_enqueue_script('wysiwyg_helper.js', '/' . PLUGINDIR . '/wysiwyg_helper/wysiwyg_helper.js');
  /* wp_enqueue_script('whelper-quicktags', '/' . PLUGINDIR . '/wysiwyg_helper/whelper-quicktags.js'); */
}

function wysiwyg_helper_admin_head() {
  wysiwyg_helper_js();
  wysiwyg_helper_css();
}

function wysiwyg_helper_admin_footer() {
  wp_enqueue_script('whelper-media-upload', '/' . PLUGINDIR . '/wysiwyg_helper/whelper-media-upload.js');
  wp_print_scripts('whelper-media-upload');
}

/**
 * Trying to detect active editor ID and set it for use by my javascript overriding default send_to_editor() function
 */
function wysiwyg_helper_process_editor_id() {
  $ActiveEditorID = 'content';
  if (isset($_GET['active_editor_id'])) {
    $ActiveEditorID = $_GET['active_editor_id'];
  }
?>
  <script type="text/javascript">
    jQuery(document).ready(function() {
      var EditorID = '<?php print $ActiveEditorID; ?>';
      var win = window.dialogArguments || opener || parent || top;
      win.ActiveEditorID = EditorID;
    });
  </script>
<?
}

add_action('admin_init', 'wysiwyg_helper_admin_head');

add_action('admin_print_footer_scripts', 'wysiwyg_helper_admin_footer', 1000);


// upload handlers : image, video, file, audio
// We need this to make several media buttons available on the page
add_action('admin_head-media-upload-popup', 'wysiwyg_helper_process_editor_id', -100000);
