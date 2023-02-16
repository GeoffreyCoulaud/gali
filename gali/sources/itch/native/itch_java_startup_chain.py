from typing import Iterable

from gali.sources.itch.itch_startup_chain import ItchStartupChain
from gali.sources.stemmed_cli_startup_chain import StemmedCLIStartupChain


class ItchJavaStartupChain(ItchStartupChain, StemmedCLIStartupChain):

    name = "Itch Java candidate"
    stem = ["java", "-jar"]

    def get_start_command_suffix(self) -> Iterable[str]:
        # TODO start itch java candidate
        pass