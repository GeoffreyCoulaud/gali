from typing import Iterable

from gali.sources.stemmed_shell_command_startup_chain import StemmedShellCommandStartupChain
from gali.sources.game import Game


class SteamStartupChain(StemmedShellCommandStartupChain):

    stem = "xdg-open"

    def get_start_command_suffix(self, game: Game, **kwargs) -> Iterable[str]:
        return [f"steam://rungameid/{game.app_id}"]