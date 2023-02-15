from typing import Iterable

from gali.sources.stemmed_cli_startup_chain import StemmedCLIStartupChain
from gali.sources.dolphin.dolphin_game import DolphinGame


class DolphinStartupChain(StemmedCLIStartupChain):

    game: DolphinGame

    def get_start_command_suffix(self) -> Iterable[str]:
        suffix = list()
        # TODO add option to hide the UI
        # if kwargs["no_ui"]: suffix.append("-b")
        suffix.extend(["-e", self.game.game_path])
        return suffix