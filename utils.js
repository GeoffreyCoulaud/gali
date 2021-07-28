export function get2DArrayColumnSizes(arrays){
	let padding = [];
	for (let array of arrays){
		for (let i = 0; i < array.length; i++){
			let strlen = String(array[i]).length;
			if (typeof padding[i] === "undefined"){
				padding[i] = strlen;
			} else if (padding[i] < strlen){
				padding[i] = strlen;
			}
		}
	}
	return padding;
}