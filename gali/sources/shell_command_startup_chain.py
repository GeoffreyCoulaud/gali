from abc import abstractmethod
from typing import Iterable
from shutil import which
from os import setsid
from subprocess import run

from gali.sources.startup_chain import StartupChain
from gali.utils.sandbox import is_flatpak
from gali.sources.game import Game

class ShellCommandStartupChain(StartupChain):
    """Class representing a startup chain that starts a game from a command in a subprocess"""
    
    _process = None

    @abstractmethod
    def get_start_command(self, game: Game, **kwargs) -> Iterable[str]:
        """Get the start command"""
        pass

    def start(self, game: Game, **kwargs) -> None:
        """Start the game from its command in a subprocess"""
        
        # Get shell command
        args = list()
        if is_flatpak(): args.extend(["flatpak-spawn", "--host"])
        args.extend(self.get_start_command())
        
        # Resolve command path
        args[0] = which(args[0])
        
        # Start command in a subprocess
        print(f"Starting \"{game.name}\"")
        print(args)
        run(args=args, preexec_fn=setsid)