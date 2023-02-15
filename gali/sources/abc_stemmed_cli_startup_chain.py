from abc import abstractmethod
from typing import Iterable, Sequence

from gali.sources.abc_cli_startup_chain import ABCCLIStartupChain


class ABCStemmedCLIStartupChain(ABCCLIStartupChain):

    stem: Sequence[str] = list()

    @abstractmethod
    def get_start_command_suffix(self) -> Iterable[str]:
        """Get the part that comes after the stem of the start command"""
        pass

    def get_start_command(self) -> Iterable[str]:
        command: list[str] = list()
        command.extend(self.stem)
        command.extend(self.get_start_command_suffix())
        return command