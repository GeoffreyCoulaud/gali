from typing import Iterable

from gali.sources.itch.itch_startup_chain import ItchStartupChain
from gali.sources.shell_command_startup_chain import ShellCommandStartupChain
from gali.sources.game import Game


class ItchLinuxStartupChain(ItchStartupChain, ShellCommandStartupChain):

    def get_start_command(self, game: Game, **kwargs) -> Iterable[str]:
        # TODO
        pass