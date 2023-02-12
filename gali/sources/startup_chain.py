from abc import ABC, abstractmethod
from gali.sources.game import Game


class StartupChain(ABC):
    """Class representing a startup chain for a startable object.
    
    The order of execution is prepare > start > cleanup"""

    name: str

    def prepare(self, game: Game, **kwargs) -> None:
        """Method to run before starting the game"""
        pass
    
    @abstractmethod
    def start(self, game: Game, **kwargs) -> None:
        """Start the game"""
        pass

    def cleanup(self, game: Game, **kwargs) -> None:
        """Method to run after the game has terminated"""
        pass