from typing import Iterable

from gali.sources.abc_stemmed_cli_startup_chain import ABCStemmedCLIStartupChain
from gali.sources.yuzu.abc_yuzu_game import ABCYuzuGame


class YuzuStartupChain(ABCStemmedCLIStartupChain):

    game: ABCYuzuGame
    name = "Yuzu"
    stem = "yuzu"

    def get_start_command(self) -> Iterable[str]:
        return [self.game.game_path]