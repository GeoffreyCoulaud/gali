from gi.repository import GObject
from multiprocessing.pool import Pool
from typing import Any

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
    pool: Pool

    def __init__(self) -> None:
        super().__init__()
        self.pool = Pool(processes=1)

    def is_running(self) -> bool:
        """Get the game running status"""
        if self.game is None: 
            return False
        if self.process is None:
            return False
        exit_code = self.process.poll()
        return (exit_code is None)

    def set_game(self, game: Startable):
        """Set the game for the launcher
        * Can raise GameRuningError if the current game is running"""
        if self.is_running():
            raise GameRunningError()
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

        # Start game in a multiprocessing pool of size 1
        self.pool.apply_async(startup_queue_subprocess, [], {
            "startup_chain": startup_chain,
            "game": self.game,
            "options": options
        })
        self.pool.close()
        self.pool.join()

    def stop(self) -> int|None:
        """Stop the running game"""
        # TODO stop the pool

    def kill(self):
        """Force kill the running game. Data loss can occur, please prefer the stop method"""
        # TODO force stop the pool 

def startup_queue_subprocess(startup_chain_class: type[StartupChain], game: Startable, options: dict[str, Any]) -> None:
    """Execute a game startup chain in an independent subprocess"""
    startup_chain = startup_chain_class()
    startup_chain.prepare(game=game, **options)
    startup_chain.start(game=game, **options)
    startup_chain.cleanup(game=game, **options)