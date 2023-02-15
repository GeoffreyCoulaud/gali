from typing import Iterable

from gali.sources.itch.abc_itch_startup_chain import ABCItchStartupChain
from gali.sources.stemmed_cli_startup_chain import StemmedCLIStartupChain


class ItchJavaStartupChain(ABCItchStartupChain, StemmedCLIStartupChain):

    name = "Itch Java candidate"
    stem = ["java", "-jar"]

    def get_start_command_suffix(self) -> Iterable[str]:
        # TODO 
        pass