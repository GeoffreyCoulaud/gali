from typing import Iterable

from gali.sources.stemmed_shell_command_startup_chain import StemmedShellCommandStartupChain


class CitraStartupChain(StemmedShellCommandStartupChain):

    stem = ["citra-qt"]

    def get_start_command_suffix(self) -> Iterable[str]:
        return [self.game.game_path]