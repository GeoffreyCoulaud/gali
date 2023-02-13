from typing import Iterable

from gali.sources.stemmed_shell_command_startup_chain import StemmedShellCommandStartupChain


class RetroarchStartupChain(StemmedShellCommandStartupChain):

    stem = ["retroarch", "--libretro"]

    def get_start_command_suffix(self, game, **kwargs) -> Iterable[str]:
        return [game.core_path, game.game_path]