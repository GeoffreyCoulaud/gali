from typing import Iterable

from gali.sources.itch.abc_itch_startup_chain import ABCItchStartupChain
from gali.sources.abc_cli_startup_chain import ABCCLIStartupChain


class ItchLinuxStartupChain(ABCItchStartupChain, ABCCLIStartupChain):

    name = "Itch Linux candidate"

    def get_start_command(self) -> Iterable[str]:
        # TODO
        pass