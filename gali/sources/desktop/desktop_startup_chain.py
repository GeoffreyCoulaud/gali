import re
import shlex
from typing import Iterable

from gali.sources.shell_command_startup_chain import ShellCommandStartupChain


class DesktopStartupChain(ShellCommandStartupChain):

    name = "Desktop Entry"

    def get_start_command(self) -> Iterable[str]:
        def filter_fn(string: str):
            unwanted = re.compile("%[fFuUdDnNickvm]")
            return unwanted.fullmatch(string) is None
        split_exec = shlex.split(self.game.exec_str)
        args = tuple(filter(filter_fn, split_exec))
        return args