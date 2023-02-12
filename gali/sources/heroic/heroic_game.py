from dataclasses import dataclass, field

from gali.sources.game import Game


@dataclass
class HeroicGame(Game):

    platform: str = field(default="PC", init=False)
    app_name: str = field(default=None)

    def get_start_command(self, **kwargs) -> tuple[str]:
        args = ["xdg-open", f"heroic://launch/{self.app_name}"]
        return tuple(args)
