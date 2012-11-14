all:
	#Install jPlayer
	cp jquery.jplayer/jquery.jplayer.js ~/a9engine/webmedia/scripts/src/jquery/jquery.jplayer.js
	cp jquery.jplayer/Jplayer.swf ~/a9engine/httpdocs/gymglish.com/flash/Jplayer.swf
	cp jquery.jplayer/Jplayer.swf ~/a9engine/httpdocs/frantastique.com/flash/Jplayer.swf
clean:
	rm ~/a9engine/webmedia/scripts/src/jquery/jquery.jplayer.js
	rm ~/a9engine/httpdocs/gymglish.com/flash/Jplayer.swf
	rm ~/a9engine/httpdocs/frantastique.com/flash/Jplayer.swf
