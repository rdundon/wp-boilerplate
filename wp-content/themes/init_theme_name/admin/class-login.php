<?php
/**
 * The login page specific functionality.
 *
 * @since   2.0.0
 * @package init_theme_name
 */

namespace Inf_Theme\Admin;

/**
 * Class Login
 *
 * Provides method for replacing default wordpress.org link with
 * the home page of the clients site.
 */
class Login {

  /**
   * Global theme name
   *
   * @var string
   *
   * @since 2.0.0
   */
  protected $theme_name;

  /**
   * Global theme version
   *
   * @var string
   *
   * @since 2.0.0
   */
  protected $theme_version;

  /**
   * Initialize class
   *
   * @param array $theme_info Load global theme info.
   *
   * @since 2.0.0
   */
  public function __construct( $theme_info = null ) {
    $this->theme_name     = $theme_info['theme_name'];
    $this->theme_version  = $theme_info['theme_version'];
  }

  /**
   * Change default logo link with home url
   *
   * @since 2.0.0
   */
  public function custom_login_url() {
    return home_url( '/' );
  }

}