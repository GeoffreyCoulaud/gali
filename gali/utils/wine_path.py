from pathlib import PureWindowsPath, PurePosixPath

class NonAbsoluteError(Exception):
	pass

def wine_to_posix(wine_prefix_path: str, path: str):
	"""Convert an absolute path from inside a wine prefix to an absolute posix path."""

	win_path = PureWindowsPath(path)
	if not win_path.is_absolute():
		raise NonAbsoluteError()
	win_drive = win_path.drive.lower()
	win_parts = win_path.parts[1:]
	posix_path = PurePosixPath(
		wine_prefix_path, 
		"dosdevices", 
		win_drive, 
		*win_parts
	)
	return str(posix_path)

def posix_to_wine(path: str):
	"""Convert an absolute posix path to a wine path"""

	posix_path = PurePosixPath(path)
	if not posix_path.is_absolute():
		raise NonAbsoluteError()
	posix_parts = posix_path.parts
	win_path = PureWindowsPath("z:\\", *posix_parts[1:])
	return str(win_path)