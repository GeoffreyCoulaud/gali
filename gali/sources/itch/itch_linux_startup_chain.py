from typing import Iterable

from gali.sources.itch.itch_startup_chain import ItchStartupChain
from gali.sources.abc_cli_startup_chain import ABCCLIStartupChain


class ItchLinuxStartupChain(ItchStartupChain, ABCCLIStartupChain):

    name = "Itch Linux candidate"

    def get_start_command(self) -> Iterable[str]:
        # TODO
        pass