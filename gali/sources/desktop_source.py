from math import inf

from gali.sources.game_dir import GameDir
from gali.sources.source import Source
from gali.sources.scannable import UnscannableReason
from gali.games.desktop_game import DesktopGame
from gali.utils.locations import XDG_DATA_DIRS, XDG_DATA_HOME
from gali.utils.deep_find_files import deep_find_files
from gali.utils.explicit_config_parser import ExplicitConfigParser
from gali.utils.sandbox import is_flatpak


class DesktopSource(Source):

    name: str = "Desktop Entries"
    game_class: type[DesktopGame] = DesktopGame
    extensions: tuple[str] = (".desktop",)

    def get_desktop_dirs(self) -> tuple[GameDir]:

        # Regular dirs
        dirs = [
            f"{XDG_DATA_HOME}/applications"
            "/usr/share/applications"
            "/usr/local/share/applications"
        ]

        # User defined dirs
        for xdg_data_dir in XDG_DATA_DIRS:
            dirs.append(f"{xdg_data_dir}/applications")

        return tuple(dirs)

    def get_desktop_paths(self, desktop_dirs) -> tuple[str]:
        desktop_paths = []
        for root_dir in desktop_dirs:
            try:
                found = deep_find_files(root_dir, inf, self.extensions)
            except OSError:
                continue
            desktop_paths.extend(found)
        return tuple(desktop_paths)

    def get_desktop_games(self, desktop_paths) -> tuple[DesktopGame]:

        games = []

        for path in desktop_paths:

            # Read desktop entry data
            data = ExplicitConfigParser()
            try:
                data.read(path)
            except IOError:
                continue

            # Filter out hidden entries
            hidden = data.getboolean(
                "Desktop Entry",
                "Hidden",
                fallback=False
            )
            if hidden:
                continue
            no_display = data.getboolean(
                "Desktop Entry",
                "NoDisplay",
                fallback=False
            )
            if no_display:
                continue

            # Filter out entries that are not games
            categories = data.get("Desktop Entry", "Categories", fallback="")
            categories = categories.split(";")
            if not ("Game" in categories):
                continue

            # Build game
            name = data.get("Desktop Entry", "Name")
            exec_str = data.get("Desktop Entry", "Exec", raw=True)
            game = self.game_class(
                name=name,
                exec_str=exec_str
            )
            games.append(game)

        return tuple(games)

    def scan(self) -> tuple[DesktopGame]:
        dirs = self.get_desktop_dirs()
        paths = self.get_desktop_paths(dirs)
        games = self.get_desktop_games(paths)
        return games

    def is_scannable(self):
        """
        Desktop entries cannot yet be read correctly from inside flatpak's sandbox.
        For a future fix, see :
        https://github.com/flatpak/xdg-desktop-portal/issues/809
        """
        if is_flatpak():
            return UnscannableReason("Not scannable inside of the flatpak sandbox")
        return True