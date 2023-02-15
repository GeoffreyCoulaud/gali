from typing import Iterable

from gali.sources.abc_stemmed_cli_startup_chain import ABCStemmedCLIStartupChain


class YuzuStartupChain(ABCStemmedCLIStartupChain):

    name = "Yuzu"
    stem = "yuzu"

    def get_start_command(self) -> Iterable[str]:
        return [self.game.game_path]