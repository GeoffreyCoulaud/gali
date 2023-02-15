from typing import Iterable

from gali.sources.abc_stemmed_cli_startup_chain import ABCStemmedCLIStartupChain


class RetroarchStartupChain(ABCStemmedCLIStartupChain):

    name = "Retroarch"
    stem = ["retroarch", "--libretro"]

    def get_start_command_suffix(self) -> Iterable[str]:
        return [self.game.core_path, self.game.game_path]