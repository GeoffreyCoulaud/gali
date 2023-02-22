from dataclasses import dataclass, field

from gali.sources.generic_game import GenericGame


@dataclass
class ItchGame(GenericGame):

    platform: str = field(default="PC", init=False)
    caves: list = field(default=None)
    verdict: dict = field(default=None)
    game_id: str = field(default=None)
    
    # Example verdict structure
    """{
        "basePath": "/home/geoffrey/Jeux/itch/procrabstination",
        "totalSize": 193566920,
        "candidates": [
            {
                "path": "Procrabstination.x86_64",
                "depth": 1,
                "flavor": "linux",
                "arch": "amd64",
                "size": 14720
            }
        ]
    }"""