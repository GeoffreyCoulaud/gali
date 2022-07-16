from dataclasses import dataclass, field

from gali.games.game import Game


@dataclass
class ItchGame(Game):

    platform: str = field(default="PC", init=False)
    verdict: str = field(default=None)
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

    def get_start_command(self, **kwargs) -> tuple[str]:
        # TODO implement itch game start command
        pass
