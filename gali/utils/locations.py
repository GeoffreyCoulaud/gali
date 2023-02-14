from os import environ

HOME = environ.get("HOME")

ENV_XDG_DATA_DIRS: str = environ.get("XDG_DATA_DIRS", default="")
XDG_DATA_DIRS: list[str]
if not XDG_DATA_DIRS: XDG_DATA_DIRS = list()
else: XDG_DATA_DIRS = ENV_XDG_DATA_DIRS.split(":")

XDG_DATA_HOME = environ.get("XDG_DATA_HOME", default=f"{HOME}/.local/share")

XDG_CONFIG_HOME = environ.get("XDG_CONFIG_HOME", default=f"{HOME}/.config")
