from abc import abstractmethod
from typing import Iterable
from tempfile import mkstemp
from os import remove

from gali.sources.cli_startup_chain import CLIStartupChain


class ScriptStartupChain(CLIStartupChain):
    """Class representing a startup chain that starts a game from generated shell script in a subprocess"""
    
    tempfile: str

    @abstractmethod
    def make_script(self) -> None:
        """Make the shell script that will be started"""
        pass

    def prepare(self) -> None:
        """Create a temp file ready to contain a shell script"""
        (_, path) = mkstemp()
        self.tempfile = path
        self.make_script()

    def get_start_command(self) -> Iterable[str]:
        """Get the start command"""
        return ("sh", self.tempfile)

    def cleanup(self) -> None:
        """Delete the temp file"""
        try:
            remove(self.tempfile)
        except FileNotFoundError:
            # If the file doesn't exist, nothing to do.
            pass