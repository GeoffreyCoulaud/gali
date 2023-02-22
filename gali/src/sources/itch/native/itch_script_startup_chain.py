from typing import Iterable

from gali.sources.itch.itch_startup_chain import ItchStartupChain
from gali.sources.stemmed_cli_startup_chain import StemmedCLIStartupChain

class ItchScriptStartupChain(ItchStartupChain, StemmedCLIStartupChain):

    name = "Itch Shell script candidate"

    def get_start_command_suffix(self) -> Iterable[str]:
        # TODO start itch script candidate
        pass