from typing import Iterable

from gali.sources.stemmed_cli_startup_chain import StemmedCLIStartupChain
from gali.sources.citra.abc_citra_game import ABCCitraGame


class ABCCitraStartupChain(StemmedCLIStartupChain):

    game: ABCCitraGame

    def get_start_command_suffix(self) -> Iterable[str]:
        return [self.game.game_path]