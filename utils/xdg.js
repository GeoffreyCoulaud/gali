const config      = require("./configFormats.js");
const shell_quote = require("shell-quote");
const fsp         = require("fs/promises");
const fs          = require("fs");

function directorySizeDistance(subdir, iconSize, iconScale){
	const Scale = subdir.get("Scale");
	const Type = subdir.get("Type");
	const Size = subdir.get("Size");
	const MinSize = subdir.get("MinSize");
	const MaxSize = subdir.get("MaxSize");
	const Threshold = subdir.get("Threshold");
	if (Type === "Fixed"){
		return Math.abs(Size*Scale - iconSize*iconScale);
	}
	if (Type === "Scaled"){
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
	const Scale = subdir.get("Scale");
	const Type = subdir.get("Type");
	const Size = subdir.get("Size");
	const MinSize = subdir.get("MinSize");
	const MaxSize = subdir.get("MaxSize");
	const Threshold = subdir.get("Threshold");
	if (Scale !== iconScale){
		return false;
	}
	if (Type === "Fixed"){
		return Size === iconSize;
	}
	if (Type === "Scaled"){
		return MinSize <= iconSize && iconSize <= MaxSize;
	}
	if (Type === "Threshold"){
		return (Size - Threshold) <= iconSize && iconSize <= (Size - Threshold);
	}
	return false;
}

function lookupIcon(icon, size, scale, theme){
	const exts = ["png", "svg", "xpm"];
	let iconPath;
	const subdirnameList = theme["Icon Theme"].get("Directories");
	for (const subdirname of subdirnameList){
		const subdir = theme[subdirname];
		if (!directoryMatchesSize(subdir, size, scale)){
			continue;
		}
		for (const ext of exts){
			iconPath = `${theme.path}/${subdirname}/${icon}.${ext}`;
			if (fs.existsSync(iconPath)){
				return iconPath;
			}
		}
	}
	let minimalSize = Number.MAX_SAFE_INTEGER;
	let closestIconPath;
	for (const subdirname of subdirnameList){
		const subdir = theme[subdirname];
		for (const ext of exts){
			const distance = directorySizeDistance(subdir, size, scale);
			iconPath = `${theme.path}/${subdirname}/${icon}.${ext}`;
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
 * @param {Map} themes - A map of the system's icon themes
 * @returns {string} - The absolute path to the icon's image
 * @see https://specifications.freedesktop.org/icon-theme-spec/icon-theme-spec-latest.html#icon_lookup
 */
// TODO write tests
async function getIcon(icon, size, scale, userThemeName, themes){
	let filename;
	const userTheme = themes.get(userThemeName);
	const defaultTheme = themes.get("hicolor");
	if (userTheme){
		filename = getIconHelper(icon, size, scale, userTheme);
		if (filename) return filename;
	}
	if (defaultTheme){
		filename = getIconHelper(icon, size, scale, defaultTheme);
		if (filename) return filename;
	}
	return undefined;
}

function getIconThemeDirs(){
	const USER_DIR = process.env["HOME"];
	const XDG_DATA_DIRS = process.env["XDG_DATA_DIRS"];
	const dirs = [];
	if (USER_DIR && fs.existsSync(`${USER_DIR}/.icons`)){
		dirs.push(`${USER_DIR}/.icons`);
	}
	if (XDG_DATA_DIRS){
		for (const dir of XDG_DATA_DIRS.split(":")){
			if (fs.existsSync(`${dir}/icons`)){
				dirs.push(`${dir}/icons`);
			}
		}
	}
	dirs.push("/usr/share/pixmaps");
	return dirs;
}

async function getIconThemesInDirs(dirs){
	const themes = new Map();
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
			const themeData = config.theme2js(themeFileContents);
			const themeName = themeData["Icon Theme"]["Name"];
			themeData["path"] = themeDirPath;
			if (themes.has(themeName)){
				continue;
			}
			themes.set(themeName, themeData);
		}
	}
	return themes;
}

/**
 * Find all the icon themes on the machine.
 * This follows the xdg guidelines.
 * @returns {Map} - A map of theme names and theme data
 * @see https://specifications.freedesktop.org/icon-theme-spec/icon-theme-spec-latest.html#directory_layout
 */
// TODO write tests
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
	/*
		--- For gnome
		gsettings set org.gnome.desktop.interface icon-theme
	*/
	return undefined;
}

/**
 * Split a desktop file exec field into cli arguments
 * @param {string} exec - A desktop file's exec field
 * @returns {string[]} - The exec field parsed and stripped
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