from dataclasses import dataclass, field

from gali.sources.emulation_game import EmulationGame
from gali.utils.prepare_filename import prepare_filename
from gali.utils.locations import XDG_DATA_HOME
from gali.utils.lutris_export_script import lutris_export_script
from gali.utils.wine_path import posix_to_wine


@dataclass
class CemuGame(EmulationGame):
    """Abstract class representing a Cemu game"""

    platform: str = field(default="Nintendo - Wii U", init=False)


@dataclass
class CemuLutrisGame(CemuGame):
    """Class representing a Cemu in Lutris game"""

    wine_prefix_path: str = field(default=None)

    def get_start_command(self, **kwargs) -> tuple[str]:

        # Create base cemu lutris start script
        safe_game_name = prepare_filename(self.name)
        script_basename = f"lutris-cemu-{safe_game_name}.sh"
        script_path = f"{XDG_DATA_HOME}/gali/{script_basename}"
        lutris_export_script("cemu", script_path)

        # Get cemu args
        game_path_wine = posix_to_wine(self.game_path)
        args = ("--game", game_path_wine)

        # Add cemu arguments to script
        file_contents = ""
        with open(script_path, "r", encoding="utf-8-sig") as file:
            file_contents = file.read().rstrip()
        to_append = " " + " ".join(args)
        file_contents += to_append
        with open(script_path, "w", encoding="utf-8-sig") as file:
            file.write(file_contents)

        return ("sh", script_path)
