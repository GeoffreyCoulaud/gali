from typing import Iterable

from gali.sources.stemmed_cli_startup_chain import StemmedCLIStartupChain
from gali.sources.yuzu.abc_yuzu_game import ABCYuzuGame


class ABCYuzuStartupChain(StemmedCLIStartupChain):

    game: ABCYuzuGame

    def get_start_command(self) -> Iterable[str]:
        return [self.game.game_path]