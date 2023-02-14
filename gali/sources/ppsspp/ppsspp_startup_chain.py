from typing import Iterable

from gali.sources.stemmed_shell_command_startup_chain import StemmedShellCommandStartupChain


class PPSSPPStartupChain(StemmedShellCommandStartupChain):

    name = "PPSSPP SDL frontend"
    stem = ["PPSSPPSDL"]

    def get_start_command_suffix(self) -> Iterable[str]:
        return [self.game.game_path]