from typing import Iterable

from gali.sources.stemmed_cli_startup_chain import StemmedCLIStartupChain
from gali.sources.steam.abc_steam_game import ABCSteamGame


class SteamStartupChain(StemmedCLIStartupChain):

    game: ABCSteamGame
    name = "Steam"
    stem = "xdg-open"

    def get_start_command_suffix(self) -> Iterable[str]:
        return [f"steam://rungameid/{self.game.app_id}"]