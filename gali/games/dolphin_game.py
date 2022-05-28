from dataclasses import dataclass, field

from gali.games.emulation_game import EmulationGame

@dataclass
class DolphinGame(EmulationGame):

	platform: str = field(default="Nintendo - Gamecube / Wii", init=False)

	def get_start_command(self, **kwargs) -> tuple[str]:
		args = ["dolphin-emu"]
		if kwargs["no_ui"]: args.append("-b")
		args.extend(["-e", self.game_path])
		return tuple(args)

class DolphinFlatpakGame(DolphinGame):

	def get_start_command(self, **kwargs) -> tuple[str]:
		args = ["flatpak", "run", "org.DolphinEmu.dolphin-emu"]
		dolphin_command = super().get_start_command(**kwargs)
		dolphin_command = dolphin_command[1:]
		args.extend(dolphin_command)
		return tuple(args)