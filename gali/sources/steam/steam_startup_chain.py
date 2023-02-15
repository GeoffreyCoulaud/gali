from typing import Iterable

from gali.sources.abc_stemmed_cli_startup_chain import ABCStemmedCLIStartupChain
from gali.sources.steam.abc_steam_game import ABCSteamGame


class SteamStartupChain(ABCStemmedCLIStartupChain):

    game: ABCSteamGame
    name = "Steam"
    stem = "xdg-open"

    def get_start_command_suffix(self) -> Iterable[str]:
        return [f"steam://rungameid/{self.game.app_id}"]