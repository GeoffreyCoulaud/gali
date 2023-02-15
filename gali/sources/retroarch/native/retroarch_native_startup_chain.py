from typing import Iterable

from gali.sources.abc_stemmed_cli_startup_chain import ABCStemmedCLIStartupChain
from gali.sources.retroarch.abc_retroarch_game import ABCRetroarchGame


class RetroarchNativeStartupChain(ABCStemmedCLIStartupChain):

    game: ABCRetroarchGame
    name = "Retroarch"
    stem = ["retroarch", "--libretro"]

    def get_start_command_suffix(self) -> Iterable[str]:
        return [self.game.core_path, self.game.game_path]