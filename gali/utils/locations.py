from os import environ

HOME = environ.get("HOME")

XDG_DATA_DIRS = environ.get("XDG_DATA_DIRS", default="")
if not XDG_DATA_DIRS: XDG_DATA_DIRS = list()
else: XDG_DATA_DIRS = XDG_DATA_DIRS.split(":")

XDG_DATA_HOME = environ.get("XDG_DATA_HOME", default=f"{HOME}/.local/share")

XDG_CONFIG_HOME = environ.get("XDG_CONFIG_HOME", default=f"{HOME}/.config")
