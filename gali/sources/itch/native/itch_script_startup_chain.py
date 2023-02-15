from typing import Iterable

from gali.sources.itch.abc_itch_startup_chain import ABCItchStartupChain
from gali.sources.abc_stemmed_cli_startup_chain import ABCStemmedCLIStartupChain

class ItchScriptStartupChain(ABCItchStartupChain, ABCStemmedCLIStartupChain):

    name = "Itch Shell script candidate"

    def make_script(self) -> Iterable[str]:
        # TODO
        pass