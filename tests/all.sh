SHELL_SCRIPT_DIR=$(dirname "$0")
for testFile in $SHELL_SCRIPT_DIR/*.test.js; do

	echo "--- $testFile ---"
	node "$testFile"
	echo ""

done