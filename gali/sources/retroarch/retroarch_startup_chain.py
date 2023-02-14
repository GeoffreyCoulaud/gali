from typing import Iterable

from gali.sources.stemmed_shell_command_startup_chain import StemmedShellCommandStartupChain


class RetroarchStartupChain(StemmedShellCommandStartupChain):

    name = "Retroarch"
    stem = ["retroarch", "--libretro"]

    def get_start_command_suffix(self) -> Iterable[str]:
        return [self.game.core_path, self.game.game_path]