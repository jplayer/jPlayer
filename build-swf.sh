#!/bin/sh

mtasc actionscript/Jplayer.as \
  -swf jquery.jplayer/Jplayer.swf \
  -main -header 120:20:40 \
  -v -version 8 -group \
  | egrep -v '^(Parsed|Typing)'
