from typing import Iterable

from gali.sources.stemmed_shell_command_startup_chain import StemmedShellCommandStartupChain
from gali.sources.game import Game


class YuzuStartupChain(StemmedShellCommandStartupChain):

    stem = "yuzu"

    def get_start_command(self, game: Game, **kwargs) -> Iterable[str]:
        return [game.game_path]