from typing import Iterable

from gali.sources.stemmed_shell_command_startup_chain import StemmedShellCommandStartupChain


class LegendaryStartupChain(StemmedShellCommandStartupChain):

    stem = ["legendary", "launch"]

    def get_start_command_suffix(self, game, **kwargs) -> Iterable[str]:
        return [game.app_name]