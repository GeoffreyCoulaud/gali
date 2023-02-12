import vdf
import os
import re

from gali.sources.source import Source
from gali.sources.steam.steam_game import SteamGame
from gali.utils.locations import HOME
from gali.sources.file_dependent_scannable import FileDependentScannable


class InvalidManifestException(Exception):
    pass


class NonGameManifestException(Exception):
    pass


def fullmatch_any(value: str, patterns: tuple[re.Pattern]) -> bool:
    """Test if a string matches any regex in a tuple"""
    for pattern in patterns:
        if pattern.fullmatch(value):
            return True
    return False


class SteamSource(Source, FileDependentScannable):

    name: str = "Steam"
    game_class: type[SteamGame] = SteamGame

    steam_dir: str = f"{HOME}/.local/share/Steam"
    rel_library_config: str = "config/libraryfolders.vdf"
    rel_image_cache: str = "appcache/librarycache"
    installed_mask = 4
    ignored_appids = (221410, 228980, 1070560)
    ignored_name_patterns = (
        re.compile("^Steamworks.*"),
        re.compile("^(S|s)team ?(L|l)inux ?(R|r)untime.*"),
        re.compile("^Proton.*"),
    )

    def get_library_config(self) -> dict:
        path = f"{self.steam_dir}/{self.rel_library_config}"
        try:
            with open(path, "r", encoding="utf-8-sig") as file:
                config = vdf.load(file)
        except Exception as err:
            raise err
        else:
            return config

    def get_dir_paths(self, config: dict) -> tuple[str]:
        paths = []
        library_folders = config["libraryfolders"]
        if library_folders is None:
            raise KeyError()
        for key in library_folders:
            entry = library_folders[key]
            path = entry.get("path", None)
            if path is None:
                continue
            paths.append(path)
        return tuple(paths)

    def get_manifest_paths(self, game_dirs: list[str]) -> list[str]:

        mainfest_paths = []

        # Get all manifest paths
        for game_dir in game_dirs:

            # Test if dir is scannable
            path = f"{game_dir}/steamapps"
            if not os.access(path, os.R_OK):
                continue

            # Scan dir
            for dirent in os.scandir(path):
                if not dirent.is_file():
                    continue
                if not dirent.name.startswith("appmanifest_"):
                    continue
                if not dirent.name.endswith(".acf"):
                    continue
                mainfest_paths.append(dirent.path)

        return mainfest_paths

    def read_manifest(self, manifest_path: str) -> SteamGame:

        # Get data
        try:
            with open(manifest_path, "r", encoding="utf-8-sig") as file:
                data = vdf.load(file)
        except Exception as err:
            raise err

        # Get installation state
        app_state = data.get("AppState", None)
        if app_state is None:
            raise InvalidManifestException("Missing AppState")
        state_flags = int(app_state.get("StateFlags", 0))
        is_installed = state_flags & self.installed_mask

        # Get appid
        app_id = app_state.get("appid", None)
        if app_id is None:
            raise InvalidManifestException("Missing appid")

        # Get name
        name = app_state.get("name", None)
        if name is None:
            raise InvalidManifestException("Missing name")

        # Skip known non-games
        if app_id in self.ignored_appids:
            raise NonGameManifestException("AppId in ignore list")
        if fullmatch_any(name, self.ignored_name_patterns):
            raise NonGameManifestException("Name matches an ignore pattern")

        # Build game
        game = self.game_class(
            name=name,
            app_id=app_id,
            is_installed=is_installed
        )
        return game

    def get_games(self, manifest_paths: tuple[str]) -> tuple[SteamGame]:

        games = []

        # Read all manifests
        for manifest_path in manifest_paths:

            # Build game
            try:
                game = self.read_manifest(manifest_path)
            except Exception:
                continue

            # If an existing game has the same app id,
            # if the new is installed and not the old,
            # remove the old.
            for (i, old) in enumerate(games):
                if (
                    old.app_id == game.app_id
                    and not old.is_installed
                    and game.is_installed
                ):
                    del games[i]

            games.append(game)

        return tuple(games)

    def scan(self) -> tuple[SteamGame]:
        config = self.get_library_config()
        game_dir_paths = self.get_dir_paths(config)
        manifest_paths = self.get_manifest_paths(game_dir_paths)
        games = self.get_games(manifest_paths)
        return games

    def get_precondition_file_path(self):
        return f"{self.steam_dir}/{self.rel_library_config}"


class SteamFlatpakSource(SteamSource):

    name: str = "Steam (Flatpak)"
    steam_dir: str = f"{HOME}/.var/app/com.valvesoftware.Steam\
/.local/share/Steam"
