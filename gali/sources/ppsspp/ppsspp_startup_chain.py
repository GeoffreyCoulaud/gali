from typing import Iterable

from gali.sources.abc_stemmed_cli_startup_chain import ABCStemmedCLIStartupChain


class PPSSPPStartupChain(ABCStemmedCLIStartupChain):

    name = "PPSSPP SDL frontend"
    stem = ["PPSSPPSDL"]

    def get_start_command_suffix(self) -> Iterable[str]:
        return [self.game.game_path]