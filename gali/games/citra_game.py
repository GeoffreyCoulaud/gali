from dataclasses import dataclass, field

from gali.games.emulation_game import EmulationGame

@dataclass
class CitraGame(EmulationGame):

	platform: str = field(default="Nintendo - 3DS", init=False)

	def get_start_command(self, **kwargs) -> tuple[str]:
		return ("citra-qt", self.game_path)

@dataclass
class CitraFlatpakGame(CitraGame):

	def get_start_command(self, **kwargs) -> tuple[str]:
		return ("flatpak", "run", "org.citra_emu.citra", self.game_path)