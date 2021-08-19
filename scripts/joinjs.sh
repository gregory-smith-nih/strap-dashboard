set -e -o errexit -u
src="./js"
fabric="$src/fabric"
static="./site/static"
ls $fabric | while IFS= read -r f; do tail -c1 < "$fabric/$f" | read -r _ || echo >> "$fabric/$f"; done
cat $fabric/*.js > $static/js/index.js
cp $src/app.js $static/js
jshint $fabric | sed 's/ line //g'
jshint $src/app.js | sed 's/ line //g'