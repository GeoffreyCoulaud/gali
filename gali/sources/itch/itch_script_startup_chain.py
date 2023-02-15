from typing import Iterable

from gali.sources.itch.itch_startup_chain import ItchStartupChain
from gali.sources.abc_stemmed_cli_startup_chain import ABCStemmedCLIStartupChain

class ItchScriptStartupChain(ItchStartupChain, ABCStemmedCLIStartupChain):

    name = "Itch Shell script candidate"

    def make_script(self) -> Iterable[str]:
        # TODO
        pass