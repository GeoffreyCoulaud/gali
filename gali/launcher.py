from gi.repository import GObject

from gali.sources.startable import Startable


class GameRunningError(Exception):
    """Error raised when trying to change the launcher's game while it is running"""
    pass


class GameNotSetError(Exception):
    """Error raised when trying to start the launcher when no game is set"""
    pass


class Launcher(GObject.Object):
    """Singleton class representing a game launcher
    * Handles starting, stopping or killing a game"""

    __gtype_name__ = "GaliLauncher"

    game: Startable|None = None

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
    
    def start(self, **kwargs):
        """Start the set game. The resulting subprocess has its own process group.
        * Can raise GameNotSetError if no game is set"""
        
        if self.game is None: 
            raise GameNotSetError()
        
        # TODO start game in a multiprocessing pool of size 1
        # TODO define which startup chain is picked
        # TODO define which options to pass to the startup chain

    def stop(self, **kwargs) -> int|None:
        """Stop the running game"""
        # TODO stop the pool

    def kill(self, **kwargs):
        """Force kill the running game. Data loss can occur, please prefer the stop method"""
        # TODO force stop the pool 