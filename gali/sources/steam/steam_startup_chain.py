from typing import Iterable

from gali.sources.stemmed_shell_command_startup_chain import StemmedShellCommandStartupChain


class SteamStartupChain(StemmedShellCommandStartupChain):

    stem = "xdg-open"

    def get_start_command_suffix(self) -> Iterable[str]:
        return [f"steam://rungameid/{self.game.app_id}"]