from typing import Iterable

from gali.sources.itch.itch_startup_chain import ItchStartupChain
from gali.sources.stemmed_cli_startup_chain import StemmedCLIStartupChain

class ItchScriptStartupChain(ItchStartupChain, StemmedCLIStartupChain):

    name = "Itch Shell script candidate"

    def make_script(self) -> Iterable[str]:
        # TODO
        pass