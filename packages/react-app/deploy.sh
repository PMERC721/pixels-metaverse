#!/usr/bin/env sh

set -e

npm run build

cd build

# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:pmerc721/pmerc721.github.io.git master:gh-pages

cd -