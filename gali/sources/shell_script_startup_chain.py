from abc import abstractmethod
from typing import Iterable
from tempfile import mkstemp
from os import remove

from gali.sources.shell_command_startup_chain import ShellCommandStartupChain
from gali.utils.prepare_filename import prepare_filename
from gali.sources.game import Game

class ShellScriptStartupChain(ShellCommandStartupChain):
    """Class representing a startup chain that starts a game from shell script a subprocess"""
    
    _tempfile: str = None

    @abstractmethod
    def make_script(self, game: Game, **kwargs) -> None:
        """Make the shell script that will be started"""
        pass

    def prepare(self, game: Game, **kwargs) -> None:
        """Create a temp file ready to contain a shell script"""
        suffix = f"{prepare_filename(type(game))}-{prepare_filename(game.name)}.sh"
        (_, path) = mkstemp(suffix=suffix)
        self._tempfile = path
        self.make_script(game, **kwargs)

    def get_start_command(self, game: Game, **kwargs) -> Iterable[str]:
        """Get the start command"""
        return ("sh", self._tempfile)

    def cleanup(self, **kwargs) -> None:
        """Delete the temp file"""
        try:
            remove(self._tempfile)
        except FileNotFoundError:
            # If the file doesn't exist, nothing to do.
            pass