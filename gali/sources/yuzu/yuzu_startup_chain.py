from typing import Iterable
from gali.sources.stemmed_shell_command_startup_chain import StemmedShellCommandStartupChain


class YuzuStartupChain(StemmedShellCommandStartupChain):

    stem = "yuzu"

    def get_start_command(self, game, **kwargs) -> Iterable[str]:
        return [game.game_path]