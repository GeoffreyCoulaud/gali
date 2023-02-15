from typing import Iterable

from gali.sources.itch.abc_itch_startup_chain import ABCItchStartupChain
from gali.sources.cli_startup_chain import CLIStartupChain


class ItchLinuxStartupChain(ABCItchStartupChain, CLIStartupChain):

    name = "Itch Linux candidate"

    def get_start_command(self) -> Iterable[str]:
        # TODO
        pass