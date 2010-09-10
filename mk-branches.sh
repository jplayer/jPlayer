#!/bin/bash

function tabs {
  unexpand "$@"
}
function spaces {
  expand "$@"
}

for b in tabs spaces; do
  git checkout master
  git branch -D $b
  git checkout -b $b
  for f in jquery.jplayer/jquery.jplayer.js actionscript/Jplayer.as; do
    $b -t2 "$f" > "$f.$b"
    mv "$f.$b" "$f"
  done
  git commit -am "Convert indentation to $b"
done

git checkout master
