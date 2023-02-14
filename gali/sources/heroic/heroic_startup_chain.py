from typing import Iterable

from gali.sources.stemmed_shell_command_startup_chain import StemmedShellCommandStartupChain


class HeroicStartupChain(StemmedShellCommandStartupChain):

    stem = ["xdg-open"]

    def get_start_command_suffix(self) -> Iterable[str]:
        return [f"heroic://launch/{self.game.app_name}"]