from dataclasses import dataclass, field

from gali.sources.emulation_game import EmulationGame


@dataclass
class RetroarchGame(EmulationGame):

    core_path: str = field(default=None)

    def get_start_command(self, **kwargs) -> tuple[str]:
        return ("retroarch", "--libretro", self.core_path, self.game_path)


@dataclass
class RetroarchFlatpakGame(RetroarchGame):

    def get_start_command(self, **kwargs) -> tuple[str]:
        args = ["flatpak", "run", "org.libretro.RetroArch"]
        retroarch_command = super().get_start_command(**kwargs)
        retroarch_command = retroarch_command[1:]
        args.extend(retroarch_command)
        return tuple(args)
