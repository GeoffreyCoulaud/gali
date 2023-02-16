from gi.repository import GObject
from multiprocessing import Process
from typing import Any, Mapping

from gali.sources.game import Game
from gali.sources.startable import Startable
from gali.sources.startup_chain import StartupChain


class GameRunningError(Exception):
    """Error raised when trying to change the launcher's game while it is running"""
    pass


class GameNotSetError(Exception):
    """Error raised when trying to start the launcher when no game is set"""
    pass


class NoStartupChainError(Exception):
    """Error raised when trying to start the launcher when the game has no startup chain"""
    pass


class Launcher(GObject.Object):
    """Singleton class representing a game launcher
    * Handles starting, stopping or killing a game"""

    __gtype_name__ = "GaliLauncher"

    game: Startable|None = None
    process: Process|None = None

    def __init__(self) -> None:
        super().__init__()

    def set_game(self, game: Startable):
        """Set the game for the launcher"""
        self.game = game

    def start(self):
        """Start the set game. The resulting subprocess has its own process group.
        * Can raise GameNotSetError if no game is set"""
        
        if self.game is None: 
            raise GameNotSetError()

        if len(self.game.startup_chains) == 0:
            raise NoStartupChainError()

        # TODO define which startup chain is picked
        startup_chain = self.game.startup_chains[0]

        # TODO define which options to pass to the startup chain
        options = dict()

        # Start game in a subprocess
        self.process = Process(
            target=startup_chain_worker, 
            kwargs={
                "startup_chain_class": startup_chain,
                "game": self.game,
                "options": options
            }
        )
        self.process.start()

    def terminate(self) -> None:
        """Stop the running game"""
        self.process.terminate()

    def kill(self) -> None:
        """Force kill the running game. 
        * Data loss can occur, please prefer the terminate method"""
        self.process.kill()

def startup_chain_worker(*args, startup_chain_class: type[StartupChain], game: Game, options: Mapping[str, Any]) -> None:
    """Execute a game startup chain in an independent subprocess"""
    
    # Execute the startup chain
    startup_chain = startup_chain_class(game=game, options=options)
    startup_chain.prepare()
    startup_chain.start()
    startup_chain.cleanup()

    # Notify that the game process has terminated
    # TODO use dbus (maybe) to notify that the process terminated
    print("Game startup chain finished :D")