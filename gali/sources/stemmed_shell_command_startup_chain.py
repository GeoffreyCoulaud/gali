from abc import abstractmethod
from typing import Iterable, Sequence

from gali.sources.shell_command_startup_chain import ShellCommandStartupChain


class StemmedShellCommandStartupChain(ShellCommandStartupChain):

    stem: Sequence[str] = list()

    @abstractmethod
    def get_start_command_suffix(self) -> Iterable[str]:
        """Get the part that comes after the stem of the start command"""
        pass

    def get_start_command(self) -> Iterable[str]:
        command = list()
        command.extend(self.stem)
        command.extend(self.get_start_command_suffix(self.game))
        return command