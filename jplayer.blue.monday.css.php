<?php
/*
 * Skin for jPlayer Plugin (jQuery JavaScript Library)
 * http://www.happyworm.com/jquery/jplayer
 *
 * Skin Name: Blue Monday
 *
 * Copyright (c) 2010 Happyworm Ltd
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * Author: Silvia Benvenuti
 * Skin Version: 2.1
 * Date: 13th May 2010
 * 
 * Modified by James Nylen
 */


header('Content-type: text/css');

$interface_width  = 480;
$interface_height = 64;

$controls_offset_left = -8;
$controls_offset_top  = -8;

$progress_offset_left = $controls_offset_left;
$progress_offset_top  = $controls_offset_top;
$progress_width       = 170;

$volume_offset_left = $controls_offset_left + ($progress_width - 122);
$volume_offset_top  = $controls_offset_top;
$volume_width       = 76;


$playpause_top  = $controls_offset_top  + 20;
$playpause_left = $controls_offset_left + 48;

$stop_top  = $controls_offset_top  + 26;
$stop_left = $controls_offset_left + 126;

$prev_left = $controls_offset_left + 20;
$prev_top  = $controls_offset_top  + 26;
$next_left = $controls_offset_left + 88;
$next_top  = $controls_offset_top  + 26;

$progress_top  = $progress_offset_top  + 32;
$progress_left = $progress_offset_left + 164;

$volume_min_top  = $volume_offset_top  + 32;
$volume_min_left = $volume_offset_left + 296;

$volume_max_top  = $volume_offset_top  + 32;
$volume_max_left = $volume_offset_left + (368 + $volume_width - 46);

$volume_bar_top  = $volume_offset_top  + 37;
$volume_bar_left = $volume_offset_left + 314;

$play_time_top  = $progress_offset_top  + 49;
$play_time_left = $progress_offset_left + 164;

function px($n) {
  echo $n . 'px';
}
?>

div.jp-interface, div.jp-playlist {
  /* Edit the font-size to counteract inherited font sizing.
   * Eg. 1.25em = 1 / 0.8em
   */
  font-size: 1.25em;
  font-family: Verdana, Arial, sans-serif;
  line-height: 1.6;
  color: #666;
}

div.jp-interface {
  position: relative;
  background-color: #eee;
  width: <?php px($interface_width)?>;
  height: <?php px($interface_height)?>;
}
div.jp-interface ul.jp-controls {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
div.jp-interface ul.jp-controls li {
  position: absolute;
}
div.jp-interface ul.jp-controls a {
  position: absolute;
  overflow: hidden;
  text-indent: -9999px;
}

a.jp-play, a.jp-pause {
  top: <?php px($playpause_top)?>;
  left: <?php px($playpause_left)?>;
  width: 40px;
  height: 40px;
}
a.jp-play {
  background: url("jplayer.blue.monday.jpg") 0 0 no-repeat;
}
a.jp-play:hover {
  background: url("jplayer.blue.monday.jpg") -41px 0 no-repeat;
}
a.jp-pause {
  background: url("jplayer.blue.monday.jpg") 0 -42px no-repeat;
  display: none;
}
a.jp-pause:hover {
  background: url("jplayer.blue.monday.jpg") -41px -42px no-repeat;
}
a.jp-stop {
  top: <?php px($stop_top)?>;
  background: url("jplayer.blue.monday.jpg") 0 -83px no-repeat;
  width: 28px;
  height: 28px;
  left: <?php px($stop_left)?>;
}
a.jp-stop:hover {
  background: url("jplayer.blue.monday.jpg") -29px -83px no-repeat;
}
a.jp-previous {
  left: <?php px($prev_left)?>;
  top: <?php px($prev_top)?>;
  background: url("jplayer.blue.monday.jpg") 0 -112px no-repeat;
  width: 28px;
  height: 28px;
}
a.jp-previous:hover {
  background: url("jplayer.blue.monday.jpg") -29px -112px no-repeat;
}
a.jp-next {
  left: <?php px($next_left)?>;
  top: <?php px($next_top)?>;
  background: url("jplayer.blue.monday.jpg") 0 -141px no-repeat;
  width: 28px;
  height: 28px;
}
a.jp-next:hover {
  background: url("jplayer.blue.monday.jpg") -29px -141px no-repeat;
}

div.jp-progress {
  position: absolute;
  overflow: hidden;
  left: <?php px($progress_left)?>;
  top: <?php px($progress_top)?>;
  background-color: #ddd;
  width: <?php px($progress_width)?>;
  height: 15px;
}
div.jp-load-bar {
  background: url("jplayer.blue.monday.jpg") 0 -202px repeat-x;
  width: 0px;
  height: 15px;
  cursor: pointer;
}
div.jp-play-bar {
  background: url("jplayer.blue.monday.jpg") 0 -218px repeat-x ;
  width: 0px;
  height: 15px;
}

a.jp-volume-min {
  top: <?php px($volume_min_top)?>;
  left: <?php px($volume_min_left)?>;
  background: url("jplayer.blue.monday.jpg") 0 -170px no-repeat;
  width: 18px;
  height: 15px;
}
a.jp-volume-min:hover {
  background: url("jplayer.blue.monday.jpg") -19px -170px no-repeat;
}
a.jp-volume-max {
  top: <?php px($volume_max_top)?>;
  left: <?php px($volume_max_left)?>;
  background: url("jplayer.blue.monday.jpg") 0 -186px no-repeat;
  width: 18px;
  height: 15px;
}
a.jp-volume-max:hover {
  background: url("jplayer.blue.monday.jpg") -19px -186px no-repeat;
}
div.jp-volume-bar {
  position: absolute;
  overflow: hidden;
  top: <?php px($volume_bar_top)?>;
  left: <?php px($volume_bar_left)?>;
  background: url("jplayer.blue.monday.jpg") 0 -250px repeat-x;
  width: <?php px($volume_width) ?>;
  height: 5px;
  cursor: pointer;
}
div.jp-volume-bar-value {
  background: url("jplayer.blue.monday.jpg") 0 -256px repeat-x;
  width: 0px;
  height: 5px;
}
div.jp-play-time,
div.jp-total-time {
  position: absolute;
  top: <?php px($play_time_top)?>;
  left: <?php px($play_time_left)?>;
  width: <?php px($progress_width + 2)?>;
  font-size: .64em;
  font-style: oblique;
}
div.jp-total-time {
  text-align: right;
}

div.jp-playlist ul {
  list-style-type: none;
  margin: 0;
  padding-left: 0;
  background-color: #ccc;
  font-size: .72em;
}
div.jp-playlist li {
  border: 1px solid #eee;
  border-width: 0 0 1px 0;
  position: relative;
  background-color: #ccc;
  height: 1.4em;
}
div.jp-playlist li.dragging {
  border-top-width: 1px;
  margin-top: -1px;
}
div.jp-playlist li.jplayer_playlist_current {
  background: #ccc url(../images/current.png) no-repeat;
  background-position: 2px center;
  color: #0d88c1;
}
div.jp-playlist li:hover {
  background-image: none;
}

div.jp-playlist li .title-container:hover {
  color: #d22;
}
div.jp-playlist li.dragging .title-container:hover {
  color: #666;
}
div.jp-playlist li.jplayer_playlist_current .title-container:hover {
  color: #0d88c1;
}

div.jp-playlist .title-container {
  cursor: pointer;
  overflow: hidden;
  position: relative;
  top: 0;
  left: 0;
  margin: 0 50px 0 20px;
  height: 1.4em;
}
div.jp-playlist .icon-container {
  display: none;
}
div.jp-playlist .block {
  text-decoration: none;
  position: absolute;
  line-height: 1.4em;
  height: 1.4em
}
div.jp-playlist .song-title-scroll {
  display: none;
}
div.jp-playlist li:hover .icon-container {
  display: block;
}
div.jp-playlist .left {
  background: url(../images/drag.png) no-repeat;
  background-position: 2px center;
  width: 18px;
  cursor: move;
}
div.jp-playlist .right {
  width: 36px;
  top: 2px;
  right: 0;
}
