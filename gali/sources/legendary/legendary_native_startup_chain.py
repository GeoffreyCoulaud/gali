from typing import Iterable

from gali.sources.abc_stemmed_cli_startup_chain import ABCStemmedCLIStartupChain
from gali.sources.legendary.abc_legendary_game import ABCLegendaryGame


class LegendaryNativeStartupChain(ABCStemmedCLIStartupChain):

    game: ABCLegendaryGame
    name = "Legendary"
    stem = ["legendary", "launch"]

    def get_start_command_suffix(self) -> Iterable[str]:
        return [self.game.app_name]