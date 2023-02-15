from typing import Iterable

from gali.sources.abc_stemmed_cli_startup_chain import ABCStemmedCLIStartupChain
from gali.sources.dolphin.abc_dolphin_game import ABCDolphinGame


class DolphinNativeStartupChain(ABCStemmedCLIStartupChain):

    game: ABCDolphinGame
    name = "Dolphin"
    stem = ["dolphin-emu"]

    def get_start_command_suffix(self) -> Iterable[str]:
        suffix = list()
        # TODO add option to hide the UI
        # if kwargs["no_ui"]: suffix.append("-b")
        suffix.extend(["-e", self.game.game_path])
        return suffix