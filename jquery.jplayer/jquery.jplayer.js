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
 */

(function($) {

	// Adapted from ui.core.js (1.7.2)
	function getter(plugin, method, args) {
		function getMethods(type) {
			var methods = $[plugin][type] || [];
			return (typeof methods == 'string' ? methods.split(/,?\s+/) : methods);
		}
		var methods = getMethods('getter');
		return ($.inArray(method, methods) != -1);
	}

	// Adapted from ui.core.js (1.7.2) $.widget() "create plugin method"
	// $.data() info at http://docs.jquery.com/Internals/jQuery.data
	$.fn.jPlayer = function(options) {
		
		var name = "jPlayer";
		var isMethodCall = (typeof options == 'string');
		var args = Array.prototype.slice.call(arguments, 1);
		
		// prevent calls to internal methods
		if (isMethodCall && options.substring(0, 1) == '_') {
			return this;
		}

		// handle getter methods
		if (isMethodCall && getter(name, options, args)) {
			var instance = $.data(this[0], name);
			return (instance ? instance[options].apply(instance, args) : undefined);
		}

		// handle initialization and non-getter methods
		return this.each(function() {
			var instance = $.data(this, name);

			// constructor
			if(!instance && !isMethodCall) {
				$.data(this, name, new $[name](this, options))._init();
			}

			// method call
			(instance && isMethodCall && $.isFunction(instance[options]) &&
				instance[options].apply(instance, args));
		});
	};
	
	$.jPlayer = function(element, options) {
		this.options = $.extend({}, options);
		this.element = $(element);
	};
	
	$.jPlayer.getter = "jPlayerOnProgressChange jPlayerOnSoundComplete jPlayerVolume jPlayerReady getData jPlayerController";
	
	$.jPlayer.defaults = {
		cssPrefix: "jqjp",
		swfPath: "js",
		volume: 80,
		oggSupport: false,
		nativeSupport: true,
		preload: 'none',
		customCssIds: false,
		graphicsFix: true,
		errorAlerts: false,
		warningAlerts: false,
		position: "absolute",
		width: "0",
		height: "0",
		top: "0",
		left: "0",
		quality: "high",
		bgcolor: "#ffffff"
	};

	$.jPlayer._config = {
		version: "1.2.0",
		swfVersionRequired: "1.2.0",
		swfVersion: "unknown",
		jPlayerControllerId: undefined,
		delayedCommandId: undefined,
		isWaitingForPlay:false,
		isFileSet:false
	};

	$.jPlayer._diag = {
		isPlaying: false,
		src: "",
		loadPercent: 0,
		playedPercentRelative: 0,
		playedPercentAbsolute: 0,
		playedTime: 0,
		totalTime: 0
	};

	$.jPlayer._cssId = {
		play: "jplayer_play",
		pause: "jplayer_pause",
		stop: "jplayer_stop",
		loadBar: "jplayer_load_bar",
		playBar: "jplayer_play_bar",
		volumeMin: "jplayer_volume_min",
		volumeMax: "jplayer_volume_max",
		volumeBar: "jplayer_volume_bar",
		volumeBarValue: "jplayer_volume_bar_value"
	};
	
	$.jPlayer.count = 0;

	$.jPlayer.timeFormat = {
		showHour: false,
		showMin: true,
		showSec: true,
		padHour: false,
		padMin: true,
		padSec: true,
		sepHour: ":",
		sepMin: ":",
		sepSec: ""
	};
	
	$.jPlayer.convertTime = function(mSec) {
		var myTime = new Date(mSec);
		var hour = myTime.getUTCHours();
		var min = myTime.getUTCMinutes();
		var sec = myTime.getUTCSeconds();
		var strHour = ($.jPlayer.timeFormat.padHour && hour < 10) ? "0" + hour : hour;
		var strMin = ($.jPlayer.timeFormat.padMin && min < 10) ? "0" + min : min;
		var strSec = ($.jPlayer.timeFormat.padSec && sec < 10) ? "0" + sec : sec;
		return (($.jPlayer.timeFormat.showHour) ? strHour + $.jPlayer.timeFormat.sepHour : "") + (($.jPlayer.timeFormat.showMin) ? strMin + $.jPlayer.timeFormat.sepMin : "") + (($.jPlayer.timeFormat.showSec) ? strSec + $.jPlayer.timeFormat.sepSec : "");
	};
	
	$.jPlayer.prototype = {
		_init: function() {
			var self = this;
			var element = this.element;
			
			this.config = $.extend({}, $.jPlayer.defaults, this.options, $.jPlayer._config);
			this.config.diag = $.extend({}, $.jPlayer._diag);
			this.config.cssId = {};
			this.config.cssSelector = {};
			this.config.cssDisplay = {};
			this.config.clickHandler = {};
			
			this.element.data("jPlayer.config", this.config);

			$.extend(this.config, {
				id: this.element.attr("id"),
				swf: this.config.swfPath + ((this.config.swfPath != "" && this.config.swfPath.slice(-1) != "/") ? "/" : "") + "Jplayer.swf",
				fid: this.config.cssPrefix + "_flash_" + $.jPlayer.count,
				aid: this.config.cssPrefix + "_audio_" + $.jPlayer.count,
				hid: this.config.cssPrefix + "_force_" + $.jPlayer.count,
				i: $.jPlayer.count,
				volume: this._limitValue(this.config.volume, 0, 100),
				autobuffer: this.config.preload != 'none'
			});

			$.jPlayer.count++;

			if(this.config.ready != undefined) {
				if($.isFunction(this.config.ready)) {
					this.jPlayerReadyCustom = this.config.ready;
				} else {
					this._warning("Constructor's ready option is not a function.");
				}
			}
			
			this.config.audio = document.createElement('audio');
			this.config.audio.id = this.config.aid;
			// The audio element is added to the page further down with the defaults.
			
			$.extend(this.config, {
				canPlayMP3: !!((this.config.audio.canPlayType) ? (("" != this.config.audio.canPlayType("audio/mpeg")) && ("no" != this.config.audio.canPlayType("audio/mpeg"))) : false),
				canPlayOGG: !!((this.config.audio.canPlayType) ? (("" != this.config.audio.canPlayType("audio/ogg")) && ("no" != this.config.audio.canPlayType("audio/ogg"))) : false),
				aSel: $("#" + this.config.aid)
			});

			$.extend(this.config, {
				html5: !!((this.config.oggSupport) ? ((this.config.canPlayOGG) ? true : this.config.canPlayMP3) : this.config.canPlayMP3)
			});

			$.extend(this.config, {
				usingFlash: !(this.config.html5 && this.config.nativeSupport),
				usingMP3: !(this.config.oggSupport && this.config.canPlayOGG && this.config.nativeSupport)
			});

			var events = {
				setButtons: function(e, playing) {
					self.config.diag.isPlaying = playing;
					if(self.config.cssId.play != undefined && self.config.cssId.pause != undefined) {
						if(playing) {
							self.config.cssSelector.play.css("display", "none");
							self.config.cssSelector.pause.css("display", self.config.cssDisplay.pause);
						} else {
							self.config.cssSelector.play.css("display", self.config.cssDisplay.play);
							self.config.cssSelector.pause.css("display", "none");
						}
					}
					if(playing) {
						self.config.isWaitingForPlay = false;
					}
					
				}
			};

			var eventsForFlash = {
				setFile: function(e, mp3, ogg) {
					try {
						self._getMovie().fl_setFile_mp3(mp3);
						if(self.config.autobuffer) {
							element.trigger("jPlayer.load");
						}
						self.config.diag.src = mp3;
						self.config.isFileSet = true; // Set here for conformity, but the flash handles this internally and through return values.
						element.trigger("jPlayer.setButtons", false);
					} catch(err) { self._flashError(err); }
				},
				clearFile: function(e) {
					try {
						element.trigger("jPlayer.setButtons", false); // Before flash method so states correct for when onProgressChange is called
						self._getMovie().fl_clearFile_mp3();
						self.config.diag.src = "";
						self.config.isFileSet = false;
					} catch(err) { self._flashError(err); }
				},
				load: function(e) {
					try {
						self._getMovie().fl_load_mp3();
					} catch(err) { self._flashError(err); }
				},
				play: function(e) {
					try {
						if(self._getMovie().fl_play_mp3()) {
							element.trigger("jPlayer.setButtons", true);
						}
					} catch(err) { self._flashError(err); }
				},
				pause: function(e) {
					try {
						if(self._getMovie().fl_pause_mp3()) {
							element.trigger("jPlayer.setButtons", false);
						}
					} catch(err) { self._flashError(err); }
				},
				stop: function(e) {
					try {
						if(self._getMovie().fl_stop_mp3()) {
							element.trigger("jPlayer.setButtons", false);
						}
					} catch(err) { self._flashError(err); }
				},
				playHead: function(e, p) {
					try {
						if(self._getMovie().fl_play_head_mp3(p)) {
							element.trigger("jPlayer.setButtons", true);
						}
					} catch(err) { self._flashError(err); }
				},
				playHeadTime: function(e, t) {
					try {
						if(self._getMovie().fl_play_head_time_mp3(t)) {
							element.trigger("jPlayer.setButtons", true);
						}
					} catch(err) { self._flashError(err); }
				},
				volume: function(e, v) {
					self.config.volume = v;
					try {
						self._getMovie().fl_volume_mp3(v);
					} catch(err) { self._flashError(err); }
				}
			};

			var eventsForHtmlAudio = {
				setFile: function(e, mp3, ogg) {
					if(self.config.usingMP3) {
						self.config.diag.src = mp3;
					} else { 
						self.config.diag.src = ogg;
					}
					if(self.config.isFileSet  && !self.config.isWaitingForPlay) {
						element.trigger("jPlayer.pause");
					}
					self.config.audio.autobuffer = self.config.autobuffer; // In case not preloading, but used a jPlayer("load")
					self.config.audio.preload = self.config.preload; // In case not preloading, but used a jPlayer("load")
					if(self.config.autobuffer) {
						self.config.audio.src = self.config.diag.src;
						self.config.audio.load();
					} else {
						self.config.isWaitingForPlay = true;
					}
					self.config.isFileSet = true;
					self.jPlayerOnProgressChange(0, 0, 0, 0, 0);
					clearInterval(self.config.jPlayerControllerId);
					if(self.config.autobuffer) {
						self.config.jPlayerControllerId = window.setInterval( function() {
							self.jPlayerController(false);
						}, 100);
					}
					clearInterval(self.config.delayedCommandId);
				},
				clearFile: function(e) {
					self.setFile("","");
					self.config.isWaitingForPlay = false;
					self.config.isFileSet = false;
				},
				load: function(e) {
					if(self.config.isFileSet) {
						if(self.config.isWaitingForPlay) {
							self.config.audio.autobuffer = true;
							self.config.audio.preload = 'auto';
							self.config.audio.src = self.config.diag.src;
							self.config.audio.load();
							self.config.isWaitingForPlay = false;
							clearInterval(self.config.jPlayerControllerId);
							self.config.jPlayerControllerId = window.setInterval( function() {
								self.jPlayerController(false);
							}, 100);
						}
					}
				},
				play: function(e) {
					if(self.config.isFileSet) {
						if(self.config.isWaitingForPlay) {
							self.config.audio.src = self.config.diag.src;
							self.config.audio.load();
						}
						self.config.audio.play();
						element.trigger("jPlayer.setButtons", true);
						clearInterval(self.config.jPlayerControllerId);
						self.config.jPlayerControllerId = window.setInterval( function() {
							self.jPlayerController(false);
						}, 100);
						clearInterval(self.config.delayedCommandId);
					}
				},
				pause: function(e) {
					if(self.config.isFileSet) {
						self.config.audio.pause();
						element.trigger("jPlayer.setButtons", false);
						clearInterval(self.config.delayedCommandId);
					}
				},
				stop: function(e) {
					if(self.config.isFileSet) {
						try {
							element.trigger("jPlayer.pause");
							self.config.audio.currentTime = 0;
							clearInterval(self.config.jPlayerControllerId);
							self.config.jPlayerControllerId = window.setInterval( function() {
								self.jPlayerController(true); // With override true
							}, 100);

						} catch(err) {
							clearInterval(self.config.delayedCommandId);
							self.config.delayedCommandId = window.setTimeout(function() {
								self.stop();
							}, 100);
						}
					}
				},
				playHead: function(e, p) {
					if(self.config.isFileSet) {
						try {
							element.trigger("jPlayer.load");
							if((typeof self.config.audio.buffered == "object") && (self.config.audio.buffered.length > 0)) {
								self.config.audio.currentTime = p * self.config.audio.buffered.end(self.config.audio.buffered.length-1) / 100;
							} else if(self.config.audio.duration > 0 && !isNaN(self.config.audio.duration)) {
								self.config.audio.currentTime = p * self.config.audio.duration / 100;
							} else {
								throw "e";
							}
							element.trigger("jPlayer.play");
						} catch(err) {
							element.trigger("jPlayer.play"); // Fixes a problem on the iPad with multiple instances
							element.trigger("jPlayer.pause"); // Also clears delayedCommandId interval.
							self.config.delayedCommandId = window.setTimeout(function() {
								self.playHead(p);
							}, 100);
						}
					}
				},
				playHeadTime: function(e, t) {
					if(self.config.isFileSet) {
						try {
							element.trigger("jPlayer.load");
							self.config.audio.currentTime = t/1000;
							element.trigger("jPlayer.play");
						} catch(err) {
							element.trigger("jPlayer.play"); // Fixes a problem on the iPad with multiple instances
							element.trigger("jPlayer.pause"); // Also clears delayedCommandId interval.
							self.config.delayedCommandId = window.setTimeout(function() {
								self.playHeadTime(t);
							}, 100);
						}
					}
				},
				volume: function(e, v) {
					self.config.volume = v;
					self.config.audio.volume = v/100;
					self.jPlayerVolume(v);
				}
			};

			if(this.config.usingFlash) {
				$.extend(events, eventsForFlash);
			} else {
				$.extend(events, eventsForHtmlAudio);
			}
			
			for(var event in events) {
				var e = "jPlayer." + event;
				this.element.unbind(e);
				this.element.bind(e, events[event]);
			}

			if(this.config.usingFlash) {
				if(this._checkForFlash(8)) {
					if($.browser.msie) {
						var html_obj = '<object id="' + this.config.fid + '"';
						html_obj += ' classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"';
						html_obj += ' codebase="' + document.URL.substring(0,document.URL.indexOf(':')) + '://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab"'; // Fixed IE non secured element warning.
						html_obj += ' type="application/x-shockwave-flash"';
						html_obj += ' width="' + this.config.width + '" height="' + this.config.height + '">';
						html_obj += '</object>';
			
						var obj_param = new Array();
						obj_param[0] = '<param name="movie" value="' + this.config.swf + '" />';
						obj_param[1] = '<param name="quality" value="high" />';
						obj_param[2] = '<param name="FlashVars" value="id=' + escape(this.config.id) + '&fid=' + escape(this.config.fid) + '&vol=' + this.config.volume + '" />';
						obj_param[3] = '<param name="allowScriptAccess" value="always" />';
						obj_param[4] = '<param name="bgcolor" value="' + this.config.bgcolor + '" />';
				
						var ie_dom = document.createElement(html_obj);
						for(var i=0; i < obj_param.length; i++) {
							ie_dom.appendChild(document.createElement(obj_param[i]));
						}
						this.element.html(ie_dom);
					} else {
						var html_embed = '<embed name="' + this.config.fid + '" id="' + this.config.fid + '" src="' + this.config.swf + '"';
						html_embed += ' width="' + this.config.width + '" height="' + this.config.height + '" bgcolor="' + this.config.bgcolor + '"';
						html_embed += ' quality="high" FlashVars="id=' + escape(this.config.id) + '&fid=' + escape(this.config.fid) + '&vol=' + this.config.volume + '"';
						html_embed += ' allowScriptAccess="always"';
						html_embed += ' type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />';
						this.element.html(html_embed);
					}
			
				} else {
					this.element.html("<p>Flash 8 or above is not installed. <a href='http://get.adobe.com/flashplayer'>Get Flash!</a></p>");
				}
			} else {
				this.config.audio.autobuffer = this.config.autobuffer;
				this.config.audio.preload = this.config.preload;
				this.config.audio.addEventListener("canplay", function() {
					var rnd = 0.1 * Math.random(); // Fix for Chrome 4: Fix volume being set multiple times before playing bug.
					var fix = (self.config.volume < 50) ? rnd : -rnd; // Fix for Chrome 4: Solves volume change before play bug. (When new vol == old vol Chrome 4 does nothing!)
					self.config.audio.volume = (self.config.volume + fix)/100; // Fix for Chrome 4: Event solves initial volume not being set correctly.
				}, false);
				this.config.audio.addEventListener("ended", function() {
					clearInterval(self.config.jPlayerControllerId);
					self.jPlayerOnSoundComplete();
				}, false);
				this.element.append(this.config.audio);
			}

			this.element.css({'position':this.config.position, 'top':this.config.top, 'left':this.config.left});
			
			if(this.config.graphicsFix) {
				var html_hidden = '<div id="' + this.config.hid + '"></div>';
				this.element.append(html_hidden);
			
				$.extend(this.config, {
					hSel: $("#"+this.config.hid)
				});
				this.config.hSel.css({'text-indent':'-9999px'});
			}

			if(!this.config.customCssIds) {
				$.each($.jPlayer._cssId, function(name, id) {
					self.cssId(name, id);
				});
			}

			if(!this.config.usingFlash) { // Emulate initial flash call after 100ms
				this.element.css({'left':'-9999px'}); // Mobile Safari always shows the <audio> controls, so hide them.
				window.setTimeout( function() {
					self.volume(self.config.volume);
					self.jPlayerReady();
				}, 100);
			}
		},
		jPlayerReady: function(swfVersion) { // Called from Flash / HTML5 interval
			if(this.config.usingFlash) {
				this.config.swfVersion = swfVersion;
				if(this.config.swfVersionRequired != this.config.swfVersion) {
					this._error("jPlayer's JavaScript / SWF version mismatch!\n\nJavaScript requires SWF : " + this.config.swfVersionRequired + "\nThe Jplayer.swf used is : " + this.config.swfVersion);
				}
			} else {
				this.config.swfVersion = "n/a";
			}
			this.jPlayerReadyCustom();
		},
		jPlayerReadyCustom: function() {
			// Replaced by ready function from options in _init()
		},
		setFile: function(mp3, ogg) {
			this.element.trigger("jPlayer.setFile", [mp3, ogg]);
		},
		clearFile: function() {
			this.element.trigger("jPlayer.clearFile");
		},
		load: function() {
			this.element.trigger("jPlayer.load");
		},
		play: function() {
			this.element.trigger("jPlayer.play");
		},
		pause: function() {
			this.element.trigger("jPlayer.pause");
		},
		stop: function() {
			this.element.trigger("jPlayer.stop");
		},
		playHead: function(p) {
			this.element.trigger("jPlayer.playHead", [p]);
		},
		playHeadTime: function(t) {
			this.element.trigger("jPlayer.playHeadTime", [t]);
		},
		volume: function(v) {
			v = this._limitValue(v, 0, 100);
			this.element.trigger("jPlayer.volume", [v]);
		},
		cssId: function(fn, id) {
			var self = this;
			if(typeof id == 'string') {
				if($.jPlayer._cssId[fn]) {
					if(this.config.cssId[fn] != undefined) {
						this.config.cssSelector[fn].unbind("click", this.config.clickHandler[fn]);
					}
					this.config.cssId[fn] = id;
					this.config.cssSelector[fn] = $("#"+id);
					this.config.clickHandler[fn] = function(e) {
						self[fn](e);
						$(this).blur();
						return false;
					}
					this.config.cssSelector[fn].click(this.config.clickHandler[fn]);
					var display = this.config.cssSelector[fn].css("display");
					if(fn == "play") {
						this.config.cssDisplay["pause"] = display;
					}
					if(!(fn == "pause" && display == "none")) {
						this.config.cssDisplay[fn] = display;
						if(fn == "pause") {
							this.config.cssSelector[fn].css("display", "none");
						}
					}
				} else {
					this._warning("Unknown/Illegal function in cssId\n\njPlayer('cssId', '"+fn+"', '"+id+"')");
				}
			} else {
				this._warning("cssId CSS Id must be a string\n\njPlayer('cssId', '"+fn+"', "+id+")");
			}
		},
		loadBar: function(e) { // Handles clicks on the loadBar
			if( this.config.cssId.loadBar != undefined ) {
				var offset = this.config.cssSelector.loadBar.offset();
				var x = e.pageX - offset.left;
				var w = this.config.cssSelector.loadBar.width();
				var p = 100*x/w;
				this.playHead(p);
			}
		},
		playBar: function(e) { // Handles clicks on the playBar
			this.loadBar(e);
		},
		onProgressChange: function(fn) {
			if($.isFunction(fn)) {
				this.onProgressChangeCustom = fn;
			} else {
				this._warning("onProgressChange parameter is not a function.");
			}
		},
		onProgressChangeCustom: function() {
			// Replaced in onProgressChange()
		},
		jPlayerOnProgressChange: function(lp, ppr, ppa, pt, tt) { // Called from Flash / HTML5 interval
			this.config.diag.loadPercent = lp;
			this.config.diag.playedPercentRelative = ppr;
			this.config.diag.playedPercentAbsolute = ppa;
			this.config.diag.playedTime = pt;
			this.config.diag.totalTime = tt;

			if (this.config.cssId.loadBar != undefined) {
				this.config.cssSelector.loadBar.width(lp+"%");
			}
			if (this.config.cssId.playBar != undefined ) {
				this.config.cssSelector.playBar.width(ppr+"%");
			}

			this.onProgressChangeCustom(lp, ppr, ppa, pt, tt);
			this._forceUpdate();
		},
		jPlayerController: function(override) { // The HTML5 interval function.
			var pt = 0, tt = 0, ppa = 0, lp = 0, ppr = 0;
			if(this.config.audio.readyState >= 1) {
				pt = this.config.audio.currentTime * 1000; // milliSeconds
				tt = this.config.audio.duration * 1000; // milliSeconds
				tt = isNaN(tt) ? 0 : tt; // Clean up duration in Firefox 3.5+
				ppa = (tt > 0) ? 100 * pt / tt : 0;
				if((typeof this.config.audio.buffered == "object") && (this.config.audio.buffered.length > 0)) {
					lp = 100 * this.config.audio.buffered.end(this.config.audio.buffered.length-1) / this.config.audio.duration;
					ppr = 100 * this.config.audio.currentTime / this.config.audio.buffered.end(this.config.audio.buffered.length-1);
				} else {
					lp = 100;
					ppr = ppa;
				}
			}

			if(!this.config.diag.isPlaying && lp >= 100) {
				clearInterval(this.config.jPlayerControllerId);
			}
			
			if(override) {
				this.jPlayerOnProgressChange(lp, 0, 0, 0, tt);
			} else {
				this.jPlayerOnProgressChange(lp, ppr, ppa, pt, tt);
			}
		},
		volumeMin: function() {
			this.volume(0);
		},
		volumeMax: function() {
			this.volume(100);
		},
		volumeBar: function(e) { // Handles clicks on the volumeBar
			if( this.config.cssId.volumeBar != undefined ) {
				var offset = this.config.cssSelector.volumeBar.offset();
				var x = e.pageX - offset.left;
				var w = this.config.cssSelector.volumeBar.width();
				var p = 100*x/w;
				this.volume(p);
			}
		},
		volumeBarValue: function(e) { // Handles clicks on the volumeBarValue
			this.volumeBar(e);
		},
		jPlayerVolume: function(v) { // Called from Flash / HTML5 event
			if( this.config.cssId.volumeBarValue != null ) {
				this.config.cssSelector.volumeBarValue.width(v+"%");
				this._forceUpdate();
			}
		},
		onSoundComplete: function(fn) {
			if($.isFunction(fn)) {
				this.onSoundCompleteCustom = fn;
			} else {
				this._warning("onSoundComplete parameter is not a function.");
			}
		},
		onSoundCompleteCustom: function() {
			// Replaced in onSoundComplete()
		},
		jPlayerOnSoundComplete: function() { // Called from Flash / HTML5 interval
			this.element.trigger("jPlayer.setButtons", false);
			this.onSoundCompleteCustom();
		},
		getData: function(name) {
			var n = name.split(".");
			var p = this.config;
			for(var i = 0; i < n.length; i++) {
				if(p[n[i]] != undefined) {
					p = p[n[i]];
				} else {
					this._warning("Undefined data requested.\n\njPlayer('getData', '" + name + "')");
					return undefined;
				}
			}
			return p;
		},
		_getMovie: function() {
			return document[this.config.fid];
		},
		_checkForFlash: function (version){
			// Function checkForFlash adapted from FlashReplace by Robert Nyman
			// http://code.google.com/p/flashreplace/
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
		},
		_forceUpdate: function() { // For Safari and Chrome
			if(this.config.graphicsFix) {
				this.config.hSel.text(""+Math.random());
			}
		},
		_limitValue: function(value, min, max) {
			return (value < min) ? min : ((value > max) ? max : value);
		},
		_flashError: function(e) {
			this._error("Problem with Flash component.\n\nCheck the swfPath points at the Jplayer.swf path.\n\nswfPath = " + this.config.swfPath + "\nurl: " + this.config.swf + "\n\nError: " + e.message);
		},
		_error: function(msg) {
			if(this.config.errorAlerts) {
				this._alert("Error!\n\n" + msg);
			}
		},
		_warning: function(msg) {
			if(this.config.warningAlerts) {
				this._alert("Warning!\n\n" + msg);
			}
		},
		_alert: function(msg) {
			alert("jPlayer " + this.config.version + " : id='" + this.config.id +"' : " + msg);
		}
	};
})(jQuery);
