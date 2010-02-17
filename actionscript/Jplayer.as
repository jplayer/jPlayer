/*
Copyright (c) 2009 Happyworm Ltd

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

Author: Mark J Panaghiston
Version: 0.2.5.beta

FlashVars expected:
	id:	(URL Encoded) Id of container <div> tag of Flash
	fid:	(URL Encoded) Id of of this Flash Movie
	vol:	(Number) Sets the initial volume

MTASC Compiler:
mtasc Jplayer.as -swf Jplayer.swf -main -header 0:0:40 -v -version 8 -group

*/

import flash.external.ExternalInterface;

class Jplayer {
	
	static var app:Jplayer;
	
	private var mySound:Sound;
	private var jQuery:String;
	private var filename:String;
	
	private var vol:Number;
	
	private var isReady:Boolean = false;
	private var isLoading:Boolean = false; // true while loading
	private var isLoaded:Boolean = false; // true when completely downloaded
	private var browserBuffering:Boolean = false;
	private var isPlaying:Boolean = false;
	private var isNewPlayHead:Boolean = false;
	
	private var playPosition:Number = 0;
	
	private var timeBufferMP3:Number = 10; // Auto play if buffer is greater than this time in seconds
	private var timeBufferMP3_min:Number = 1; // Auto pause if buffer drops below this time in seconds
	
	private var bufferProgress_id:Number;
	private var progressBroker_id:Number;
	
	private var checkInterval_buffer:Number = 0; // Basic check to see if interval is being called
	private var checkInterval_broker:Number = 0; // Basic check to see if interval is being called

	// private var tx_command:TextField;
	// private var tx_loadStatus:TextField;
	// private var tx_bufferStatus:TextField;
	// private var tx_loadInfo:TextField;
	// private var tx_bufferInfo:TextField;
	// private var tx_playInfo:TextField;

	function Jplayer( scope:MovieClip ) {
		scope._soundbuftime = 0;
		this.jQuery = "jQuery(\"#" + scope.id + "\")";
		this.vol = Number(scope.vol);
		
		var success_change:Boolean = ExternalInterface.addCallback("fl_setFile_mp3", this, this.setFile_mp3);
		var success_play:Boolean = ExternalInterface.addCallback("fl_play_mp3", this, this.play_mp3);
		var success_pause:Boolean = ExternalInterface.addCallback("fl_pause_mp3", this, this.pause_mp3);
		var success_stop:Boolean = ExternalInterface.addCallback("fl_stop_mp3", this, this.stop_mp3);
		var success_play_head:Boolean = ExternalInterface.addCallback("fl_play_head_mp3", this, this.play_head_mp3);
		var success_play_head_time:Boolean = ExternalInterface.addCallback("fl_play_head_time_mp3", this, this.play_head_time_mp3);
		var success_volume:Boolean = ExternalInterface.addCallback("fl_volume_mp3", this, this.volume_mp3);

		// this.tx_command = scope.createTextField("tx_command", scope.getNextHighestDepth(), 0, 0, 600, 20);
		// this.tx_loadStatus = scope.createTextField("tx_loadStatus", scope.getNextHighestDepth(), 0, 20, 600, 20);
		// this.tx_bufferStatus = scope.createTextField("tx_bufferStatus", scope.getNextHighestDepth(), 0, 40, 600, 20);
		// this.tx_loadInfo = scope.createTextField("tx_loadInfo", scope.getNextHighestDepth(), 0, 60, 600, 20);
		// this.tx_bufferInfo = scope.createTextField("tx_bufferInfo", scope.getNextHighestDepth(), 0, 80, 600, 20);
		// this.tx_playInfo = scope.createTextField("tx_playInfo", scope.getNextHighestDepth(), 0, 100, 600, 20);
		// this.tx_command.border = true;
		// this.tx_loadStatus.border = true;
		// this.tx_bufferStatus.border = true;
		// this.tx_loadInfo.border = true;
		// this.tx_bufferInfo.border = true;
		// this.tx_playInfo.border = true;

		// if (success_change && success_play && success_pause && success_stop && success_play_head && success_volume) {
		// 	this.tx_command.text = "External functions registered successfully.";
		// 	this.tx_loadStatus.text = "<div id=\"" + scope.id + "\"> | <object/embed id=\"" +  scope.fid + "\">";
		// } else {
		// 	this.tx_command.text = "ERROR: External function registration failed.";
		// 	this.tx_loadStatus.text = "change:" + success_change.toString() + "|play:" + success_play.toString() + "|pause:" + success_pause.toString() + "|stop:" + success_stop.toString() + "|play_head:" + success_play_head.toString() + "|play_head_time:" + success_play_head_time.toString() + "|volume:" + success_volume.toString();
		// }

		ExternalInterface.call(this.jQuery + ".jPlayerVolume", this.vol);
		ExternalInterface.call(this.jQuery + ".jPlayerReady"); // Maybe do this via an onEnterFrame one-off command.
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
	}
	
	function setFile_mp3( f:String ):Boolean {
		if (f != null) {
			clearInterval(this.progressBroker_id);
			clearInterval(this.bufferProgress_id);

			this.newMP3(f);
			var jsResponse:String = String(ExternalInterface.call(this.jQuery + ".jPlayerOnProgressChange", 0, 0, 0, 0, 0));

			// this.tx_command.text = "Changed MP3 to File: " + f;
			// this.tx_loadStatus.text = "Waiting for Play command before loading";
			// this.tx_bufferStatus.text = "js : " + jsResponse;
			// this.tx_loadInfo.text = "";
			// this.tx_bufferInfo.text = "";
			// this.tx_playInfo.text = "";
			return true;
		} else {
			// this.tx_command.text = "Error: Change command requires MP3 filename parameter. No action taken.";
			return false;
		}
	}
	
	function play_mp3():Boolean {
		if (this.isReady && !this.isLoading && !this.isLoaded) {
			this.mySound.loadSound(this.filename, true); // Autoplays when streaming!
			this.mySound.setVolume(this.vol); // Has to go here, after loadSound(), otherwise a zero screws thing up.
			this.mySound.stop();
			this.isLoading = true;

			// this.tx_command.text = "Load & Buffer then Play File: " + this.filename;
			// this.tx_loadStatus.text = "Loading...";
			// this.tx_bufferStatus.text = "";
			
			clearInterval(this.progressBroker_id);
			clearInterval(this.bufferProgress_id);
			this.progressBroker_id = setInterval(this, "progressBroker", 100);
			this.bufferProgress_id = setInterval(this, "bufferProgress", 100);
			return true;
		
		} else if (!this.isPlaying && this.isReady) {
			// this.tx_command.text = "Playing '" + this.filename + "' from: " + this.playPosition/1000 + "s";
			// this.tx_bufferStatus.text = "";
		
			clearInterval(this.progressBroker_id);
			clearInterval(this.bufferProgress_id);
			this.progressBroker_id = setInterval(this, "progressBroker", 100);
			this.bufferProgress_id = setInterval(this, "bufferProgress", 100);
			return true;
		
		} else if (this.isPlaying && this.isReady) {
			// this.tx_command.text = "Already playing an MP3";
			return false;
		} else {
			// this.tx_command.text = "Play command issued before MP3 defined";
			return false;
		}
	}

	function auto_play_mp3():Void {
		// this.tx_bufferStatus.text = "Auto-playing as buffer greater than: " + this.timeBufferMP3 + "s";
		this.mySound.start(this.playPosition/1000);
		this.isPlaying = true;
		this.isNewPlayHead = false;

		clearInterval(this.progressBroker_id);
		this.progressBroker_id = setInterval( this, "progressBroker", 100);
	}

	function auto_pause_mp3():Void {
		// this.tx_bufferStatus.text = "Auto-pausing as buffer less than: " + this.timeBufferMP3_min + "s";
		this.playPosition = this.mySound.position;
		this.isPlaying = false;
		this.mySound.stop();
	}

	function pause_mp3():Boolean {
		if (this.isReady && (this.isPlaying || this.browserBuffering)) {
			clearInterval(this.bufferProgress_id);
			this.isPlaying = false;
			this.playPosition = this.mySound.position;
			// this.tx_command.text = "Pause at: " + this.playPosition/1000 + "s";
			// this.tx_bufferStatus.text = "";
			this.mySound.stop();
	
			this.browserBuffering = false;
			ExternalInterface.call(this.jQuery + ".jPlayerBufferMsg", false);
			ExternalInterface.call(this.jQuery + ".jPlayerBufferState", false);
			return true;
		} else {
			// tx_command.text = "nothing is playing";
			return false;
		}
	}

	function stop_mp3():Boolean {
		if (this.isReady) {
			clearInterval(this.bufferProgress_id);
			// this.tx_command.text = "Stop";
			// this.tx_bufferStatus.text = "";
			this.playPosition = 0;
			if (this.isPlaying) {
				this.mySound.stop();
			}
			this.isPlaying = false;

			this.browserBuffering = false;
			ExternalInterface.call(this.jQuery + ".jPlayerBufferMsg", false);
			ExternalInterface.call(this.jQuery + ".jPlayerBufferState", false);
			this.progressBroker();
			return true;
		} else {
			// this.tx_command.text = "Stop command issued before MP3 defined";
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

		var jsResponse:String = "n/a";
		if (load_complete || timeRelativeBuffer > this.timeBufferMP3 || (this.isNewPlayHead && timeRelativeBuffer > this.timeBufferMP3_min)) {
			if (!this.isPlaying) {
				// Start playing!
				this.auto_play_mp3();
				this.browserBuffering = false;
				jsResponse = String(ExternalInterface.call(this.jQuery + ".jPlayerBufferMsg", false));
				jsResponse += String(ExternalInterface.call(this.jQuery + ".jPlayerBufferState", false));
			}
		} else {
			if (this.isPlaying) {
				if (timeRelativeBuffer < this.timeBufferMP3_min) {
					// Pause!
					this.auto_pause_mp3();
				}
			} else {
				jsResponse = String(ExternalInterface.call(this.jQuery + ".jPlayerBufferMsg", "Buffering: " + Math.round(10*timeRelativeBuffer)/10 + "s / " + this.timeBufferMP3 + "s"));
				if (!this.browserBuffering) {
					this.browserBuffering = true;
					jsResponse += String(ExternalInterface.call(this.jQuery + ".jPlayerBufferState", true));
				}
			}
		}
	
		if (load_complete) {
			// this.tx_loadStatus.text = "Sound file loaded";
			clearInterval(this.bufferProgress_id);
		}
	
		// this.tx_bufferInfo.text = "(" + this.checkInterval_buffer++ + ") loaded = " + load_complete + " | js: " + jsResponse + " | RelBuffer = " + timeRelativeBuffer + "s";
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
		var playedTime:Number = Math.floor((this.isPlaying || this.browserBuffering) ? this.mySound.position : this.playPosition);
		var playedPercentRelative:Number = (this.mySound.duration > 0) ? Math.floor(10000 * playedTime / this.mySound.duration) / 100 : 0;
		var playedPercentAbsolute:Number = playedPercentRelative * (loadPercent / 100);
		var totalTime:Number = (this.mySound.duration > 0) ? this.mySound.duration : 0;
	
		var jsResponse:String = String(ExternalInterface.call(this.jQuery + ".jPlayerOnProgressChange", loadPercent, playedPercentRelative, playedPercentAbsolute, playedTime, totalTime));
		// this.tx_loadInfo.text = "(" + this.checkInterval_broker + ")  js: " + jsResponse + " |  Loaded: " + loadPercent +"%";
		// this.tx_playInfo.text = "(" + this.checkInterval_broker + ")  js: " + jsResponse + " | Played: " + playedPercentRelative + "% | position = " + this.mySound.position/1000 + "s | duration = " + this.mySound.duration/1000 + "s";

		if (this.isLoaded && playedPercentRelative >= 100) {
			this.playPosition = 0;
			this.isPlaying = false;
			
			var jsResponseFP:String = String(ExternalInterface.call(this.jQuery + ".jPlayerOnSoundComplete"));
			
			// this.tx_command.text = "The MP3 has ended |  js: " + jsResponseFP;
			// this.tx_bufferStatus.text = "";
		}
		
		if (this.isLoaded && !this.isPlaying) {
			clearInterval(this.progressBroker_id);
		}
		
		this.checkInterval_broker++;
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
		
			// this.tx_command.text = "Play Head '" + this.filename + "' to: " + this.playPosition/1000 + "s";
			// this.tx_bufferStatus.text = "";

			return this.play_mp3();
		} else {
			// this.tx_command.text = "PlayHead command issued before MP3 defined";
			return false;
		}
	}

	function volume_mp3(v:Number):Void {
		this.vol = v;
		this.mySound.setVolume(this.vol);
		var jsResponse:String = String(ExternalInterface.call(this.jQuery + ".jPlayerVolume", this.vol));
		// this.tx_command.text = "Volume set to " + this.vol + "% | js: " + jsResponse;
	}
	
	static function main(mc:MovieClip) {
		app = new Jplayer(_root);
	}
}
