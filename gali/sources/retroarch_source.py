import os
import json
from pathlib import PurePath

from gali.games.retroarch_game import RetroarchGame, RetroarchFlatpakGame
from gali.sources.source import Source
from gali.utils.cfg_parser import CfgParser
from gali.utils.locations import HOME
from gali.sources.file_dependent_scannable import FileDependentScannable


class RetroarchSource(Source, FileDependentScannable):

    name: str = "Retroarch"
    game_class: type[RetroarchGame] = RetroarchGame
    config_path: str = f"{HOME}/.config/retroarch/retroarch.cfg"

    def get_config(self) -> CfgParser:
        config = CfgParser()
        config.read(self.config_path)
        return config

    def get_playlist_paths(self, config: CfgParser) -> tuple[str]:

        # Get playlist dir
        playlists_dir: str = config.get("playlist_directory", None)
        if playlists_dir is None:
            raise KeyError()

        # Handle "~" for user home
        playlists_dir = os.path.expanduser(playlists_dir)

        def filter_fn(dirent: os.DirEntry):
            if not dirent.is_file():
                return False
            if not dirent.name.endswith(".lpl"):
                return False
            return True

        # Get playlist paths
        iterator = os.scandir(playlists_dir)
        playlists = tuple(filter(filter_fn, iterator))
        return playlists

    def get_games(self, playlist_paths: tuple[str]) -> tuple[RetroarchGame]:

        games = []

        for playlist_path in playlist_paths:

            # Get playlist data
            try:
                file = open(playlist_path, encoding="utf-8-sig")
                playlist = json.load(file)
            except OSError:
                continue
            else:
                file.close()

            # Get playlist platform
            platform = PurePath(playlist_path).stem

            # Get default core for the playlist
            pl_core_path = playlist.get("default_core_path", "")
            if len(pl_core_path) == 0:  # Handle empty string
                pl_core_path = None

            # Get games
            items = playlist.get("items", list())
            for item in items:

                # Skip broken games
                name = item.get("label", None)
                game_path = item.get("path", None)
                core_path = item.get("core_path", pl_core_path)
                if (
                    name is None or
                    game_path is None or
                    core_path is None
                ):
                    continue

                # Build games
                game = self.game_class(
                    name=name,
                    game_path=game_path,
                    core_path=core_path,
                    platform=platform
                )
                games.append(game)

        return tuple(games)

    def scan(self) -> tuple[RetroarchGame]:
        config = self.get_config()
        playlist_paths = self.get_playlist_paths(config)
        games = self.get_games(playlist_paths)
        return games

    def get_precondition_file_path(self):
        return self.config_path


class RetroarchFlatpakSource(RetroarchSource):

    name: str = "Retroarch (Flatpak)"
    game_class: type[RetroarchFlatpakGame] = RetroarchFlatpakGame
    config_path: str = f"{HOME}/.var/app/org.libretro.RetroArch\
/config/retroarch/retroarch.cfg"
