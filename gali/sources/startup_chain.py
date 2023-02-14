from abc import ABC, abstractmethod

from gali.sources.game import Game


class StartupChain(ABC):
    """Class representing a startup chain for a startable object.
    
    A startup chain represents a broad method of starting a game.
    For example, with a ShellCommandStartupChain, if you would use a different command altogether, 
    prefer using multiple StartupChain classes.

    The goal is to present multiple launch methods to the end user, 
    think of the Steam popup asking if you want to launch with DirectX or Vulkan.
    
    Don't use a different startup chain for small options change like fullscreen on/off.
    In that case, specify launch options for the user that will be passed to the StartupChain.
    
    The order of execution is 
    1. prepare, 
    2. start
    3. (game terminates) cleanup"""

    name: str

    def prepare(self, game: Game, **kwargs) -> None:
        """Method to run before starting the game"""
        pass
    
    @abstractmethod
    def start(self, game : Game, **kwargs) -> None:
        """Start the game"""
        pass

    def cleanup(self, game: Game, **kwargs) -> None:
        """Method to run after the game has terminated"""
        pass