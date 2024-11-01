=== WYSIWYG Helper ===
Contributors: dmitry.velichko
Donate link: http://www.wordpress.org/
Tags: wysiwyg, development, helper
Requires at least: 3.0.0
Tested up to: 3.0.3
Stable tag: trunk

Plugin for developers that want to use WYISIWYG in their plugins/themes.

== Description ==
This plugin allows developers to use the Wordpress WYSIWYG editor for their own 
fields during plugin/theme development, for example - for Custom Post Types. 
Code is based on Wordpress the_editor code.

Sponsored by GlobalBases.com GmbH WebBases & WebSoftware
http://www.globalbases.com

PLEASE NOTE: Plugin is in alpha stage of development, so don't expect it to be fully working. Don't expect anything.

Known limitations: working only on post create/edit pages

== Installation ==
1. Upload `wysiwyg_helper` directory to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress


== Frequently Asked Questions ==

= How can I place a WYSIWYG editor for my field ? =

In your theme/plugin code replace the textarea code with this line of PHP code:

wysiwyg_helper_tinyeditor($content,$id);

$content - the default value of editor content
$id - Id of the editor element, it will also be used for field name
There's an optional third boolean parameter that allows you to tell the function not to output the media buttons
