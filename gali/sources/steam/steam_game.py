from dataclasses import dataclass, field

from gali.sources.game import Game


@dataclass
class SteamGame(Game):

    platform: str = field(default="PC", init=False)
    app_id: str = field(default=None)

    def get_start_command(self, **kwargs) -> tuple[str]:
        return ("xdg-open", f"steam://rungameid/{self.app_id}")
