<?php
/**
 * The Theme specific functionality.
 *
 * @since   1.0.0
 * @package Inf_Theme\Theme
 */

namespace Inf_Theme\Theme;

use Inf_Theme\Includes\Service;
use Inf_Theme\Helpers\General_Helper;

/**
 * Class Theme
 */
class Theme implements Service {

  /**
   * Register all the hooks
   *
   * @since 1.0.0
   */
  public function register() {
    add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_styles' ] );
    add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
    add_filter( 'use_default_gallery_style', [ $this, '__return_false' ] );

    /**
     * Optimizations
     *
     * This will remove some default functionality, but it mostly removes unnecessary
     * meta tags from the head section.
     */
    remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
    remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
    remove_action( 'wp_print_styles', 'print_emoji_styles' );
    remove_action( 'admin_print_styles', 'print_emoji_styles' );
    remove_action( 'wp_head', 'wp_generator' );
    remove_action( 'wp_head', 'wlwmanifest_link' );
    remove_action( 'wp_head', 'wp_shortlink_wp_head' );
    remove_action( 'wp_head', 'rsd_link' );
    remove_action( 'wp_head', 'feed_links', 2 );
    remove_action( 'wp_head', 'feed_links_extra', 3 );
    remove_action( 'wp_head', 'rest_output_link_wp_head' );
  }

  /**
   * Register the Stylesheets for the theme area.
   *
   * @since 1.0.0
   */
  public function enqueue_styles() {

    $main_style = General_Helper::get_manifest_assets_data( 'application.css' );
    wp_register_style( static::THEME_NAME . '-style', $main_style, array(), static::THEME_VERSION );
    wp_enqueue_style( static::THEME_NAME . '-style' );

  }

  /**
   * Register the JavaScript for the theme area.
   *
   * First jQuery that is loaded by default by WordPress will be deregistered and then
   * 'enqueued' with empty string. This is done to avoid multiple jQuery loading, since
   * one is bundled with webpack and exposed to the global window.
   *
   * @since 1.0.0
   */
  public function enqueue_scripts() {
    // jQuery.
    wp_deregister_script( 'jquery-migrate' );
    wp_deregister_script( 'jquery' );
    wp_register_script( 'jquery', General_Helper::get_manifest_assets_data( 'jquery.min.js' ), array(), '3.3.1' );
    wp_enqueue_script( 'jquery' );

    // JS.
    wp_register_script( static::THEME_NAME . '-scripts-vendors', General_Helper::get_manifest_assets_data( 'vendors.js' ), array(), static::THEME_VERSION, true );
    wp_enqueue_script( static::THEME_NAME . '-scripts-vendors' );

    wp_register_script( static::THEME_NAME . '-scripts', General_Helper::get_manifest_assets_data( 'application.js' ), array( static::THEME_NAME . '-scripts-vendors' ), static::THEME_VERSION, true );
    wp_enqueue_script( static::THEME_NAME . '-scripts' );

    // Glbal variables for ajax and translations.
    wp_localize_script(
      static::THEME_NAME . '-scripts',
      'themeLocalization',
      array(
        'ajaxurl' => admin_url( 'admin-ajax.php' ),
      )
    );
  }

}