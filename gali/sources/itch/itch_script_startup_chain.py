from typing import Iterable

from gali.sources.itch.itch_startup_chain import ItchStartupChain
from gali.sources.stemmed_shell_command_startup_chain import StemmedShellCommandStartupChain

class ItchScriptStartupChain(ItchStartupChain, StemmedShellCommandStartupChain):

    name = "Itch Shell script candidate"

    def make_script(self) -> Iterable[str]:
        # TODO
        pass