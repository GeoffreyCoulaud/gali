from os import environ

USER_DIR = environ.get("HOME")
USER_CONFIG_DIR = environ.get("XDG_CONFIG_DIR", f"{USER_DIR}/.config")
USER_DATA_DIR = f"{USER_DIR}/.local/share"
XDG_DATA_DIRS = environ.get("XDG_DATA_DIRS").split(":")
APP_CONFIG_DIR = f"{USER_CONFIG_DIR}/gali"
APP_CONFIG_PATH = f"{APP_CONFIG_DIR}/preferences.json"
APP_DATA_DIR = f"{USER_DATA_DIR}/gali"
APP_START_SCRIPTS_DIR = f"{APP_DATA_DIR}/start-scripts"