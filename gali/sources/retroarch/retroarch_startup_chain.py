from typing import Iterable

from gali.sources.stemmed_shell_command_startup_chain import StemmedShellCommandStartupChain
from gali.sources.game import Game


class RetroarchStartupChain(StemmedShellCommandStartupChain):

    stem = ["retroarch", "--libretro"]

    def get_start_command_suffix(self, game: Game, **kwargs) -> Iterable[str]:
        return [game.core_path, game.game_path]