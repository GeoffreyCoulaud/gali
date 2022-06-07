from dataclasses import dataclass, field

from gali.games.emulation_game import EmulationGame


@dataclass
class PPSSPPGame(EmulationGame):

    platform: str = field(default="Sony - PSP", init=False)

    def get_start_command(self, **kwargs) -> tuple[str]:
        return ("PPSSPPSDL", self.game_path)


@dataclass
class PPSSPPFlatpakGame(PPSSPPGame):

    def get_start_command(self, **kwargs) -> tuple[str]:
        return ("flatpak", "run", "org.ppsspp.PPSSPP", self.game_path)
