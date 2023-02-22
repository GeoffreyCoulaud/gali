from abc import ABC


class Game(ABC):
    """Abstract base class representing a game.
    * For type-checking purposes only, inherit directly from BaseGame."""

    name: str
    platform: str
    is_installed: bool