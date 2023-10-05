<?php
/**
 * Plugin Name:       Nox Custom Bible
 * Plugin URI:        https://jamesnox.com
 * Description:       A plugin to show custom Bible verse popups.
 * Requires at least: 5.5
 * Requires PHP:      7.0
 * Author:            James Anthony Knox - Jamesnox.com
 * Version:           1.0
 * Text Domain:       nox-custom-bible
 * Domain Path:       /languages
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

// Plugin version.
if (!defined('NCB_VERSION')) {
    define('NCB_VERSION', '1.0');
}

// Plugin Folder Path.
if (!defined('NCB_PLUGIN_DIR')) {
    define('NCB_PLUGIN_DIR', plugin_dir_path(__FILE__));
}

// Plugin Folder URL.
if (!defined('NCB_PLUGIN_URL')) {
    define('NCB_PLUGIN_URL', plugin_dir_url(__FILE__));
}

// Plugin Root File.
if (!defined('NCB_PLUGIN_FILE')) {
    define('NCB_PLUGIN_FILE', __FILE__);
}

// Enqueue scripts and styles.
function ncb_enqueue_scripts()
{
    wp_enqueue_script('ncb-js', plugin_dir_url(__FILE__) . 'js/ncb.js', array('jquery'), '1.0', true);
    wp_enqueue_style('ncb-css', plugin_dir_url(__FILE__) . 'css/ncb.css');
}
add_action('wp_enqueue_scripts', 'ncb_enqueue_scripts');

// Admin menu for settings.
function ncb_admin_menu()
{
    add_menu_page('Nox Custom Bible', 'Nox Custom Bible', 'manage_options', 'nox-custom-bible', 'ncb_admin_page');
}
add_action('admin_menu', 'ncb_admin_menu');

// Admin page for settings.
function ncb_admin_page()
{
    ?>
    <div class="wrap">
        <h2>Nox Custom Bible Settings</h2>
        <!-- Add your settings form here -->
    </div>
    <?php
}

// Create a Thank You page on plugin activation.
function ncb_plugin_activation()
{
    $thank_you_page_title = 'Thank You';
    $thank_you_page_content = 'Thank you for using Nox Custom Bible Plugin!';
    $thank_you_page_check = get_page_by_title($thank_you_page_title);
    $thank_you_page = array(
        'post_type' => 'page',
        'post_title' => $thank_you_page_title,
        'post_content' => $thank_you_page_content,
        'post_status' => 'publish',
        'post_author' => 1,
        'post_slug' => 'thank-you'
    );
    if (!isset($thank_you_page_check->ID) && !the_slug_exists('thank-you')) {
        $thank_you_page_id = wp_insert_post($thank_you_page);
    }
}
register_activation_hook(__FILE__, 'ncb_plugin_activation');

// Check if slug exists.
function the_slug_exists($post_slug)
{
    $posts = get_posts(array(
        'name' => $post_slug,
        'post_type' => 'page',
        'post_status' => 'publish',
        'posts_per_page' => 1
    ));
    return count($posts) ? true : false;
}
