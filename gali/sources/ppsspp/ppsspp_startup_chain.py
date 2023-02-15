from typing import Iterable

from gali.sources.stemmed_cli_startup_chain import StemmedCLIStartupChain
from gali.sources.ppsspp.ppsspp_game import PPSSPPGame


class PPSSPPStartupChain(StemmedCLIStartupChain):

    game: PPSSPPGame

    def get_start_command_suffix(self) -> Iterable[str]:
        return [self.game.game_path]