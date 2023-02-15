from abc import abstractmethod
from typing import Iterable
from shutil import which
from os import setsid
from subprocess import run

from gali.sources.startup_chain import StartupChain
from gali.utils.sandbox import is_flatpak


class CLIStartupChain(StartupChain):
    """Class representing a startup chain that starts a game from a command in a subprocess"""

    @abstractmethod
    def get_start_command(self) -> Iterable[str]:
        """Get the start command"""
        pass

    def start(self) -> None:
        """Start the game from its command in a subprocess"""
        
        # Get shell command
        args = list()
        if is_flatpak(): args.extend(["flatpak-spawn", "--host"])
        args.extend(self.get_start_command())
        
        # Resolve command path
        args[0] = which(args[0])
        
        # Start command in a subprocess
        print(f"Starting \"{self.game.name}\"")
        print(args)
        run(args=args, preexec_fn=setsid)