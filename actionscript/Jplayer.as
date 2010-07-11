/*
 * jPlayer Plugin for jQuery JavaScript Library
 * http://www.happyworm.com/jquery/jplayer
 *
 * Copyright (c) 2009 - 2010 Happyworm Ltd
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * Author: Mark J Panaghiston
 * Version: 1.2.0
 * Date: 11th July 2010
 *
 * FlashVars expected:
 *	id:	(URL Encoded) Id of container <div> tag of Flash
 *	fid:	(URL Encoded) Id of of this Flash Movie
 *	vol:	(Number) Sets the initial volume
 *
 * MTASC Compiler:
 * mtasc Jplayer.as -swf Jplayer.swf -main -header 120:20:40 -v -version 8 -group
 */

import flash.external.ExternalInterface;

class Jplayer {
	
	static var app:Jplayer;

	private var jPlayerVersion:String = "1.2.0";
	private var txVersion:TextField;
	
	private var mySound:Sound;
	private var jQuery:String;
	private var filename:String;
	
	private var vol:Number;
	
	private var isReady:Boolean = false;
	private var isLoading:Boolean = false; // true while loading
	private var isLoaded:Boolean = false; // true when completely downloaded
	private var isBuffering:Boolean = false; // true while buffering
	private var isPlaying:Boolean = false;
	private var isNewPlayHead:Boolean = false;
	private var hasEnded:Boolean = false; // Flag raised in Sound.onSoundComplete() and captured in progressBroker()
	
	private var playPosition:Number = 0;
	
	private var timeBufferMP3:Number = 10; // Auto play if buffer is greater than this time in seconds
	private var timeBufferMP3_min:Number = 1; // Auto pause if buffer drops below this time in seconds
	
	private var init_id:Number;
	private var bufferProgress_id:Number;
	private var progressBroker_id:Number;
	
	function Jplayer( scope:MovieClip ) {
		System.security.allowDomain("*");
		scope._soundbuftime = 0;
		this.jQuery = "jQuery(\"#" + scope.id + "\").jPlayer";
		this.vol = Number(scope.vol);
		
		// Display the jPlayer version so the SWF may be viewed directly to confirm that the JavaScript and SWF versions are compatible.
		var txFormat:TextFormat = new TextFormat();
		txFormat.align = "center";
		this.txVersion = scope.createTextField("txVersion", scope.getNextHighestDepth(), 0, 0, 120, 20);
		this.txVersion.border = true;
		this.txVersion.background = true;
		this.txVersion.backgroundColor = 0xEEEEFF;
		this.txVersion.text = "jPlayer " + this.jPlayerVersion;
		this.txVersion.setTextFormat(txFormat);
		
		// Delay init() because Firefox 3.5.7+ developed a bug with local testing.
		clearInterval(this.init_id);
		this.init_id = setInterval(this, "init", 100);
	}
	
	function init():Void {
		clearInterval(this.init_id);

		ExternalInterface.addCallback("fl_setFile_mp3", this, this.setFile_mp3);
		ExternalInterface.addCallback("fl_clearFile_mp3", this, this.clearFile_mp3);
		ExternalInterface.addCallback("fl_load_mp3", this, this.load_mp3);
		ExternalInterface.addCallback("fl_play_mp3", this, this.play_mp3);
		ExternalInterface.addCallback("fl_pause_mp3", this, this.pause_mp3);
		ExternalInterface.addCallback("fl_stop_mp3", this, this.stop_mp3);
		ExternalInterface.addCallback("fl_play_head_mp3", this, this.play_head_mp3);
		ExternalInterface.addCallback("fl_play_head_time_mp3", this, this.play_head_time_mp3);
		ExternalInterface.addCallback("fl_volume_mp3", this, this.volume_mp3);

		ExternalInterface.call(this.jQuery, "jPlayerVolume", this.vol);
		ExternalInterface.call(this.jQuery, "jPlayerReady", this.jPlayerVersion);
	}
	
	function newMP3( f:String ):Void {
		if (this.isPlaying) {
			this.mySound.stop();
		}
		delete(this.mySound);
		this.mySound = new Sound();
		this.playPosition = 0;
		this.filename = f;
		this.isReady = true;
		this.isLoading = false;
		this.isLoaded = false;
		this.isPlaying = false;
		this.hasEnded = false;
	}
	
	function setFile_mp3( f:String ):Boolean {
		if (f != null) {
			clearInterval(this.progressBroker_id);
			clearInterval(this.bufferProgress_id);
			
			this.newMP3(f);
			ExternalInterface.call(this.jQuery, "jPlayerOnProgressChange", 0, 0, 0, 0, 0);
			
			return true;
		} else {
			return false;
		}
	}
	
	function clearFile_mp3():Void {
		this.setFile_mp3("");
		this.isReady = false;
	}
	
	function load_mp3():Boolean {
		if (this.isReady && !this.isLoading && !this.isLoaded) {
			this.mySound.loadSound(this.filename, true); // Autoplays when streaming!
			this.mySound.setVolume(this.vol); // Has to go here, after loadSound(), otherwise a zero screws thing up.
			var self = this;
			this.mySound.onSoundComplete = function() {
				self.hasEnded = true;
			};
			this.mySound.stop();
			this.isLoading = true;
			
			clearInterval(this.progressBroker_id);
			this.progressBroker_id = setInterval(this, "progressBroker", 100);
			return true;
		} else {
			return false;
		}
	}
	
	function play_mp3():Boolean {
		if (this.load_mp3()) {
			clearInterval(this.bufferProgress_id);
			this.bufferProgress_id = setInterval(this, "bufferProgress", 100);
			return true;
		
		} else if (!this.isPlaying && this.isReady) {
			clearInterval(this.progressBroker_id);
			clearInterval(this.bufferProgress_id);
			this.progressBroker_id = setInterval(this, "progressBroker", 100);
			this.bufferProgress_id = setInterval(this, "bufferProgress", 100);
			return true;
		
		} else if (this.isPlaying && this.isReady) {
			return false;
		} else {
			return false;
		}
	}

	function auto_play_mp3():Void {
		this.mySound.start(this.playPosition/1000);
		this.isPlaying = true;
		this.isNewPlayHead = false;

		clearInterval(this.progressBroker_id);
		this.progressBroker_id = setInterval( this, "progressBroker", 100);
	}

	function auto_pause_mp3():Void {
		this.playPosition = this.mySound.position;
		this.isPlaying = false;
		this.mySound.stop();
	}

	function pause_mp3():Boolean {
		if (this.isReady && (this.isPlaying || this.isBuffering)) {
			clearInterval(this.bufferProgress_id);
			this.isPlaying = false;
			this.playPosition = this.mySound.position;
			this.mySound.stop();
	
			this.isBuffering = false;
			return true;
		} else {
			return false;
		}
	}

	function stop_mp3():Boolean {
		if (this.isReady) {
			clearInterval(this.bufferProgress_id);
			this.playPosition = 0;
			if (this.isPlaying) {
				this.mySound.stop();
				this.isPlaying = false;
			} else {
				this.progressBroker();
			}

			this.isBuffering = false;
			return true;
		} else {
			return false;
		}
	}


	function bufferProgress():Void {
		var load_complete:Boolean = false;
		if (this.mySound.getBytesTotal() > 100) {
			load_complete = (this.mySound.getBytesLoaded() == this.mySound.getBytesTotal());
		}

		var playedTime:Number = (this.isPlaying) ? this.mySound.position : this.playPosition;
		var timeRelativeBuffer:Number = (this.mySound.duration - playedTime) / 1000;

		if (load_complete || timeRelativeBuffer > this.timeBufferMP3 || (this.isNewPlayHead && timeRelativeBuffer > this.timeBufferMP3_min)) {
			if (!this.isPlaying) {
				// Start playing!
				this.auto_play_mp3();
				this.isBuffering = false;
			}
		} else {
			if (this.isPlaying) {
				if (timeRelativeBuffer < this.timeBufferMP3_min) {
					// Pause!
					this.auto_pause_mp3();
				}
			} else {
				if (!this.isBuffering) {
					this.isBuffering = true;
				}
			}
		}
	
		if (load_complete) {
			clearInterval(this.bufferProgress_id);
		}
	}

	function loadProgress():Number {
		var loaded_percent:Number = 0;
		if (this.mySound.getBytesTotal() > 100) {
			loaded_percent = Math.floor(10000 * this.mySound.getBytesLoaded() / this.mySound.getBytesTotal()) / 100;
			if (this.mySound.getBytesLoaded() == this.mySound.getBytesTotal()) {
				this.isLoading = false;
				this.isLoaded = true;
			}
		}
		return loaded_percent;
	}

	function progressBroker():Void {
		var loadPercent:Number = this.loadProgress();
		var playedTime:Number = Math.round((this.isPlaying || this.isBuffering) ? this.mySound.position : this.playPosition);
		var playedPercentRelative:Number = (this.mySound.duration > 0) ? Math.round(10000 * playedTime / this.mySound.duration) / 100 : 0;
		var playedPercentAbsolute:Number = playedPercentRelative * (loadPercent / 100);
		var totalTime:Number = (this.mySound.duration > 0) ? this.mySound.duration : 0;
	
		if (this.hasEnded) {
			this.hasEnded = false; // Reset the flag after capturing it.
			
			this.playPosition = 0;
			this.isPlaying = false;
			
			// Clean up the values affected by inaccurate Sound.position
			playedTime = totalTime;
			playedPercentRelative = 100;
			playedPercentAbsolute = 100;
			
			ExternalInterface.call(this.jQuery, "jPlayerOnSoundComplete");
		}
		
		ExternalInterface.call(this.jQuery, "jPlayerOnProgressChange", loadPercent, playedPercentRelative, playedPercentAbsolute, playedTime, totalTime);

		if (this.isLoaded && !this.isPlaying) {
			clearInterval(this.progressBroker_id);
		}
	}

	function play_head_mp3( played_percent:Number ):Boolean {
	
		var playPosition:Number = (this.mySound.duration != null) ? (played_percent/100) * this.mySound.duration : 0;
		return this.change_play_head(playPosition);
	}

	function play_head_time_mp3( played_time:Number ):Boolean {
	
		return this.change_play_head(played_time);
	}

	function change_play_head( playPosition:Number ):Boolean {
		if (this.isReady) {
			if (this.isPlaying) {
				this.mySound.stop();
			}
			this.isPlaying = false;
			this.isNewPlayHead = true;
			this.playPosition = playPosition;
		
			return this.play_mp3();
		} else {
			return false;
		}
	}

	function volume_mp3(v:Number):Void {
		this.vol = v;
		this.mySound.setVolume(this.vol);
		ExternalInterface.call(this.jQuery, "jPlayerVolume", this.vol);
	}
	
	static function main(mc:MovieClip) {
		app = new Jplayer(_root);
	}
}
