from pathlib import Path
from gali.games.game import Game

class EmulationGame(Game):
	"""A class representing emulation games"""

	game_path: str = None

	def __init__(self, name, game_path) -> None:
		super().__init__(name)
		self.game_path = game_path
