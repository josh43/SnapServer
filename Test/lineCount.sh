#!/bin/bash
# p never follow symbolic links
# . means this directory. -maxdepth 5

findLines="cat *.js"
countLines="wc -l"
originDir=$(pwd)
echo $originDir
cd ../Database
echo "Lines in "
echo $(pwd)
$findLines | $countLines
cd ../routes
echo "Lines in"
echo $(pwd)
$findLines | $countLines

cd $originDir