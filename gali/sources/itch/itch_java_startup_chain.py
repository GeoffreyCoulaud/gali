from typing import Iterable

from gali.sources.itch.abc_itch_startup_chain import ABCItchStartupChain
from gali.sources.abc_stemmed_cli_startup_chain import ABCStemmedCLIStartupChain


class ItchJavaStartupChain(ABCItchStartupChain, ABCStemmedCLIStartupChain):

    name = "Itch Java candidate"
    stem = ["java", "-jar"]

    def get_start_command_suffix(self) -> Iterable[str]:
        # TODO 
        pass