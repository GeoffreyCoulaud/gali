from typing import Iterable

from gali.sources.stemmed_cli_startup_chain import StemmedCLIStartupChain
from gali.sources.retroarch.abc_retroarch_game import ABCRetroarchGame


class ABCRetroarchStartupChain(StemmedCLIStartupChain):

    game: ABCRetroarchGame

    def get_start_command_suffix(self) -> Iterable[str]:
        return [self.game.core_path, self.game.game_path]