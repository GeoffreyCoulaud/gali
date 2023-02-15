from typing import Iterable

from gali.sources.stemmed_cli_startup_chain import StemmedCLIStartupChain
from gali.sources.legendary.abc_legendary_game import ABCLegendaryGame


class LegendaryNativeStartupChain(StemmedCLIStartupChain):

    game: ABCLegendaryGame
    name = "Legendary"
    stem = ["legendary", "launch"]

    def get_start_command_suffix(self) -> Iterable[str]:
        return [self.game.app_name]