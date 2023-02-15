from typing import Iterable

from gali.sources.stemmed_cli_startup_chain import StemmedCLIStartupChain
from gali.sources.legendary.legendary_game import LegendaryGame


class LegendaryNativeStartupChain(StemmedCLIStartupChain):

    game: LegendaryGame
    name = "Legendary"
    stem = ["legendary", "launch"]

    def get_start_command_suffix(self) -> Iterable[str]:
        return [self.game.app_name]