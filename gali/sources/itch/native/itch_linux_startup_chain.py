from typing import Iterable

from gali.sources.itch.itch_startup_chain import ItchStartupChain
from gali.sources.cli_startup_chain import CLIStartupChain


class ItchLinuxStartupChain(ItchStartupChain, CLIStartupChain):

    name = "Itch Linux candidate"

    def get_start_command(self) -> Iterable[str]:
        # TODO
        pass