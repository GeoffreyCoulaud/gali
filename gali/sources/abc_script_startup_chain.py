from abc import abstractmethod
from typing import Iterable
from tempfile import mkstemp
from os import remove

from gali.sources.abc_cli_startup_chain import ABCCLIStartupChain
from gali.utils.prepare_filename import prepare_filename


class ABCScriptStartupChain(ABCCLIStartupChain):
    """Class representing a startup chain that starts a game from generated shell script in a subprocess"""
    
    _tempfile: str

    @abstractmethod
    def make_script(self) -> None:
        """Make the shell script that will be started"""
        pass

    def prepare(self) -> None:
        """Create a temp file ready to contain a shell script"""
        game_type = prepare_filename(str(type(self.game)))
        game_name = prepare_filename(self.game.name)
        suffix = f"{game_type}-{game_name}.sh"
        (_, path) = mkstemp(suffix=suffix)
        self._tempfile = path
        self.make_script()

    def get_start_command(self) -> Iterable[str]:
        """Get the start command"""
        return ("sh", self._tempfile)

    def cleanup(self) -> None:
        """Delete the temp file"""
        try:
            remove(self._tempfile)
        except FileNotFoundError:
            # If the file doesn't exist, nothing to do.
            pass