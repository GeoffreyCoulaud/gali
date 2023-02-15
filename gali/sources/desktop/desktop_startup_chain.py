import re
import shlex
from typing import Iterable

from gali.sources.abc_cli_startup_chain import ABCCLIStartupChain


class DesktopStartupChain(ABCCLIStartupChain):

    name = "Desktop Entry"

    def get_start_command(self) -> Iterable[str]:
        def filter_fn(string: str):
            unwanted = re.compile("%[fFuUdDnNickvm]")
            return unwanted.fullmatch(string) is None
        split_exec = shlex.split(self.game.exec_str)
        args = tuple(filter(filter_fn, split_exec))
        return args