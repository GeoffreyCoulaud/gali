from typing import Iterable

from gali.sources.itch.itch_startup_chain import ItchStartupChain
from gali.sources.stemmed_shell_command_startup_chain import StemmedShellCommandStartupChain
from gali.sources.game import Game


class ItchScriptStartupChain(ItchStartupChain, StemmedShellCommandStartupChain):

    stem = ["sh"]

    def get_start_command_suffix(self, game: Game, **kwargs) -> Iterable[str]:
        # TODO
        pass