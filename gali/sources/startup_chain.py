from abc import ABC, abstractmethod
from typing import Any

from gali.sources.startable import Startable


class StartupChain(ABC):
    """Class representing a startup chain for a startable object.
    
    A startup chain represents a broad method of starting a game of a certain type.

    The goal is to present multiple launch methods to the end user, 
    think of the Steam popup asking if you want to launch with DirectX or Vulkan.
    
    Don't use a different startup chain for small options change like fullscreen on/off.
    In that case, specify launch options for the user that will be passed to the StartupChain.
    
    The order in which the steps execute is: 
    1. prepare
    2. start
    3. (game terminates) 
    4. cleanup
    """

    name: str
    game: Startable
    options: dict[str, Any]

    def __init__(self, game: Startable, options: dict[str, Any]) -> None:
        """Create a startup chain.
        
        Keys for options are strings, values are of any type. 
        The available key and value types are specific to every startup chain."""
        super().__init__()
        self.game = game
        self.options = options

    def prepare(self) -> None:
        """Method to run before starting the game"""
        pass
    
    @abstractmethod
    def start(self) -> None:
        """Start the game"""
        pass

    def cleanup(self) -> None:
        """Method to run after the game has terminated"""
        pass