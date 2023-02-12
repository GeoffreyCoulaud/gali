from dataclasses import dataclass, field

from gali.sources.emulation_game import EmulationGame


@dataclass
class YuzuGame(EmulationGame):

    platform: str = field(default="Nintendo - Switch", init=False)

    def get_start_command(self, **kwargs) -> tuple[str]:
        return ("yuzu", self.game_path)


@dataclass
class YuzuFlatpakGame(YuzuGame):

    def get_start_command(self, **kwargs) -> tuple[str]:
        return ("flatpak", "run", "org.yuzu_emu.yuzu", self.game_path)
