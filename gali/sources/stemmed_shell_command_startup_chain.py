from abc import abstractmethod
from typing import Iterable, MutableSequence

from gali.sources.shell_command_startup_chain import ShellCommandStartupChain
from gali.sources.game import Game


class StemmedShellCommandStartupChain(ShellCommandStartupChain):

    stem: MutableSequence[str] = list()

    @abstractmethod
    def get_start_command_suffix(self, game: Game, **kwargs) -> Iterable[str]:
        """Get the part that comes after the stem of the start command"""
        pass

    def get_start_command(self, game: Game, **kwargs) -> Iterable[str]:
        command = list()
        command.extend(self.stem)
        command.extend(self.get_start_command_suffix(game, **kwargs))
        return command