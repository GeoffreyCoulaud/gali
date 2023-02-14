from typing import Iterable

from gali.sources.itch.itch_startup_chain import ItchStartupChain
from gali.sources.shell_command_startup_chain import ShellCommandStartupChain


class ItchLinuxStartupChain(ItchStartupChain, ShellCommandStartupChain):

    def get_start_command(self) -> Iterable[str]:
        # TODO
        pass