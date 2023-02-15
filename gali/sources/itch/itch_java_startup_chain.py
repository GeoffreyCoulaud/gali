from typing import Iterable

from gali.sources.itch.itch_startup_chain import ItchStartupChain
from gali.sources.abc_stemmed_cli_startup_chain import ABCStemmedCLIStartupChain


class ItchJavaStartupChain(ItchStartupChain, ABCStemmedCLIStartupChain):

    name = "Itch Java candidate"
    stem = ["java", "-jar"]

    def get_start_command_suffix(self) -> Iterable[str]:
        # TODO 
        pass