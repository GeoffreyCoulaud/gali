from dataclasses import dataclass, field

from gali.sources.game import Game


@dataclass
class LegendaryGame(Game):

    platform: str = field(default="PC", init=False)
    app_name: str = field(default=None)

    def get_start_command(self, **kwargs) -> tuple[str]:
        args = ["legendary", "launch", self.app_name]
        return tuple(args)
