from gali.games.emulation_game import EmulationGame
from gali.processes.citra_process import CitraProcess

class CitraGame(EmulationGame):

	platform = "Nintendo - 3DS"
	process_class = CitraProcess