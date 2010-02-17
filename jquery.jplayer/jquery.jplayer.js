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
Documentation: www.happyworm.com/jquery/jplayer
*/

(function($) {
	$.jPlayerCount = 0;
	
	var methods = {
		jPlayer: function(options) {
			$.jPlayerCount++;
			
			var config = {
				ready: null,
				cssPrefix: "jqjp",
				swfPath: "js",
				volume: 80,
				oggSupport: false,
				position: "absolute",
				width: 0,
				height: 0,
				top: 0,
				left: 0,
				quality: "high",
				bgcolor: "#ffffff"
			};
			$.extend(config, options);

			var configWithoutOptions = {
				id: $(this).attr("id"),
				swf: config.swfPath + ((config.swfPath != "") ? "/" : "") + "Jplayer.swf",
				fid: config.cssPrefix + "_flash_" + $.jPlayerCount,
				aid: config.cssPrefix + "_audio_" + $.jPlayerCount,
				hid: config.cssPrefix + "_force_" + $.jPlayerCount,
				i: $.jPlayerCount
			};
			$.extend(config, configWithoutOptions);

			$.fn["jPlayerReady" + config.i] = config.ready;

			$(this).prepend('<audio id="' + config.aid + '"></audio>'); // Begin check for HTML5 <audio>
			var audioArray = $("#"+config.aid).get();

			var configForAudioFormat = {
				canPlayMP3: Boolean((audioArray[0].canPlayType) ? (("" != audioArray[0].canPlayType("audio/mpeg")) && ("no" != audioArray[0].canPlayType("audio/mpeg"))) : false),
				canPlayOGG: Boolean((audioArray[0].canPlayType) ? (("" != audioArray[0].canPlayType("audio/ogg")) && ("no" != audioArray[0].canPlayType("audio/ogg"))) : false),
				audio: audioArray[0]
			};
			$.extend(config, configForAudioFormat);

			var configForHtmlAudio = {
				html5: Boolean((config.oggSupport) ? ((config.canPlayOGG) ? true : config.canPlayMP3) : config.canPlayMP3)
			};
			$.extend(config, configForHtmlAudio);

			$(this).data("jPlayer.config", config);

			var events = {
				setButtons: function(e, playing) {
					var playId = $(this).data("jPlayer.cssId.play");
					var pauseId = $(this).data("jPlayer.cssId.pause");
					var prefix = $(this).data("jPlayer.config").cssPrefix;

					if(playId != null && pauseId != null) {
						if(playing) {
							var style = $(this).data("jPlayer.cssDisplay.pause");
							$("#"+playId).css("display", "none");
							$("#"+pauseId).css("display", style);
						} else {
							var style = $(this).data("jPlayer.cssDisplay.play");
							$("#"+playId).css("display", style);
							$("#"+pauseId).css("display", "none");
						}
					}
				}
			};

			var eventsForFlash = {
				setFile: function(e, f) {
					var fid = $(this).data("jPlayer.config").fid;
					var m = $(this).data("jPlayer.getMovie")(fid);
					m.fl_setFile_mp3(f.mp3);
					$(this).trigger("jPlayer.setButtons", false);
				},
				play: function(e) {
					var fid = $(this).data("jPlayer.config").fid;
					var m = $(this).data("jPlayer.getMovie")(fid);
					var r = m.fl_play_mp3();
					if(r) {
						$(this).trigger("jPlayer.setButtons", true);
					}
				},
				pause: function(e) {
					var fid = $(this).data("jPlayer.config").fid;
					var m = $(this).data("jPlayer.getMovie")(fid);
					var r = m.fl_pause_mp3();
					if(r) {
						$(this).trigger("jPlayer.setButtons", false);
					}
				},
				stop: function(e) {
					var fid = $(this).data("jPlayer.config").fid;
					var m = $(this).data("jPlayer.getMovie")(fid);
					var r = m.fl_stop_mp3();
					if(r) {
						$(this).trigger("jPlayer.setButtons", false);
					}
				},
				playHead: function(e, p) {
					var fid = $(this).data("jPlayer.config").fid;
					var m = $(this).data("jPlayer.getMovie")(fid);
					var r = m.fl_play_head_mp3(p);
					if(r) {
						$(this).trigger("jPlayer.setButtons", true);
					}
				},
				playHeadTime: function(e, t) {
					var fid = $(this).data("jPlayer.config").fid;
					var m = $(this).data("jPlayer.getMovie")(fid);
					var r = m.fl_play_head_time_mp3(t);
					if(r) {
						$(this).trigger("jPlayer.setButtons", true);
					}
				},
				volume: function(e, v) {
					$(this).data("jPlayer.config").volume = v;
					var fid = $(this).data("jPlayer.config").fid;
					var m = $(this).data("jPlayer.getMovie")(fid);
					m.fl_volume_mp3(v);
				}
			};

			var eventsForHtmlAudio = {
				setFile: function(e, f) {
					$("#"+$(this).data("jPlayer.config").aid).remove();
					$(this).prepend('<audio id="' + $(this).data("jPlayer.config").aid + '"></audio>');
					var audioArray = $("#"+$(this).data("jPlayer.config").aid).get();
					$(this).data("jPlayer.config").audio = audioArray[0];
					$(this).data("jPlayer.config").audio.volume = $(this).data("jPlayer.config").volume/100;

					if($(this).data("jPlayer.config").oggSupport && $(this).data("jPlayer.config").canPlayOGG) {
						$(this).data("jPlayer.config").audio.src = f.ogg;
					} else { 
						$(this).data("jPlayer.config").audio.src = f.mp3;
					}
					$(this).trigger("jPlayer.setButtons", false);
				},
				play: function(e) {
					$(this).data("jPlayer.config").audio.play();
					$(this).trigger("jPlayer.setButtons", true);

					clearInterval($(this).data("jPlayer.interval.jPlayerController"));
					$(this).data("jPlayer.interval.jPlayerController", window.setInterval($(this).jPlayerController, 50, $(this), false));
				},
				pause: function(e) {
					$(this).data("jPlayer.config").audio.pause();
					$(this).trigger("jPlayer.setButtons", false);
					clearInterval($(this).data("jPlayer.interval.jPlayerController"));
				},
				stop: function(e) {
					$(this).data("jPlayer.config").audio.currentTime = 0;
					$(this).trigger("jPlayer.pause");
					$(this).jPlayerController($(this), true); // With override true
				},
				playHead: function(e, p) {
					$(this).data("jPlayer.config").audio.currentTime = ($(this).data("jPlayer.config").audio.buffered) ? p * $(this).data("jPlayer.config").audio.buffered.end() / 100 : p * $(this).data("jPlayer.config").audio.duration / 100;
					$(this).trigger("jPlayer.play");
				},
				playHeadTime: function(e, t) {
					$(this).data("jPlayer.config").audio.currentTime = t/1000;
					$(this).trigger("jPlayer.play");
				},
				volume: function(e, v) {
					$(this).data("jPlayer.config").volume = v;
					$(this).data("jPlayer.config").audio.volume = v/100;
					$(this).jPlayerVolume(v);
				}
			};

			if( config.html5 ) {
				$.extend(events, eventsForHtmlAudio);
			} else {
				$.extend(events, eventsForFlash);
			}
			
			for(var event in events) {
				var e = "jPlayer." + event;
				$(this).unbind(e);
				$(this).bind(e, events[event]);
			}

			var getMovie = function(fid) {
				return document[fid];
			};
			$(this).data("jPlayer.getMovie", getMovie);

			// Function checkForFlash adapted from FlashReplace by Robert Nyman
			// http://code.google.com/p/flashreplace/
			var checkForFlash = function (version){
				var flashIsInstalled = false;
				var flash;
				if(window.ActiveXObject){
					try{
						flash = new ActiveXObject(("ShockwaveFlash.ShockwaveFlash." + version));
						flashIsInstalled = true;
					}
					catch(e){
						// Throws an error if the version isn't available			
					}
				}
				else if(navigator.plugins && navigator.mimeTypes.length > 0){
					flash = navigator.plugins["Shockwave Flash"];
					if(flash){
						var flashVersion = navigator.plugins["Shockwave Flash"].description.replace(/.*\s(\d+\.\d+).*/, "$1");
						if(flashVersion >= version){
							flashIsInstalled = true;
						}
					}
				}
				return flashIsInstalled;
			};

			if( !config.html5 ) {
				if(checkForFlash(8)) {
					if($.browser.msie) {
						var html_obj = '<object id="' + config.fid + '"';
						html_obj += ' classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"';
						html_obj += ' codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab"';
						html_obj += ' type="application/x-shockwave-flash"';
						html_obj += ' width="' + config.width + '" height="' + config.height + '">';
						html_obj += '</object>';
			
						var obj_param = new Array();
						obj_param[0] = '<param name="movie" value="' + config.swf + '" />';
						obj_param[1] = '<param name="quality" value="high" />';
						obj_param[2] = '<param name="FlashVars" value="id=' + escape(config.id) + '&fid=' + escape(config.fid) + '&vol=' + config.volume + '" />';
						obj_param[3] = '<param name="allowScriptAccess" value="always" />';
						obj_param[4] = '<param name="bgcolor" value="' + config.bgcolor + '" />';
				
						var ie_dom = document.createElement(html_obj);
						for(var i=0; i < obj_param.length; i++) {
							ie_dom.appendChild(document.createElement(obj_param[i]));
						}
						$(this).html(ie_dom);
					} else {
						var html_embed = '<embed name="' + config.fid + '" id="' + config.fid + '" src="' + config.swf + '"';
						html_embed += ' width="' + config.width + '" height="' + config.height + '" bgcolor="' + config.bgcolor + '"';
						html_embed += ' quality="high" FlashVars="id=' + escape(config.id) + '&fid=' + escape(config.fid) + '&vol=' + config.volume + '"';
						html_embed += ' allowScriptAccess="always"';
						html_embed += ' type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />';
						$(this).html(html_embed);
					}
			
				} else {
					$(this).html("<p>Flash 8 or above is not installed. <a href='http://get.adobe.com/flashplayer'>Get Flash!</a></p>");
				}
			}

			var html_hidden = '<div id="' + config.hid + '"></div>';
			$(this).append(html_hidden);
			
			$(this).css({'position':config.position, 'top':config.top, 'left':config.left});
			$("#"+config.hid).css({'text-indent':'-9999px'});

			if( config.html5 ) { // Emulate initial flash calls after 100ms
				var self = $(this);
				window.setTimeout( function() {
					self.volume(config.volume);
					self.jPlayerReady();
				}, 100);
			}
			
			return $(this);
		},
		setFile: function(f1, f2) {
			var f = {mp3:f1, ogg:f2};
			$(this).trigger("jPlayer.setFile", f);
			return $(this);
		},
		play: function() {
			$(this).trigger("jPlayer.play");
			return $(this);
		},
		pause: function() {
			$(this).trigger("jPlayer.pause");
			return $(this);
		},
		stop: function() {
			$(this).trigger("jPlayer.stop");
			return $(this);
		},
		playHead: function(p) {
			$(this).trigger("jPlayer.playHead", p);
			return $(this);
		},
		playHeadTime: function(t) {
			$(this).trigger("jPlayer.playHeadTime", t);
			return $(this);
		},
		volume: function(v) {
			$(this).trigger("jPlayer.volume", v);
			return $(this);
		},
		jPlayerId: function(fn, id) {
			if(id != null) {
				var isValid = eval("$(this)."+fn);
				if(isValid != null) {
					$(this).data("jPlayer.cssId." + fn, id);
					var jPlayerId = $(this).data("jPlayer.config").id;
					eval("var myHandler = function(e) { $(\"#" + jPlayerId + "\")." + fn + "(e); return false; }");
					$("#"+id).click(myHandler).hover($(this).jPlayerRollOver, $(this).jPlayerRollOut).data("jPlayerId", jPlayerId);
					
					var display = $("#"+id).css("display");
					$(this).data("jPlayer.cssDisplay." + fn, display);
					
					if(fn == "pause") {
						$("#"+id).css("display", "none");
					}
				} else {
					alert("Unknown function assigned in: jPlayerId( fn="+fn+", id="+id+" )");
				}
			} else {
				id = $(this).data("jPlayer.cssId." + fn);
				if(id != null) {
					return id;
				} else {
					alert("Unknown function id requested: jPlayerId( fn="+fn+" )");
					return false;
				}
			}
			return $(this);
		},
		loadBar: function(e) { // Handles clicks on the loadBar
			var lbId = $(this).data("jPlayer.cssId.loadBar");
			if( lbId != null ) {
				var offset = $("#"+lbId).offset();
				var x = e.pageX - offset.left;
				var w = $("#"+lbId).width();
				var p = 100*x/w;
				$(this).playHead(p);
			}
		},
		playBar: function(e) { // Handles clicks on the playBar
			$(this).loadBar(e);
		},
		onProgressChange: function(fn) {
			$.fn["jPlayerOnProgressChange" + $(this).data("jPlayer.config").i] = fn;
			return $(this);
		},
		jPlayerOnProgressChange: function(loadPercent, playedPercentRelative, playedPercentAbsolute, playedTime, totalTime) { // Called from Flash
			var lbId = $(this).data("jPlayer.cssId.loadBar");
			if (lbId != null) {
				$("#"+lbId).width(loadPercent+"%");
			}
			var pbId = $(this).data("jPlayer.cssId.playBar");
			if (pbId != null ) {
				$("#"+pbId).width(playedPercentRelative+"%");
			}
			
			$(this)["jPlayerOnProgressChange" + $(this).data("jPlayer.config").i](loadPercent, playedPercentRelative, playedPercentAbsolute, playedTime, totalTime);
			$(this).jPlayerForceUpdate();
			return true;
		},
		jPlayerController: function(self, override) { // For HTML5 interval.
			var playedTime = 0;
			var totalTime = 0;
			var playedPercentAbsolute = 0;
			var loadPercent = 0;
			var playedPercentRelative = 0;
			
			if(self.data("jPlayer.config").audio.readyState >= 1) {
				playedTime = self.data("jPlayer.config").audio.currentTime * 1000; // milliSeconds
				totalTime = self.data("jPlayer.config").audio.duration * 1000; // milliSeconds
				playedPercentAbsolute = 100 * playedTime / totalTime;
				loadPercent = (self.data("jPlayer.config").audio.buffered) ? 100 * self.data("jPlayer.config").audio.buffered.end() / self.data("jPlayer.config").audio.duration : 100;
				playedPercentRelative = (self.data("jPlayer.config").audio.buffered) ? 100 * self.data("jPlayer.config").audio.currentTime / self.data("jPlayer.config").audio.buffered.end() : playedPercentAbsolute;
			}
			
			if(override) {
				self.jPlayerOnProgressChange(loadPercent, 0, 0, 0, totalTime);
			} else {
				self.jPlayerOnProgressChange(loadPercent, playedPercentRelative, playedPercentAbsolute, playedTime, totalTime);
				
				if (self.data("jPlayer.config").audio.ended) {
					clearInterval(self.data("jPlayer.interval.jPlayerController"));
					self.jPlayerOnSoundComplete();
				}
			}
		},
		volumeMin: function() {
			$(this).volume(0);
			return $(this);
		},
		volumeMax: function() {
			$(this).volume(100);
			return $(this);
		},
		volumeBar: function(e) { // Handles clicks on the volumeBar
			var vbId = $(this).data("jPlayer.cssId.volumeBar");
			if( vbId != null ) {
				var offset = $("#"+vbId).offset();
				var x = e.pageX - offset.left;
				var w = $("#"+vbId).width();
				var p = 100*x/w;
				$(this).volume(p);
			}
		},
		volumeBarValue: function(e) { // Handles clicks on the volumeBarValue
			$(this).volumeBar(e);
		},
		jPlayerVolume: function(v) { // Called from Flash
			var vbvId = $(this).data("jPlayer.cssId.volumeBarValue");
			if( vbvId != null ) {
				$("#"+vbvId).width(v+"%");
				$(this).jPlayerForceUpdate();
				return true;
			}
		},
		onSoundComplete: function(fn) {
			$.fn["jPlayerOnSoundComplete" + $(this).data("jPlayer.config").i] = fn;
			return $(this);
		},
		jPlayerOnSoundComplete: function() { // Called from Flash
			$(this).trigger("jPlayer.setButtons", false);
			$(this)["jPlayerOnSoundComplete" + $(this).data("jPlayer.config").i]();
			return true;
		},
		jPlayerBufferState: function (b) { // Called from Flash
			var lbId = $(this).data("jPlayer.cssId.loadBar");
			if( lbId != null ) {
				var prefix = $(this).data("jPlayer.config").cssPrefix;
				if(b) {
					$("#"+lbId).addClass(prefix + "_buffer");
				} else {
					$("#"+lbId).removeClass(prefix + "_buffer");
				}
				return true;
			} else {
				return false;
			}
		},
		bufferMsg: function() {
			// Empty: Initialized to enable jPlayerId() to work.
			// See jPlayerBufferMsg() for code.
		},
		jPlayerBufferMsg: function (msg) { // Called from Flash
			var bmId = $(this).data("jPlayer.cssId.bufferMsg");
			if( bmId != null ) {
				$("#"+bmId).html(msg);
				return true;
			} else {
				return false;
			}
		},
		jPlayerForceUpdate: function() { // For Safari and Chrome
			var hid = $(this).data("jPlayer.config").hid;
			$("#"+hid).html(Math.random());
		},
		jPlayerRollOver: function() {
			var jPlayerId = $(this).data("jPlayerId");
			var prefix = $("#"+jPlayerId).data("jPlayer.config").cssPrefix;
			$(this).addClass(prefix + "_hover");
		},
		jPlayerRollOut: function() {
			var jPlayerId = $(this).data("jPlayerId");
			var prefix = $("#"+jPlayerId).data("jPlayer.config").cssPrefix;
			$(this).removeClass(prefix + "_hover");
		},
		jPlayerReady: function() { // Called from Flash
			$(this)["jPlayerReady" + $(this).data("jPlayer.config").i]();
		},
		jPlayerGetInfo: function(info) {
			return $(this).data("jPlayer.config")[info];
		}
	};

	$.each(methods, function(i) {
		$.fn[i] = this;
	});
})(jQuery);
