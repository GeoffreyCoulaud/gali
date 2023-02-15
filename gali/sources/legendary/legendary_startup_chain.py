from typing import Iterable

from gali.sources.abc_stemmed_cli_startup_chain import ABCStemmedCLIStartupChain


class LegendaryStartupChain(ABCStemmedCLIStartupChain):

    name = "Legendary"
    stem = ["legendary", "launch"]

    def get_start_command_suffix(self) -> Iterable[str]:
        return [self.game.app_name]