const config      = require("./configFormats.js");
const shell_quote = require("shell-quote");
const fsp         = require("fs/promises");
const fs          = require("fs");
const path        = require("path");

function directorySizeDistance(subdir, iconSize, iconScale){
	const Scale     = subdir["Scale"] ?? 1;
	const Type      = subdir["Type"];
	const Size      = subdir["Size"];
	const MinSize   = subdir["MinSize"];
	const MaxSize   = subdir["MaxSize"];
	const Threshold = subdir["Threshold"];
	if (Type === "Fixed"){
		return Math.abs(Size*Scale - iconSize*iconScale);
	}
	if (Type === "Scalable"){
		if (iconSize*iconScale < MinSize*Scale){
			return MinSize*Scale - iconSize*iconScale;
		}
		if (iconSize*iconScale > MaxSize*Scale){
			return iconSize*iconScale - MaxSize*Scale;
		}
		return 0;
	}
	if (Type === "Threshold"){
		if (iconSize*iconScale < (Size - Threshold)*Scale){
			return MinSize*Scale - iconSize*iconScale;
		}
		if (iconSize*iconSize > (Size + Threshold)*Scale){
			return iconSize*iconSize - MaxSize*Scale;
		}
		return 0;
	}
}

function directoryMatchesSize(subdir, iconSize, iconScale){
	const Scale     = subdir["Scale"] ?? 1;
	const Type      = subdir["Type"];
	const Size      = subdir["Size"];
	const MinSize   = subdir["MinSize"];
	const MaxSize   = subdir["MaxSize"];
	const Threshold = subdir["Threshold"];
	if (Scale !== iconScale){
		return false;
	}
	if (Type === "Fixed"){
		return Size === iconSize;
	}
	if (Type === "Scalable"){
		return MinSize <= iconSize && iconSize <= MaxSize;
	}
	if (Type === "Threshold"){
		return (Size - Threshold) <= iconSize && iconSize <= (Size - Threshold);
	}
	return false;
}

function lookupIcon(icon, size, scale, theme){
	const exts = ["svg", "png", "xpm"];
	let iconPath;
	const subdirnames = theme["Icon Theme"]["Directories"].split(",").filter(x=>!!x);
	for (const subdirname of subdirnames){
		const subdir = theme[subdirname];
		if (!directoryMatchesSize(subdir, size, scale)){
			continue;
		}
		for (const ext of exts){
			iconPath = `${theme._path}/${subdirname}/${icon}.${ext}`;
			if (fs.existsSync(iconPath)){
				return iconPath;
			}
		}
	}
	let minimalSize = Number.MAX_SAFE_INTEGER;
	let closestIconPath;
	for (const subdirname of subdirnames){
		const subdir = theme[subdirname];
		for (const ext of exts){
			const distance = directorySizeDistance(subdir, size, scale);
			iconPath = `${theme._path}/${subdirname}/${icon}.${ext}`;
			if (fs.existsSync(iconPath) && distance < minimalSize){
				closestIconPath = iconPath;
				minimalSize = distance;
			}
		}
	}
	if (closestIconPath){
		return closestIconPath;
	}
	return undefined;
}

function getIconHelper(icon, size, scale, theme){
	// eslint-disable-next-line prefer-const
	let filename = lookupIcon(icon, size, scale, theme);
	if (filename){
		return filename;
	}
	// TODO search through parents
	/*
	if (theme.hasParents){
		for (const parent of theme.parents){
			filename = findIconHelper(icon, size, scale, parent);
			if (filename){
				return filename;
			}
		}
	}
	*/
	return undefined;
}

/**
 * Find the named XDG icon's file path
 * @param {string} icon - The icon identifier
 * @param {number} size - The required icon size
 * @param {number} scale - The required icon scale
 * @param {string} userThemeName - Name of the current user's theme
 * @param {Object[]} themes - An array containing the system's icon themes
 * @returns {string} The absolute path to the icon's image
 * @see https://specifications.freedesktop.org/icon-theme-spec/icon-theme-spec-latest.html#icon_lookup
 */
async function getIcon(icon, size, scale, userThemeName, themes){
	const defaultThemeName = "Hicolor";
	const themeNames = new Set([userThemeName, defaultThemeName]);
	let filename;
	for (const themeName of themeNames){
		for (const theme of themes){
			if (theme["Icon Theme"]["Name"] === themeName){
				filename = getIconHelper(icon, size, scale, theme);
				if (filename){
					return filename;
				}
			}
		}
	}
	// TODO check in /usr/share/pixmaps
	// It's not an icon theme folder, but it contains icons
	return undefined;
}

function getIconThemeDirs(){
	const USER_DIR = process.env["HOME"];
	const XDG_DATA_DIRS = process.env["XDG_DATA_DIRS"];
	const dirs = [];

	// Get from $HOME/.icons
	const userIconDir = path.resolve(`${USER_DIR}/.icons`);
	if (USER_DIR && fs.existsSync(userIconDir)){
		dirs.push(userIconDir);
	}

	// Get from $XDG_DATA_DIRS/icons
	if (XDG_DATA_DIRS){
		for (const dir of XDG_DATA_DIRS.split(":")){
			if (!dir){
				continue;
			}
			const xdgIconDir = path.resolve(`${dir}/icons`);
			if (fs.existsSync(xdgIconDir)){
				dirs.push(xdgIconDir);
			}
		}
	}

	return dirs;
}

async function getIconThemesInDirs(dirs){
	const themes = [];
	for (const dir of dirs){
		const dirents = await fsp.readdir(dir, {withFileTypes: true});
		for (const dirent of dirents){
			if (!dirent.isDirectory()){
				continue;
			}
			const themeDirPath  = `${dir}/${dirent.name}`;
			const themeFilePath = `${themeDirPath}/index.theme`;
			if (!fs.existsSync(themeFilePath)){
				continue;
			}
			const themeFileContents = await fsp.readFile(themeFilePath, "utf-8");
			const theme = config.theme2js(themeFileContents);
			const themeName = theme["Icon Theme"]["Name"];
			if (!themeName || typeof themes[themeName] !== "undefined"){
				continue;
			}
			theme._path = themeDirPath;
			themes.push(theme);
		}
	}
	return themes;
}

/**
 * Find all the icon themes on the machine.
 * This follows the xdg spec.
 * @returns {Object[]} An array of themes.
 * @see https://specifications.freedesktop.org/icon-theme-spec/icon-theme-spec-latest.html#directory_layout
 */
async function getIconThemes(){
	const dirs = getIconThemeDirs();
	const themes = await getIconThemesInDirs(dirs);
	return themes;
}

/**
 * Get the current user's icon theme name
 * @returns {string|undefined} The user's icon theme name
 */
async function getUserIconThemeName(){
	// TODO implement for all linux desktops
	// TODO test
	/*
		--- For gnome
		gsettings set org.gnome.desktop.interface icon-theme
	*/
	return undefined;
}

/**
 * Split a desktop file exec field into cli arguments
 * @param {string} exec - A desktop file's exec field
 * @returns {string[]} The exec field parsed and stripped
 */
function splitDesktopExec(exec){
	const execFieldCodesRegex = /%[fFuUdDnNickvm]/g;
	const parsed = shell_quote.parse(exec);
	const arr = parsed.filter(arg=>!arg.match(execFieldCodesRegex));
	return arr;
}

module.exports = {
	splitDesktopExec,
	getUserIconThemeName,
	getIconThemes,
	getIcon,
};