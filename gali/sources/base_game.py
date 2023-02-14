from dataclasses import dataclass, field

from gali.sources.startable import Startable


@dataclass
class BaseGame(Startable):
    """Base class representing a game"""

    name: str = field(default="")
    platform: str = field(default="")
    is_installed: bool = field(default=True)
    
    # TODO extract to an interface
    # image_box_art: str = field(default=None, compare=False)
    # image_banner: str = field(default=None, compare=False)
    # image_icon: str = field(default=None, compare=False)

    def __str__(self) -> str:
        name = self.name.replace("\n", " ")
        return name
