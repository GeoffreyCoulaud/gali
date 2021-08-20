const { execFile } = require("child_process");

/**
 * A promise version of the child_process execFile
 */
function execFilePromise(command, args = [], options = {}){
	return new Promise((resolve, reject)=>{
		execFile(command, args, options, (error, stdout, stderr)=>{
			if (error) reject(error);
			else resolve(stdout, stderr);
		});
	});
}

module.exports = {
	execFilePromise,
};