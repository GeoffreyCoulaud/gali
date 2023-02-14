from typing import Iterable

from gali.sources.stemmed_shell_command_startup_chain import StemmedShellCommandStartupChain
from gali.sources.game import Game


class DolphinStartupChain(StemmedShellCommandStartupChain):

    stem = ["dolphin-emu"]

    def get_start_command_suffix(self, game: Game, **kwargs) -> Iterable[str]:
        suffix = list()
        if kwargs["no_ui"]: suffix.append("-b")
        suffix.extend(["-e", game.game_path])
        return suffix