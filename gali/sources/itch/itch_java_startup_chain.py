from typing import Iterable

from gali.sources.itch.itch_startup_chain import ItchStartupChain
from gali.sources.stemmed_shell_command_startup_chain import StemmedShellCommandStartupChain


class ItchJavaStartupChain(ItchStartupChain, StemmedShellCommandStartupChain):

    name = "Itch Java candidate"
    stem = ["java", "-jar"]

    def get_start_command_suffix(self) -> Iterable[str]:
        # TODO 
        pass