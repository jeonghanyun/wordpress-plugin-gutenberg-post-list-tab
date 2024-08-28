<?php
/**
 * Plugin Name: Gutenberg Post List Tab
 * Description: Gutenberg 에디터에 포스트 리스트를 표시하는 탭을 추가합니다
 * Version: 1.0
 * Author: Yun Jeong Han
 * Text Domain: gutenberg-post-list-tabㄴ
 */

// Gutenberg 에디터용 JavaScript 파일을 등록합니다.
wp_enqueue_script(
    'gutenberg-post-list-tab',
    plugins_url( 'post-list-tab.js', __FILE__ ),
    array( 'wp-plugins', 'wp-edit-post', 'wp-element', 'wp-components', 'wp-data', 'wp-compose', 'wp-i18n' ),
    filemtime( plugin_dir_path( __FILE__ ) . 'post-list-tab.js' )
);
