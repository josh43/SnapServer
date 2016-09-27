#!/usr/bin/env bash
toDir="/Users/josh/Documents/CS Projects/snapshift"
fromDir="/Users/josh/Documents/CS Projects/SnapServer"

cp -fr "${fromDir}/Database" "${toDir}/"
cp -fr "${fromDir}/routes" "${toDir}/"
cp -fr "${fromDir}/bin" "${toDir}/"
cp -fr "${fromDir}/app.js" "${toDir}/"

cd "${toDir}"
git add *
git commit -m "Automated push"
git push