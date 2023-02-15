from typing import Iterable

from gali.sources.abc_stemmed_cli_startup_chain import ABCStemmedCLIStartupChain
from gali.sources.ppsspp.abc_ppsspp_game import ABCPPSSPPGame


class ABCPPSSPPStartupChain(ABCStemmedCLIStartupChain):

    game: ABCPPSSPPGame

    def get_start_command_suffix(self) -> Iterable[str]:
        return [self.game.game_path]