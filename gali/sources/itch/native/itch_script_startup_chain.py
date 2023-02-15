from typing import Iterable

from gali.sources.itch.abc_itch_startup_chain import ABCItchStartupChain
from gali.sources.stemmed_cli_startup_chain import StemmedCLIStartupChain

class ItchScriptStartupChain(ABCItchStartupChain, StemmedCLIStartupChain):

    name = "Itch Shell script candidate"

    def make_script(self) -> Iterable[str]:
        # TODO
        pass