from dataclasses import dataclass, field

from gali.games.game import Game
from gali.utils.locations import XDG_DATA_HOME
from gali.utils.lutris_export_script import lutris_export_script
from gali.utils.prepare_filename import prepare_filename

@dataclass
class LutrisGame(Game):

	platform : str = field(default="PC", init=False)
	game_slug : str = field(default=None)
	config_path : str = field(default=None)

	def get_start_command(self, **kwargs) -> tuple[str]:
		safe_game_slug = prepare_filename(self.game_slug)
		script_basename = f"lutris-{safe_game_slug}.sh"
		script_path = f"{XDG_DATA_HOME}/gali/{script_basename}"
		lutris_export_script(self.game_slug, script_path)
		return ("sh", script_path)